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

test('plan page contains collapsible steps, zone funnel, dropdown inputs and result accordion', async () => {
  const html = await text('plan.html');
  const app = await text('src/app.js');
  const advanced = await text('src/data/advancedPrograms.js');
  const families = await text('src/data/movementFamilies.js');
  const exerciseProfiles = await text('src/data/exerciseProfiles.js');
  const calibration = await text('src/engine/calibration.js');
  const training = await text('src/engine/training.js');
  const nutrition = await text('src/engine/nutrition.js');
  const calibrationCss = await text('src/calibration.css');
  const formStepsCss = await text('src/form-steps.css');
  const accordionCss = await text('src/result-accordion.css');

  assert.match(html, /id="profile-form"/);
  assert.match(html, /builder-step/);
  assert.match(html, /Étape 1 — Profil/);
  assert.match(html, /Étape 2 — Calibration/);
  assert.match(html, /id="generate-plan"/);
  assert.match(html, /id="calibration-form"/);
  assert.match(html, /id="calibration-zone"/);
  assert.match(html, /id="calibration-family"/);
  assert.match(html, /id="calibration-exercise"/);
  assert.match(html, /id="calibration-weight"/);
  assert.match(html, /id="calibration-reps"/);
  assert.match(html, /id="calibration-rir"/);
  assert.match(html, /id="calibration-pain"/);
  assert.match(html, /data-range-select/);
  assert.match(html, /Zone à calibrer/);
  assert.match(html, /Mouvement \/ test à calibrer/);
  assert.match(html, /Prise de masse sèche/);
  assert.doesNotMatch(html, /weight-quick-picks/);
  assert.doesNotMatch(html, /reps-quick-picks/);
  assert.doesNotMatch(html, /Mettre à jour les tests conseillés/);
  assert.match(html, /src\/calibration\.css/);
  assert.match(html, /src\/form-steps\.css/);
  assert.match(html, /src\/result-accordion\.css/);
  assert.match(html, /value="pecs"/);
  assert.match(html, /value="horizontal_push"/);
  assert.match(html, /Développé \/ chest press/);
  assert.match(html, /value="advanced"/);
  assert.match(html, /value="very_advanced"/);
  assert.match(html, /src\/app\.js/);
  assert.match(html, /src\/glossary\.js/);
  assert.match(html, /data-glossary="rir"/);
  assert.match(html, /data-glossary="bmr"/);
  assert.match(app, /populateProfileRangeSelects/);
  assert.match(app, /renderCalibrationSelectOptions/);
  assert.match(app, /calibration-zone-accordion/);
  assert.match(app, /buildCalibrationZones/);
  assert.match(app, /renderZoneSelect/);
  assert.match(app, /renderMovementSelect/);
  assert.match(app, /hydrateCalibrationExerciseFromSelection/);
  assert.match(app, /data-select-zone/);
  assert.match(app, /data-select-family/);
  assert.doesNotMatch(app, /data-quick-pick/);
  assert.match(app, /renderAccordion/);
  assert.match(app, /accordion-section/);
  assert.match(app, /Diète \/ calories/);
  assert.match(app, /generateTrainingPlan/);
  assert.match(advanced, /Split ABCD/);
  assert.match(advanced, /familyId: 'shoulder_abduction'/);
  assert.match(families, /CALIBRATION_ZONES/);
  assert.match(families, /movementLabel: 'Squat \/ leg press'/);
  assert.match(families, /shoulder_abduction/);
  assert.match(families, /technicalLabel: 'Poussée horizontale/);
  assert.match(exerciseProfiles, /EXERCISE_PROFILES/);
  assert.match(exerciseProfiles, /hack_squat/);
  assert.match(exerciseProfiles, /incline_dumbbell_press/);
  assert.match(exerciseProfiles, /cable_lateral_raise/);
  assert.match(exerciseProfiles, /calculateExerciseTransfer/);
  assert.match(exerciseProfiles, /muscles/);
  assert.match(calibration, /sourceProfileId/);
  assert.match(calibration, /getExerciseProfileByName/);
  assert.match(training, /lean_bulk/);
  assert.match(training, /calculateExerciseTransfer/);
  assert.match(training, /fiabilité/);
  assert.match(nutrition, /lean_bulk/);
  assert.match(calibrationCss, /calibration-movement-item/);
  assert.match(calibrationCss, /calibration-zone-accordion/);
  assert.match(formStepsCss, /builder-step/);
  assert.match(accordionCss, /accordion-section/);
  assert.match(accordionCss, /accordion-summary/);
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
