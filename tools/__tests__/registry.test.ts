import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { TOOLS_REGISTRY, getToolBySlug } from '../registry';
import { ACTIVE_LOCALES } from '@/lib/i18n/config';

describe('Tools Registry Integrity', () => {
  const toolsAppDir = path.resolve(process.cwd(), 'app/[lang]/tools');

  it('contains at least one registered tool', () => {
    expect(TOOLS_REGISTRY.length).toBeGreaterThan(0);
  });

  it('ensures each tool has unique slugs and valid metadata', () => {
    const slugs = new Set<string>();

    for (const tool of TOOLS_REGISTRY) {
      expect(tool.slug).toMatch(/^[a-z0-9-]+$/);
      expect(slugs.has(tool.slug)).toBe(false);
      slugs.add(tool.slug);

      // Check localization for active locales
      for (const lang of ACTIVE_LOCALES) {
        expect(tool.title[lang]?.trim().length).toBeGreaterThan(0);
        expect(tool.description[lang]?.trim().length).toBeGreaterThan(0);
      }

      // Check keywords
      expect(tool.keywords.length).toBeGreaterThan(0);

      // Check date format YYYY-MM-DD
      expect(tool.addedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('ensures every tool slug in the registry exists on disk in app/[lang]/tools/<slug>', () => {
    for (const tool of TOOLS_REGISTRY) {
      const toolDir = path.join(toolsAppDir, tool.slug);
      expect(fs.existsSync(toolDir), `Directory ${toolDir} should exist`).toBe(true);

      const pageFile = path.join(toolDir, 'page.tsx');
      expect(fs.existsSync(pageFile), `page.tsx in ${toolDir} should exist`).toBe(true);

      const toolComponentFile = path.join(toolDir, 'tool.tsx');
      expect(fs.existsSync(toolComponentFile), `tool.tsx in ${toolDir} should exist`).toBe(true);
    }
  });

  it('ensures every tool directory on disk is registered in TOOLS_REGISTRY', () => {
    const entries = fs.readdirSync(toolsAppDir, { withFileTypes: true });
    const diskToolDirs = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith('_') && !e.name.startsWith('.'))
      .map((e) => e.name);

    const registrySlugs = TOOLS_REGISTRY.map((t) => t.slug);

    for (const dirName of diskToolDirs) {
      expect(
        registrySlugs.includes(dirName),
        `Directory "${dirName}" in app/[lang]/tools is missing from TOOLS_REGISTRY`
      ).toBe(true);
    }
  });

  it('retrieves tool correctly by slug via getToolBySlug', () => {
    const tool = getToolBySlug('base-converter');
    expect(tool).toBeDefined();
    expect(tool?.slug).toBe('base-converter');

    const nonExistent = getToolBySlug('non-existent-tool');
    expect(nonExistent).toBeUndefined();
  });
});
