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

test('plan page contains selectable calibration exercise and quick picks', async () => {
  const html = await text('plan.html');
  const app = await text('src/app.js');
  const advanced = await text('src/data/advancedPrograms.js');
  const families = await text('src/data/movementFamilies.js');
  const calibration = await text('src/engine/calibration.js');
  const calibrationCss = await text('src/calibration.css');

  assert.match(html, /id="profile-form"/);
  assert.match(html, /id="calibration-form"/);
  assert.match(html, /id="calibration-family"/);
  assert.match(html, /id="calibration-exercise"/);
  assert.match(html, /id="weight-quick-picks"/);
  assert.match(html, /id="reps-quick-picks"/);
  assert.match(html, /src\/calibration\.css/);
  assert.match(html, /value="horizontal_push"/);
  assert.match(html, /Poussée horizontale/);
  assert.match(html, /Générer les tests conseillés/);
  assert.match(html, /value="advanced"/);
  assert.match(html, /value="very_advanced"/);
  assert.match(html, /src\/app\.js/);
  assert.match(html, /src\/glossary\.js/);
  assert.match(html, /data-glossary="rir"/);
  assert.match(html, /data-glossary="bmr"/);
  assert.match(app, /hydrateCalibrationExerciseFromSelection/);
  assert.match(app, /renderQuickPicks/);
  assert.match(app, /data-select-family/);
  assert.match(app, /data-quick-pick/);
  assert.match(app, /refreshCalibrationPlan/);
  assert.match(app, /renderCalculations/);
  assert.match(app, /generateTrainingPlan/);
  assert.match(advanced, /Split ABCD/);
  assert.match(advanced, /familyId: 'horizontal_push'/);
  assert.match(families, /Poussée horizontale/);
  assert.match(calibration, /confidence/);
  assert.match(calibrationCss, /quick-pick/);
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
