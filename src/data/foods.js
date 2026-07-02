export const FOOD_BASKETS = {
  very_low: {
    label: 'Budget très serré',
    monthlyBudget: '100-150 € / mois',
    note: 'Prix indicatifs à vérifier selon magasin, promotions et région.',
    staples: [
      { name: 'Œufs', role: 'protéines économiques', protein: '≈ 12-13 g / 100 g' },
      { name: 'Riz', role: 'glucides bon marché', protein: 'faible' },
      { name: 'Lentilles', role: 'glucides + protéines végétales', protein: '≈ 24 g / 100 g sec' },
      { name: 'Haricots rouges', role: 'fibres + glucides + protéines végétales', protein: '≈ 21 g / 100 g sec' },
      { name: 'Flocons d’avoine', role: 'petit-déjeuner économique', protein: '≈ 13 g / 100 g' },
      { name: 'Sardines ou thon en boîte', role: 'protéines pratiques', protein: '≈ 20-25 g / 100 g' },
      { name: 'Poulet premier prix', role: 'protéines animales', protein: '≈ 22-24 g / 100 g' },
      { name: 'Fromage blanc', role: 'protéines laitières', protein: '≈ 7-8 g / 100 g' },
      { name: 'Légumes surgelés', role: 'micronutriments économiques', protein: 'variable' }
    ]
  },
  moderate: {
    label: 'Budget moyen',
    monthlyBudget: '180-280 € / mois',
    note: 'Plus de variété, toujours sans dépendre d’aliments chers.',
    staples: [
      { name: 'Poulet', role: 'base protéique', protein: '≈ 22-24 g / 100 g' },
      { name: 'Steak haché 5-10 %', role: 'protéines + fer', protein: '≈ 20 g / 100 g' },
      { name: 'Skyr ou fromage blanc', role: 'protéines pratiques', protein: '≈ 8-10 g / 100 g' },
      { name: 'Riz, pâtes, pommes de terre', role: 'glucides modulables', protein: 'variable' },
      { name: 'Fruits de saison', role: 'fibres + micronutriments', protein: 'faible' },
      { name: 'Légumes frais ou surgelés', role: 'volume alimentaire', protein: 'variable' }
    ]
  },
  flexible: {
    label: 'Budget flexible',
    monthlyBudget: '300 €+ / mois',
    note: 'Options plus confortables, pas nécessaires pour progresser.',
    staples: [
      { name: 'Saumon', role: 'protéines + oméga-3', protein: '≈ 20 g / 100 g' },
      { name: 'Bœuf maigre', role: 'protéines + fer', protein: '≈ 20-22 g / 100 g' },
      { name: 'Whey', role: 'complément pratique si besoin', protein: '≈ 70-85 g / 100 g selon produit' },
      { name: 'Fruits rouges', role: 'micronutriments', protein: 'faible' },
      { name: 'Noix et oléagineux', role: 'lipides utiles', protein: 'modérée' }
    ]
  }
};
