import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export function runSuite(suite: 'cart' | 'login' | 'home-shopping' | 'shopping'): void {
  const root = path.resolve(__dirname, '..');
  const runId = `${suite}-${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`;
  const reportDir = path.join(root, 'report', runId);
  mkdirSync(reportDir, { recursive: true });
  console.log(`Chrome ${suite} suite — reports: ${reportDir}`);
  const child = spawn(process.execPath, [
    path.join(root, 'node_modules', '@cucumber', 'cucumber', 'bin', 'cucumber.js'),
    '--config', 'cucumber.cjs', ...process.argv.slice(2),
  ], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, REPORT_DIR: reportDir, FEATURE_PATH: `features/${suite}.feature` },
  });
  child.on('error', error => { console.error(error); process.exitCode = 1; });
  child.on('exit', (code, signal) => {
    console.log(`Spark Extent report: ${path.join(reportDir, 'extent.html')}`);
    process.exitCode = signal ? 1 : (code ?? 1);
  });
}
