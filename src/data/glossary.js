export const GLOSSARY = {
  e1rm: {
    title: 'e1RM',
    definition: 'Estimated One Repetition Maximum : estimation de la charge maximale théorique pour une répétition.',
    detail: 'Workout Nykuto le calcule à partir d’une série sous-maximale, sans imposer un vrai test maximal au débutant.'
  },
  trainingMax: {
    title: 'Training Max',
    definition: 'Charge de référence volontairement plus prudente que le max estimé.',
    detail: 'Dans le MVP, elle vaut 90 % du e1RM. Les charges de travail sont calculées à partir de cette valeur pour réduire le risque de surestimation.'
  },
  rir: {
    title: 'RIR',
    definition: 'Reps In Reserve : nombre de répétitions que tu aurais encore pu faire proprement à la fin d’une série.',
    detail: 'Exemple : RIR 2 signifie que tu t’arrêtes alors que tu aurais probablement pu faire encore 2 répétitions avec une bonne technique.'
  },
  rpe: {
    title: 'RPE',
    definition: 'Rate of Perceived Exertion : note subjective de difficulté de l’effort.',
    detail: 'En musculation, RPE 10 correspond généralement à un effort maximal sans répétition en réserve ; RPE 8 correspond environ à RIR 2.'
  },
  bmr: {
    title: 'BMR',
    definition: 'Basal Metabolic Rate : estimation du métabolisme basal, c’est-à-dire l’énergie dépensée au repos.',
    detail: 'Le MVP utilise Mifflin-St Jeor comme première estimation, puis applique un facteur d’activité.'
  },
  reps: {
    title: 'Répétitions',
    definition: 'Nombre de fois où tu réalises un mouvement dans une série.',
    detail: 'Exemple : 3 × 10 veut dire 3 séries de 10 répétitions.'
  },
  submaximal: {
    title: 'Série sous-maximale',
    definition: 'Série arrêtée avant le vrai maximum, avec encore un peu de marge.',
    detail: 'Elle permet d’estimer une charge de référence sans demander un test maximal plus risqué.'
  },
  doubleProgression: {
    title: 'Double progression',
    definition: 'Méthode où tu progresses d’abord en répétitions, puis en charge.',
    detail: 'Exemple : tu gardes 50 kg jusqu’à réussir 12/12/12, puis tu augmentes légèrement la charge.'
  },
  deload: {
    title: 'Deload',
    definition: 'Semaine ou période plus légère pour récupérer.',
    detail: 'On baisse généralement le volume, la charge ou les deux quand la fatigue s’accumule ou que les performances chutent.'
  },
  deficit: {
    title: 'Déficit calorique',
    definition: 'Situation où tu consommes moins de calories que tu n’en dépenses.',
    detail: 'C’est le principe énergétique principal derrière la perte de poids, mais il doit rester compatible avec la récupération et la santé.'
  },
  surplus: {
    title: 'Surplus calorique',
    definition: 'Situation où tu consommes plus de calories que tu n’en dépenses.',
    detail: 'Un léger surplus peut aider la prise de muscle, mais un surplus excessif favorise surtout la prise de gras.'
  },
  maintenance: {
    title: 'Maintenance calorique',
    definition: 'Apport calorique approximatif auquel ton poids reste globalement stable.',
    detail: 'C’est un point de départ, à ajuster selon l’évolution réelle du poids, de l’énergie et de la faim.'
  },
  hypertrophy: {
    title: 'Hypertrophie',
    definition: 'Augmentation de la taille des fibres musculaires.',
    detail: 'Elle dépend notamment de la tension mécanique, du volume d’entraînement, de la progression et de la récupération.'
  },
  recomposition: {
    title: 'Recomposition corporelle',
    definition: 'Objectif visant à perdre du gras tout en gagnant ou maintenant du muscle.',
    detail: 'Elle est souvent plus réaliste chez les débutants, les personnes qui reprennent l’entraînement ou celles qui optimisent mieux leur nutrition.'
  }
};
