import { FOOD_BASKETS } from '../data/foods.js';

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725
};

const PHYSICAL_PROFILE_ADJUSTMENTS = {
  unknown: { label: 'Non précisé', maintenanceMultiplier: 1, note: 'Aucun ajustement morphologique appliqué.' },
  standard: { label: 'Standard', maintenanceMultiplier: 1, note: 'Profil standard : calcul classique.' },
  lean_low_muscle: { label: 'Mince peu musclé', maintenanceMultiplier: 0.97, note: 'Ajustement prudent : masse musculaire probablement plus basse.' },
  lean_athletic: { label: 'Mince sportif', maintenanceMultiplier: 1.03, note: 'Ajustement léger : profil sportif et généralement actif.' },
  muscular_lean: { label: 'Musclé plutôt sec', maintenanceMultiplier: 1.06, note: 'Ajustement léger : masse maigre probablement plus élevée.' },
  muscular_soft: { label: 'Musclé avec un peu de gras', maintenanceMultiplier: 1.03, note: 'Ajustement léger : masse maigre probablement élevée mais surplus à contrôler.' },
  overweight_low_muscle: { label: 'Surpoids peu musclé', maintenanceMultiplier: 0.96, note: 'Ajustement prudent : éviter de surestimer la dépense.' },
  overweight_muscular: { label: 'Surpoids musclé', maintenanceMultiplier: 1.02, note: 'Ajustement léger : poids élevé mais masse maigre probablement supérieure.' }
};

const BODY_FAT_RANGES = {
  '8-12': { label: '8-12 %', midpoint: 10 },
  '13-17': { label: '13-17 %', midpoint: 15 },
  '18-22': { label: '18-22 %', midpoint: 20 },
  '23-27': { label: '23-27 %', midpoint: 25 },
  '28-35': { label: '28-35 %', midpoint: 31.5 },
  '35+': { label: '35 %+ ', midpoint: 37 }
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
  const mifflinBmr = calculateBmr(profile);
  const bodyComposition = calculateBodyComposition(profile, mifflinBmr);
  const factor = ACTIVITY_FACTORS[profile.activity] || ACTIVITY_FACTORS.light;
  const maintenance = Math.round(bodyComposition.adjustedBmr * factor * bodyComposition.profileAdjustment.maintenanceMultiplier);
  const goal = profile.goal || 'recomposition';

  const calories = getCaloriesByGoal(maintenance, goal);
  const protein = getProteinTarget(Number(profile.weightKg), goal, bodyComposition.leanMassKg);
  const basket = FOOD_BASKETS[profile.budget] || FOOD_BASKETS.very_low;

  return {
    bmr: bodyComposition.adjustedBmr,
    mifflinBmr,
    activityFactor: factor,
    maintenance,
    calories,
    protein,
    basket,
    bodyComposition,
    hydrationNote: 'Repère simple : eau régulière dans la journée, plus si chaleur, transpiration ou séance longue.',
    disclaimer: 'Ces valeurs sont des repères éducatifs. Ajuster selon évolution du poids, faim, énergie, digestion et avis professionnel si pathologie.'
  };
}

function calculateBodyComposition(profile, mifflinBmr) {
  const weight = Number(profile.weightKg);
  const range = BODY_FAT_RANGES[profile.bodyFatEstimate];
  const profileAdjustment = PHYSICAL_PROFILE_ADJUSTMENTS[profile.physicalProfile] || PHYSICAL_PROFILE_ADJUSTMENTS.unknown;

  if (!range || !Number.isFinite(weight) || weight <= 0) {
    return {
      mode: 'profile_only',
      label: profileAdjustment.label,
      estimatedBodyFatPercent: null,
      leanMassKg: null,
      katchBmr: null,
      adjustedBmr: Math.round(mifflinBmr),
      profileAdjustment,
      note: profileAdjustment.note
    };
  }

  const leanMassKg = Math.round(weight * (1 - range.midpoint / 100) * 10) / 10;
  const katchBmr = Math.round(370 + 21.6 * leanMassKg);
  const adjustedBmr = Math.round(mifflinBmr * 0.65 + katchBmr * 0.35);

  return {
    mode: 'body_fat_estimate',
    label: `${range.label} · ${profileAdjustment.label}`,
    estimatedBodyFatPercent: range.midpoint,
    leanMassKg,
    katchBmr,
    adjustedBmr,
    profileAdjustment,
    note: `Masse maigre estimée ${leanMassKg} kg. Calcul pondéré : Mifflin-St Jeor + correction masse maigre.`
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
      note: 'Objectif : faciliter la progression musculaire en acceptant une petite prise de poids.'
    },
    lean_bulk: {
      label: 'Prise de masse sèche',
      min: maintenance + 75,
      max: maintenance + 200,
      note: 'Objectif : gagner du muscle proprement avec un surplus contrôlé et une prise de gras limitée.'
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

function getProteinTarget(weightKg, goal, leanMassKg = null) {
  const ranges = {
    fat_loss: [1.6, 2.0],
    hypertrophy: [1.6, 2.0],
    lean_bulk: [1.8, 2.2],
    strength: [1.4, 2.0],
    recomposition: [1.6, 2.0],
    general_health: [1.2, 1.6]
  };

  const range = ranges[goal] || ranges.recomposition;
  const referenceWeight = leanMassKg && leanMassKg > 0 ? Math.max(leanMassKg, weightKg * 0.75) : weightKg;

  return {
    gramsPerKg: range,
    referenceWeight: Math.round(referenceWeight),
    min: Math.round(referenceWeight * range[0]),
    max: Math.round(referenceWeight * range[1]),
    note: leanMassKg
      ? 'Protéines calculées avec une référence masse maigre prudente.'
      : 'Répartir sur 2-4 repas selon tolérance et budget.'
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
