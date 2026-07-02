import { access, mkdir, copyFile, rm, cp } from 'node:fs/promises';
import { constants } from 'node:fs';

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

await copyFile('index.html', 'dist/index.html');
await cp('src', 'dist/src', { recursive: true });
await cp('docs', 'dist/docs', { recursive: true });

for (const file of ['_headers', '_redirects']) {
  if (await exists(file)) {
    await copyFile(file, `dist/${file}`);
  }
}

console.log('Static build ready in dist/');
