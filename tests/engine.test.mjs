import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateOneRepMax, generateTrainingPlan } from '../src/engine/training.js';
import { calculateNutritionTargets, buildBudgetMenu } from '../src/engine/nutrition.js';
import {
  buildCalibrationPlan,
  buildCalibrationZones,
  calculateCalibrationEntry,
  summarizeCalibrationCoverage
} from '../src/engine/calibration.js';

test('estimates e1RM and training max from a submaximal set', () => {
  const result = estimateOneRepMax({ weight: 60, reps: 5, rir: 0 });

  assert.equal(result.inputWeight, 60);
  assert.equal(result.inputReps, 5);
  assert.equal(result.reliability, 'haute');
  assert.ok(result.estimatedOneRm >= 67.5 && result.estimatedOneRm <= 72.5);
  assert.ok(result.trainingMax < result.estimatedOneRm);
});

test('generates a training plan with sessions and progression rules', () => {
  const profile = {
    sex: 'male',
    age: 29,
    heightCm: 175,
    weightKg: 80,
    level: 'beginner',
    goal: 'recomposition',
    daysPerWeek: 3,
    equipment: 'basic',
    injuries: '',
    medicalFlags: ''
  };

  const strengthTests = [
    { exerciseId: 'bench_press', exerciseName: 'Développé couché', ...estimateOneRepMax({ weight: 60, reps: 6, rir: 1 }) },
    { exerciseId: 'squat', exerciseName: 'Squat', ...estimateOneRepMax({ weight: 80, reps: 5, rir: 1 }) }
  ];

  const plan = generateTrainingPlan({ profile, strengthTests });

  assert.equal(plan.sessions.length, 3);
  assert.equal(plan.progression.method, 'Double progression');
  assert.ok(plan.sessions[0].exercises.length >= 4);
});

test('builds guided calibration plan and zones by level', () => {
  const beginner = buildCalibrationPlan({ level: 'beginner' });
  const beginnerZones = buildCalibrationZones({ level: 'beginner' });
  const veryAdvanced = buildCalibrationPlan({ level: 'very_advanced' });
  const veryAdvancedZones = buildCalibrationZones({ level: 'very_advanced' });

  assert.equal(beginner.length, 3);
  assert.deepEqual(beginnerZones.map((zone) => zone.label), ['Pecs', 'Dos', 'Jambes']);
  assert.ok(beginner.some((item) => item.zoneId === 'pecs' && item.movementLabel === 'Développé / chest press'));
  assert.ok(veryAdvanced.length > beginner.length);
  assert.ok(veryAdvancedZones.some((zone) => zone.label === 'Bras'));
  assert.ok(veryAdvanced.some((item) => item.familyId === 'leg_press_pattern'));
  assert.ok(veryAdvanced.some((item) => item.familyId === 'elbow_extension'));
});

test('calculates calibration confidence and working range', () => {
  const entry = calculateCalibrationEntry({
    familyId: 'horizontal_push',
    exerciseName: 'Développé couché',
    weight: 80,
    reps: 8,
    rir: 2,
    pain: 0,
    technique: 'clean'
  });

  assert.equal(entry.zoneLabel, 'Pecs');
  assert.equal(entry.movementLabel, 'Développé / chest press');
  assert.equal(entry.familyLabel, 'Pecs — développé / chest press');
  assert.equal(entry.confidence.label, 'haute');
  assert.ok(entry.workingRange.low > 0);
  assert.ok(entry.workingRange.high > entry.workingRange.low);
});

