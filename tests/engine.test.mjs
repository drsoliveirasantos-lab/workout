import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateOneRepMax, generateTrainingPlan } from '../src/engine/training.js';
import { calculateNutritionTargets, buildBudgetMenu } from '../src/engine/nutrition.js';

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
