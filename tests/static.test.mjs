import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function text(path) {
  return readFile(path, 'utf8');
}

test('core pages and assets are wired', async () => {
  const index = await text('index.html');
  const plan = await text('plan.html');
  const profile = await text('profil.html');
  const sources = await text('sources.html');
  const evidence = await text('evidence.html');

  assert.match(index, /Workout Nykuto/);
  assert.match(index, /href="plan\.html"/);
  assert.match(index, /href="profil\.html"/);
  assert.match(index, /href="sources\.html"/);
  assert.match(index, /href="evidence\.html"/);
  assert.match(plan, /id="profile-form"/);
  assert.match(plan, /src\/app\.js/);
  assert.match(profile, /Profil biomécanique/);
  assert.match(profile, /body-map-mount/);
  assert.match(sources, /sources-list/);
  assert.match(evidence, /Evidence base/);
});

test('training and calibration engines expose required modules', async () => {
  const app = await text('src/app.js');
  const advanced = await text('src/data/advancedPrograms.js');
  const families = await text('src/data/movementFamilies.js');
  const profiles = await text('src/data/exerciseProfiles.js');
  const training = await text('src/engine/training.js');
  const nutrition = await text('src/engine/nutrition.js');

  assert.match(app, /generateTrainingPlan/);
  assert.match(app, /saveInlineCalibration/);
  assert.match(advanced, /buildAdvancedSessions/);
  assert.match(advanced, /GOAL_PRESETS/);
  assert.match(families, /CALIBRATION_ZONES/);
  assert.match(profiles, /EXERCISE_PROFILES/);
  assert.match(profiles, /calculateExerciseTransfer/);
  assert.match(training, /selectBestCalibration/);
  assert.match(nutrition, /bodyComposition/);
});

test('biomechanical profile uses the direct SVG body map', async () => {
  const profileScript = await text('src/biomech-profile.js');
  const profileCss = await text('src/biomech-profile.css');
  const build = await text('scripts/build-static.mjs');

  assert.match(profileScript, /BODY_MAP_URL/);
  assert.match(profileScript, /body_back_and_front_zones\.svg/);
  assert.match(profileScript, /loadDirectSvgText/);
  assert.match(profileScript, /buildMapFromSvgDocument/);
  assert.match(profileScript, /renderBodySvg/);
  assert.doesNotMatch(profileScript, /BODY_MAP_FALLBACK_URL/);
  assert.match(profileCss, /body-map-svg/);
  assert.match(profileCss, /body-stage\.is-back/);
  assert.match(build, /body_back_and_front_zones\.svg/);
});

test('reference data and safety wording remain present', async () => {
  const glossary = await text('src/data/glossary.js');
  const sources = await text('src/data/sources.js');
  const index = await text('index.html');
  const rules = await text('AI_WORKOUT_RULES.md');

  assert.match(glossary, /RIR/);
  assert.match(glossary, /Training Max/);
  assert.match(sources, /who\.int/);
  assert.match(sources, /cdc\.gov/);
  assert.match(index, /ne remplace pas un avis médical/i);
  assert.match(rules, /Ne jamais présenter le site comme un avis médical/i);
});
