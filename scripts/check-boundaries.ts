import fs from 'node:fs';
import path from 'node:path';

interface Violation {
  file: string;
  rule: string;
  details: string;
}

const ROOT = process.cwd();
const VIOLATIONS: Violation[] = [];

// Allowlist regexes for files permitted to have 'use client'
const USE_CLIENT_ALLOWLIST = [
  /^components\/islands\/.+\.tsx?$/,
];

const SCAN_DIRS = ['app', 'components', 'lib'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);

function walk(dir: string, fileList: string[] = []): string[] {
  const fullPath = path.resolve(ROOT, dir);
  if (!fs.existsSync(fullPath)) return fileList;

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '__tests__') {
      continue;
    }
    const relativePath = path.relative(ROOT, path.join(fullPath, entry.name));
    if (entry.isDirectory()) {
      walk(relativePath, fileList);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      fileList.push(relativePath.replace(/\\/g, '/'));
    }
  }
  return fileList;
}

function checkFile(relPath: string) {
  const fullPath = path.resolve(ROOT, relPath);
  const content = fs.readFileSync(fullPath, 'utf-8');

  // 1. Verifica 'use client'
  const hasUseClient = /^\s*['"]use client['"]/m.test(content);
  if (hasUseClient) {
    const isAllowed = USE_CLIENT_ALLOWLIST.some((re) => re.test(relPath));
    if (!isAllowed) {
      VIOLATIONS.push({
        file: relPath,
        rule: 'allowlist-use-client',
        details: `'use client' directive is strictly prohibited here. Allowed only in app/[lang]/tools/*/tool.tsx or components/islands/*`,
      });
    }
  }

  // 2. Client files não podem importar server modules ou dicionários brutos
  const isClientFile = USE_CLIENT_ALLOWLIST.some((re) => re.test(relPath));
  if (isClientFile) {
    if (content.includes("from 'server-only'") || content.includes('from "server-only"')) {
      VIOLATIONS.push({
        file: relPath,
        rule: 'client-no-server-only',
        details: `Client component must not import 'server-only'.`,
      });
    }

    if (/@\/lib\/content(\/|'|")/.test(content)) {
      VIOLATIONS.push({
        file: relPath,
        rule: 'client-no-content-pipeline',
        details: `Client component must not import markdown/content engine (@/lib/content).`,
      });
    }

    // Proíbe import de valor de dicionários brutos (import type { ... } é tolerado)
    const rawImportDict = /import\s+(?!type\b)(?:{[^}]*}|[A-Za-z0-9_]+)\s+from\s+['"]@\/lib\/i18n\/dictionaries/m;
    if (rawImportDict.test(content)) {
      VIOLATIONS.push({
        file: relPath,
        rule: 'client-no-raw-dictionary-values',
        details: `Client component must not import dictionary values directly. Pass localized labels via props.`,
      });
    }
  }

  // 3. Content pages não podem importar ilhas nem 'client-only'
  const isContentCode =
    relPath.startsWith('app/[lang]/posts') ||
    relPath.startsWith('lib/content');

  if (isContentCode) {
    if (content.includes("from 'client-only'") || content.includes('from "client-only"')) {
      VIOLATIONS.push({
        file: relPath,
        rule: 'content-no-client-only',
        details: `Server content must not import 'client-only'.`,
      });
    }

    if (/@\/tools(\/|'|")/.test(content)) {
      VIOLATIONS.push({
        file: relPath,
        rule: 'content-no-tools-dependency',
        details: `Content pipeline or pages must not import from @/tools.`,
      });
    }

    if (/@\/components\/islands(\/|'|")/.test(content)) {
      VIOLATIONS.push({
        file: relPath,
        rule: 'content-no-islands-dependency',
        details: `Content pages must remain pure static RSC and not import client islands.`,
      });
    }
  }
}

function run() {
  const allFiles: string[] = [];
  for (const dir of SCAN_DIRS) {
    walk(dir, allFiles);
  }

  for (const file of allFiles) {
    checkFile(file);
  }

  if (VIOLATIONS.length > 0) {
    console.error('\n❌ Architectural Boundary Violations Found:');
    for (const v of VIOLATIONS) {
      console.error(`  - [${v.rule}] ${v.file}: ${v.details}`);
    }
    console.error(`\nTotal violations: ${VIOLATIONS.length}`);
    process.exit(1);
  } else {
    console.log(`✓ Architecture boundaries check passed (${allFiles.length} files scanned). Zero unauthorized 'use client' directives.`);
  }
}

run();
