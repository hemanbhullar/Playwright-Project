import { mkdir } from 'node:fs/promises';
import path from 'node:path';

export async function artifactDirectory(name: string, id: string): Promise<string> {
  const slug = name.replace(/[^a-zA-Z0-9-]+/g, '-').slice(0, 100);
  const directory = path.join(process.env.REPORT_DIR ?? 'report/manual', 'artifacts', `${slug}-${id}`);
  await mkdir(directory, { recursive: true });
  return directory;
}
