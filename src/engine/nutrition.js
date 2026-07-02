import { FOOD_BASKETS } from '../data/foods.js';

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725
};

export function calculateBmr({ sex, weightKg, heightCm, age }) {
  const weight = Number(weightKg);
  const height = Number(heightCm);
  const years = Number(age);

  if (!Number.isFinite(weight) || weight <= 0) throw new Error('Poids invalide.');
  if (!Number.isFinite(height) || height <= 0) throw new Error('Taille invalide.');
  if (!Number.isFinite(years) || years <= 0) throw new Error('Âge invalide.');

  const base = 10 * weight + 6.25 * height - 5 * years;
  return Math.round(sex === 'female' ? base - 161 : base + 5);
}

export function calculateNutritionTargets(profile) {
  const bmr = calculateBmr(profile);
  const factor = ACTIVITY_FACTORS[profile.activity] || ACTIVITY_FACTORS.light;
  const maintenance = Math.round(bmr * factor);
  const goal = profile.goal || 'recomposition';

  const calories = getCaloriesByGoal(maintenance, goal);
  const protein = getProteinTarget(Number(profile.weightKg), goal);
  const basket = FOOD_BASKETS[profile.budget] || FOOD_BASKETS.very_low;

  return {
    bmr,
    activityFactor: factor,
    maintenance,
    calories,
    protein,
    basket,
    hydrationNote: 'Repère simple : eau régulière dans la journée, plus si chaleur, transpiration ou séance longue.',
    disclaimer: 'Ces valeurs sont des repères éducatifs. Ajuster selon évolution du poids, faim, énergie, digestion et avis professionnel si pathologie.'
  };
}

function getCaloriesByGoal(maintenance, goal) {
  const map = {
    fat_loss: {
      label: 'Déficit modéré',
      min: maintenance - 500,
      max: maintenance - 300,
      note: 'Objectif : perdre du gras sans écraser la récupération.'
    },
    hypertrophy: {
      label: 'Surplus modéré',
      min: maintenance + 150,
      max: maintenance + 300,
      note: 'Objectif : faciliter la progression musculaire en limitant la prise de gras.'
    },
    strength: {
      label: 'Maintenance à léger surplus',
      min: maintenance,
      max: maintenance + 250,
      note: 'Objectif : soutenir la performance et la récupération.'
    },
    recomposition: {
      label: 'Maintenance ou léger déficit',
      min: maintenance - 250,
      max: maintenance,
      note: 'Objectif : progresser en force tout en contrôlant le poids.'
    },
    general_health: {
      label: 'Maintenance',
      min: maintenance - 150,
      max: maintenance + 150,
      note: 'Objectif : stabilité, énergie et régularité.'
    }
  };

  return map[goal] || map.recomposition;
}

function getProteinTarget(weightKg, goal) {
  const ranges = {
    fat_loss: [1.6, 2.0],
    hypertrophy: [1.6, 2.0],
    strength: [1.4, 2.0],
    recomposition: [1.6, 2.0],
    general_health: [1.2, 1.6]
  };

  const range = ranges[goal] || ranges.recomposition;

  return {
    gramsPerKg: range,
    min: Math.round(weightKg * range[0]),
    max: Math.round(weightKg * range[1]),
    note: 'Répartir sur 2-4 repas selon tolérance et budget.'
  };
}

export function buildBudgetMenu(nutrition) {
  const staples = nutrition.basket.staples.slice(0, 6);
  const proteinTarget = nutrition.protein.min;

  return {
    title: `Panier ${nutrition.basket.label}`,
    budget: nutrition.basket.monthlyBudget,
    note: nutrition.basket.note,
    staples,
    dayTemplate: [
      'Petit-déjeuner : flocons d’avoine + fromage blanc ou œufs selon budget.',
      'Déjeuner : riz/pommes de terre + lentilles/haricots + poulet ou sardines.',
      'Collation : fromage blanc, fruit, ou œufs si besoin de protéines.',
      'Dîner : féculent simple + légumes + source protéique économique.'
    ],
    proteinTargetText: `Viser environ ${proteinTarget} g de protéines/jour au minimum avec les aliments disponibles.`
  };
}
