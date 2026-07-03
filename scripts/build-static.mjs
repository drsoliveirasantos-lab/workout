import { access, mkdir, copyFile, rm, cp, readdir } from 'node:fs/promises';
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

const rootFiles = await readdir('.');
const htmlFiles = rootFiles.filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  await copyFile(file, `dist/${file}`);
}

await cp('src', 'dist/src', { recursive: true });
await cp('docs', 'dist/docs', { recursive: true });

for (const file of ['_headers', '_redirects', 'body_back_and_front_zones.svg', 'body_back_and_front_zones.svgz.zip']) {
  if (await exists(file)) {
    await copyFile(file, `dist/${file}`);
  }
}

console.log(`Static build ready in dist/ with ${htmlFiles.length} HTML page(s).`);