test('beginner plan uses guided calibration ranges when available', () => {
  const profile = {
    sex: 'male',
    age: 29,
    heightCm: 175,
    weightKg: 80,
    level: 'beginner',
    goal: 'recomposition',
    daysPerWeek: 3,
    equipment: 'basic',
    injuries: '',
    medicalFlags: ''
  };

  const calibrations = [
    calculateCalibrationEntry({ familyId: 'horizontal_push', exerciseName: 'Développé haltères', weight: 35, reps: 10, rir: 2, pain: 0, technique: 'clean' }),
    calculateCalibrationEntry({ familyId: 'horizontal_pull', exerciseName: 'Rowing barre', weight: 100, reps: 10, rir: 2, pain: 0, technique: 'clean' }),
    calculateCalibrationEntry({ familyId: 'leg_press_pattern', exerciseName: 'Squat Smith', weight: 120, reps: 10, rir: 2, pain: 0, technique: 'clean' })
  ];

  const plan = generateTrainingPlan({ profile, strengthTests: [], calibrations });
  const squat = plan.sessions[0].exercises.find((exercise) => exercise.name === 'Squat');
  const bench = plan.sessions[0].exercises.find((exercise) => exercise.name === 'Développé couché');
  const row = plan.sessions[0].exercises.find((exercise) => exercise.name === 'Rowing');
  const lunge = plan.sessions[0].exercises.find((exercise) => exercise.name === 'Fentes');
  const plank = plan.sessions[0].exercises.find((exercise) => exercise.name === 'Gainage');

  assert.match(squat.loadText, /Charge estimée/);
  assert.match(bench.loadText, /Charge estimée/);
  assert.match(row.loadText, /Charge estimée/);
  assert.match(lunge.loadText, /RIR 2-3/);
  assert.match(lunge.note, /transfert non fiable/);
  assert.match(plank.loadText, /Poids du corps/);
});

test('generates Diego-style very advanced ABCD plan with calibration ranges', () => {
  const profile = {
    sex: 'male',
    age: 29,
    heightCm: 175,
    weightKg: 80,
    level: 'very_advanced',
    goal: 'hypertrophy',
    daysPerWeek: 4,
    equipment: 'full_gym',
    injuries: '',
    medicalFlags: ''
  };

  const calibrations = [
    calculateCalibrationEntry({ familyId: 'horizontal_push', exerciseName: 'Développé couché', weight: 80, reps: 8, rir: 2, pain: 0, technique: 'clean' }),
    calculateCalibrationEntry({ familyId: 'leg_press_pattern', exerciseName: 'Leg press 45°', weight: 180, reps: 8, rir: 2, pain: 0, technique: 'clean' })
  ];

  const plan = generateTrainingPlan({ profile, strengthTests: [], calibrations });
  const coverage = summarizeCalibrationCoverage(profile, calibrations);
  const bench = plan.sessions[0].exercises.find((exercise) => exercise.name === 'Développé couché');
  const legPress = plan.sessions[3].exercises.find((exercise) => exercise.name === 'Leg press 45°');
  const lateralRaise = plan.sessions[2].exercises.find((exercise) => exercise.name === 'Élévation latérale assise avec haltère');

  assert.equal(plan.sessions.length, 4);
  assert.equal(plan.calculations.totalValidSets, 117);
  assert.equal(plan.calculations.cardioMinutes, 100);
  assert.equal(plan.calculations.byMuscle.pectoraux, 12);
  assert.equal(plan.calculations.byMuscle.triceps, 9);
  assert.match(plan.title, /Très avancé/);
  assert.match(bench.loadText, /charge estimée/);
  assert.match(legPress.loadText, /charge estimée/);
  assert.match(lateralRaise.loadText, /RIR 1-2/);
  assert.ok(coverage.score > 0 && coverage.score < 100);
});

test('calculates nutrition targets and budget menu', () => {
  const profile = {
    sex: 'male',
    age: 29,
    heightCm: 175,
    weightKg: 80,
    goal: 'fat_loss',
    activity: 'light',
    budget: 'very_low'
  };

  const nutrition = calculateNutritionTargets(profile);
  const menu = buildBudgetMenu(nutrition);

  assert.ok(nutrition.bmr > 1500);
  assert.ok(nutrition.calories.max < nutrition.maintenance);
  assert.ok(nutrition.protein.min >= 120);
  assert.ok(menu.staples.length > 0);
});
