import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function text(path) {
  return readFile(path, 'utf8');
}

test('home is presentation-only and links to dedicated pages', async () => {
  const html = await text('index.html');
  const css = await text('src/styles.css');

  assert.match(html, /Workout Nykuto/);
  assert.match(html, /href="plan\.html"/);
  assert.match(html, /href="sources\.html"/);
  assert.match(html, /href="evidence\.html"/);
  assert.match(html, /src\/glossary\.js/);
  assert.doesNotMatch(html, /id="profile-form"/);
  assert.doesNotMatch(html, /src\/app\.js/);
  assert.match(css, /@media/);
});

test('plan page contains the generator, app module and glossary triggers', async () => {
  const html = await text('plan.html');
  const app = await text('src/app.js');

  assert.match(html, /id="profile-form"/);
  assert.match(html, /id="strength-form"/);
  assert.match(html, /src\/app\.js/);
  assert.match(html, /src\/glossary\.js/);
  assert.match(html, /data-glossary="rir"/);
  assert.match(html, /data-glossary="bmr"/);
  assert.match(app, /generateTrainingPlan/);
});

test('sources and evidence pages are separate pages', async () => {
  const sourcesPage = await text('sources.html');
  const evidencePage = await text('evidence.html');
  const sources = await text('src/data/sources.js');
  const evidence = await text('docs/evidence.md');

  assert.match(sourcesPage, /sources-list/);
  assert.match(sourcesPage, /src\/sources-page\.js/);
  assert.match(evidencePage, /Evidence base/);
  assert.match(evidencePage, /Epley/);
  assert.match(evidencePage, /data-glossary="e1rm"/);
  assert.match(evidencePage, /src\/glossary\.js/);
  assert.match(evidence, /WHO/);
  assert.match(evidence, /CDC/);
  assert.match(sources, /who\.int/);
  assert.match(sources, /cdc\.gov/);
});

test('glossary system exists and has core definitions', async () => {
  const glossaryScript = await text('src/glossary.js');
  const glossaryData = await text('src/data/glossary.js');
  const glossaryCss = await text('src/glossary.css');

  assert.match(glossaryScript, /data-glossary/);
  assert.match(glossaryData, /RIR/);
  assert.match(glossaryData, /Training Max/);
  assert.match(glossaryData, /BMR/);
  assert.match(glossaryCss, /glossary-panel/);
});

test('safety language: site does not present itself as medical advice', async () => {
  const html = await text('index.html');
  const rules = await text('AI_WORKOUT_RULES.md');

  assert.match(html, /ne remplace pas un avis médical/i);
  assert.match(rules, /Ne jamais présenter le site comme un avis médical/i);
});
