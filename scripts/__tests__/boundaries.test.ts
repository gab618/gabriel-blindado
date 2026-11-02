import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';

describe('Architectural Boundary Guardrails', () => {
  it('executes check-boundaries.ts and confirms zero violations in the repository', () => {
    const scriptPath = path.resolve(process.cwd(), 'scripts/check-boundaries.ts');
    const output = execSync(
      `node --no-warnings --experimental-strip-types "${scriptPath}"`,
      { encoding: 'utf-8' }
    );

    expect(output).toContain('✓ Architecture boundaries check passed');
    expect(output).toContain('Zero unauthorized \'use client\' directives');
  });
});
