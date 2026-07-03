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

test('plan page contains adaptive controls, multi-variant calibration and result accordion', async () => {
  const html = await text('plan.html');
  const app = await text('src/app.js');
  const advanced = await text('src/data/advancedPrograms.js');
  const families = await text('src/data/movementFamilies.js');
  const exerciseProfiles = await text('src/data/exerciseProfiles.js');
  const muscleDisplay = await text('src/muscle-display.js');
  const calibration = await text('src/engine/calibration.js');
  const training = await text('src/engine/training.js');
  const nutrition = await text('src/engine/nutrition.js');
  const calibrationCss = await text('src/calibration.css');
  const formStepsCss = await text('src/form-steps.css');
  const accordionCss = await text('src/result-accordion.css');

  assert.match(html, /id="profile-form"/);
  assert.match(html, /Priorité musculaire/);
  assert.match(html, /Récupération/);
  assert.match(html, /Préférence exercices/);
  assert.match(html, /Douleur principale/);
  assert.match(html, /priority:/);
  assert.match(html, /recovery:/);
  assert.match(html, /preference:/);
  assert.match(html, /pain:/);
  assert.match(html, /src\/muscle-display\.js/);
  assert.match(html, /value="advanced"/);
  assert.match(html, /value="very_advanced"/);
  assert.match(app, /populateProfileRangeSelects/);
  assert.match(app, /renderCalibrationSelectOptions/);
  assert.match(app, /calibration-zone-accordion/);
  assert.match(app, /calibration-dashboard/);
  assert.match(app, /data-save-inline-calibration/);
  assert.match(app, /inline-calibration-grid/);
  assert.match(app, /saveInlineCalibration/);
  assert.match(app, /upsertCalibrationEntry/);
  assert.match(app, /getCalibrationEntries/);
  assert.match(app, /plusieurs variantes/);
  assert.match(app, /test\(s\)/);
  assert.match(app, /generateTrainingPlan/);
  assert.match(advanced, /Split avancé dynamique/);
  assert.match(advanced, /FOUR_DAY_SPLIT/);
  assert.match(advanced, /FIVE_DAY_SPLIT/);
  assert.match(advanced, /GOAL_PRESETS/);
  assert.match(advanced, /getProfileSettings/);
  assert.match(advanced, /applyPreference/);
  assert.match(advanced, /applyPainSubstitution/);
  assert.match(advanced, /addPriorityExercise/);
  assert.match(advanced, /recoverySetShift/);
  assert.match(advanced, /pec_deck/);
  assert.match(advanced, /buildAdvancedSessions/);
  assert.match(advanced, /familyId: 'shoulder_abduction'/);
  assert.match(families, /CALIBRATION_ZONES/);
  assert.match(families, /familyIds: \['horizontal_push', 'pec_isolation'\]/);
  assert.match(families, /movementLabel: 'Écarté \/ pec deck'/);
  assert.match(families, /movementLabel: 'Squat \/ leg press'/);
  assert.match(exerciseProfiles, /EXERCISE_PROFILES/);
  assert.match(exerciseProfiles, /hack_squat/);
  assert.match(exerciseProfiles, /quadriceps: 0\.56/);
  assert.match(exerciseProfiles, /bench_press/);
  assert.match(exerciseProfiles, /pectoraux: 0\.55/);
  assert.match(exerciseProfiles, /incline_dumbbell_press/);
  assert.match(exerciseProfiles, /calculateExerciseTransfer/);
  assert.match(muscleDisplay, /Répartition biomécanique indicative/);
  assert.match(muscleDisplay, /Niveau 2 — détail anatomique/);
  assert.match(muscleDisplay, /pec_claviculaire/);
  assert.match(muscleDisplay, /vaste_lateral/);
  assert.match(muscleDisplay, /MUSCLE_LABELS/);
  assert.match(muscleDisplay, /MutationObserver/);
  assert.match(calibration, /sourceProfileId/);
  assert.match(calibration, /getExerciseProfileByName/);
  assert.match(training, /selectBestCalibration/);
  assert.match(training, /getExerciseLoadInput/);
  assert.match(training, /kg internes/);
  assert.match(training, /Source choisie/);
  assert.match(training, /lean_bulk/);
  assert.match(training, /calculateExerciseTransfer/);
  assert.match(training, /fiabilité/);
  assert.match(nutrition, /lean_bulk/);
  assert.match(nutrition, /bodyComposition/);
  assert.match(calibrationCss, /calibration-movement-item/);
  assert.match(calibrationCss, /calibration-zone-accordion/);
  assert.match(calibrationCss, /inline-calibration-grid/);
  assert.match(calibrationCss, /calibration-progress/);
  assert.match(calibrationCss, /muscle-distribution/);
  assert.match(formStepsCss, /builder-step/);
  assert.match(formStepsCss, /position: fixed/);
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
