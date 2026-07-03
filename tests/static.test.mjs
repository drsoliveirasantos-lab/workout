import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function text(path) {
  return readFile(path, 'utf8');
}

test('home links to the main pages and stays presentation-only', async () => {
  const html = await text('index.html');
  const css = await text('src/styles.css');

  assert.match(html, /Workout Nykuto/);
  assert.match(html, /href="plan\.html"/);
  assert.match(html, /href="profil\.html"/);
  assert.match(html, /href="sources\.html"/);
  assert.match(html, /href="evidence\.html"/);
  assert.match(html, /src\/glossary\.js/);
  assert.doesNotMatch(html, /id="profile-form"/);
  assert.doesNotMatch(html, /src\/app\.js/);
  assert.match(css, /@media/);
});

test('plan page keeps the advanced builder, calibration and result systems', async () => {
  const html = await text('plan.html');
  const app = await text('src/app.js');
  const advanced = await text('src/data/advancedPrograms.js');
  const families = await text('src/data/movementFamilies.js');
  const exerciseProfiles = await text('src/data/exerciseProfiles.js');
  const muscleDisplay = await text('src/muscle-display.js');
  const training = await text('src/engine/training.js');

  assert.match(html, /id="profile-form"/);
  assert.match(html, /Priorité musculaire/);
  assert.match(html, /Récupération/);
  assert.match(html, /Préférence exercices/);
  assert.match(html, /Douleur principale/);
  assert.match(html, /src\/muscle-display\.js/);
  assert.match(app, /calibration-zone-accordion/);
  assert.match(app, /data-save-inline-calibration/);
  assert.match(app, /saveInlineCalibration/);
  assert.match(app, /getCalibrationEntries/);
  assert.match(advanced, /Split avancé dynamique/);
  assert.match(advanced, /FOUR_DAY_SPLIT/);
  assert.match(advanced, /FIVE_DAY_SPLIT/);
  assert.match(advanced, /GOAL_PRESETS/);
  assert.match(advanced, /buildAdvancedSessions/);
  assert.match(families, /familyIds: \['horizontal_push', 'pec_isolation'\]/);
  assert.match(exerciseProfiles, /calculateExerciseTransfer/);
  assert.match(exerciseProfiles, /pec_claviculaire/);
  assert.match(muscleDisplay, /Répartition biomécanique indicative/);
  assert.match(muscleDisplay, /Niveau 2 — détail anatomique/);
  assert.match(training, /selectBestCalibration/);
  assert.match(training, /fiabilité/);
});

test('biomechanical profile page loads the direct transparent Inkscape SVG', async () => {
  const html = await text('profil.html');
  const script = await text('src/biomech-profile.js');
  const css = await text('src/biomech-profile.css');
  const build = await text('scripts/build-static.mjs');

  assert.match(html, /Profil biomécanique/);
  assert.match(html, /Carte corporelle interactive/);
  assert.match(html, /body-map-mount/);
  assert.match(html, /zones tracées manuellement dans Inkscape/);
  assert.match(script, /BODY_MAP_URL/);
  assert.match(script, /body_back_and_front_zones\.svg/);
  assert.match(script, /loadDirectSvgText/);
  assert.match(script, /buildMapFromSvgDocument/);
  assert.match(script, /renderBodySvg/);
  assert.doesNotMatch(script, /BODY_MAP_FALLBACK_URL/);
  assert.match(script, /grand_rond/);
  assert.match(script, /serratus_anterior/);
  assert.match(css, /user-body-map/);
  assert.match(css, /body-map-svg/);
  assert.match(css, /body-stage\.is-back/);
  assert.match(build, /body_back_and_front_zones\.svg/);
});

test('sources, evidence and glossary assets exist', async () => {
  const sourcesPage = await text('sources.html');
  const evidencePage = await text('evidence.html');
  const sources = await text('src/data/sources.js');
  const glossaryScript = await text('src/glossary.js');
  const glossaryData = await text('src/data/glossary.js');

  assert.match(sourcesPage, /sources-list/);
  assert.match(sourcesPage, /src\/sources-page\.js/);
  assert.match(evidencePage, /Evidence base/);
  assert.match(evidencePage, /data-glossary="e1rm"/);
  assert.match(sources, /who\.int/);
  assert.match(sources, /cdc\.gov/);
  assert.match(glossaryScript, /data-glossary/);
  assert.match(glossaryData, /RIR/);
  assert.match(glossaryData, /Training Max/);
});

test('site includes explicit safety wording', async () => {
  const html = await text('index.html');
  const rules = await text('AI_WORKOUT_RULES.md');

  assert.match(html, /ne remplace pas un avis médical/i);
  assert.match(rules, /Ne jamais présenter le site comme un avis médical/i);
});
