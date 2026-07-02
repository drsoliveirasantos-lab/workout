import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function text(path) {
  return readFile(path, 'utf8');
}

test('boot-health: core static files exist and reference the app module', async () => {
  const html = await text('index.html');
  const app = await text('src/app.js');
  const css = await text('src/styles.css');

  assert.match(html, /Workout Nekouto/);
  assert.match(html, /src\/app\.js/);
  assert.match(app, /generateTrainingPlan/);
  assert.match(css, /@media/);
});

test('source visibility: evidence and official sources are present', async () => {
  const html = await text('index.html');
  const evidence = await text('docs/evidence.md');
  const sources = await text('src/data/sources.js');

  assert.match(html, /sources-list/);
  assert.match(evidence, /WHO/);
  assert.match(evidence, /CDC/);
  assert.match(sources, /who\.int/);
  assert.match(sources, /cdc\.gov/);
});

test('safety language: site does not present itself as medical advice', async () => {
  const html = await text('index.html');
  const rules = await text('AI_WORKOUT_RULES.md');

  assert.match(html, /ne remplace pas un avis médical/i);
  assert.match(rules, /Ne jamais présenter le site comme un avis médical/i);
});
