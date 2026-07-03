# Evidence base — Workout Nykuto

Document interne de référence pour les sources utilisées par le moteur d'entraînement et de nutrition.

Dernière mise à jour : 2026-07-03.

> Note : ce fichier sert au suivi technique du projet. Il ne doit pas être publié tel quel dans le site public.

---

## 1. Activité physique générale

### WHO / OMS — physical activity and sedentary behaviour

Source : https://www.who.int/publications/i/item/9789240015128

Utilisation dans le produit :

- rappeler qu'un adulte doit viser une activité physique régulière ;
- intégrer renforcement musculaire et activité aérobie ;
- afficher la prudence pour populations particulières.

Note : recommandations générales de santé publique, pas programmation individualisée de musculation.

### CDC — adult activity overview

Source : https://www.cdc.gov/physical-activity-basics/guidelines/adults.html

Utilisation dans le produit :

- repère simple : 150 minutes/semaine d'activité modérée ou équivalent ;
- 2 jours/semaine de renforcement musculaire touchant les grands groupes musculaires.

---

## 2. Estimation du 1RM

### Formule Epley

```txt
e1RM = charge × (1 + répétitions / 30)
```

Usage : estimation simple à partir d'une série sous-maximale proche de l'échec technique.

### Formule Brzycki

```txt
e1RM = charge × 36 / (37 - répétitions)
```

Usage : estimation alternative. Le moteur peut moyenner Epley et Brzycki pour éviter de dépendre d'une seule formule.

### Règle de fiabilité interne

```txt
3-10 reps : fiabilité haute
11-15 reps : fiabilité moyenne
>15 reps : fiabilité basse
```

Raison : plus la série est longue, plus la relation reps → 1RM devient variable selon l'exercice, la fatigue, la technique et l'endurance locale.

### Training Max

```txt
trainingMax = e1RM × 0.90
```

Usage : calcul prudent des charges de travail, surtout chez débutant/intermédiaire.

---

## 3. Progression de charge

Principe initial : double progression.

Exemple :

```txt
Objectif : 3 × 8-12 reps
Si l'utilisateur atteint 12/12/12 avec technique propre, augmenter la charge la séance suivante.
```

Règles initiales :

```txt
Haut du corps : +2 à +2,5 kg ou +2,5 à 5 %
Bas du corps : +2,5 à +5 kg ou +5 à 10 %
```

La progression est bloquée ou réduite si douleur, fatigue élevée ou baisse nette de performance.

---

## 4. Nutrition

### Mifflin-St Jeor — métabolisme de base

Homme :

```txt
BMR = 10 × poids(kg) + 6.25 × taille(cm) - 5 × âge + 5
```

Femme :

```txt
BMR = 10 × poids(kg) + 6.25 × taille(cm) - 5 × âge - 161
```

Usage : calcul initial des calories de maintenance avant ajustement par facteur d'activité.

### Objectifs caloriques initiaux

```txt
Perte de gras : maintenance - 300 à 500 kcal/jour
Prise de muscle : maintenance + 150 à 300 kcal/jour
Recomposition : proche maintenance ou léger déficit selon profil
```

Ces valeurs doivent rester des repères adaptables, pas une prescription médicale.

### Protéines

Règle initiale pour utilisateurs actifs :

```txt
1.4 à 2.0 g/kg/jour
```

En déficit calorique ou objectif maintien de masse maigre : viser plutôt le haut de la plage si aucune contre-indication.

---

## 5. Données alimentaires et prix

### Open Food Facts API

Source : https://openfoodfacts.github.io/openfoodfacts-server/api/

Usage futur : récupérer ingrédients, valeurs nutritionnelles et métadonnées produits.

Limite importante : les données sont contributives ; elles doivent être vérifiées et ne doivent pas être utilisées comme source unique pour une prescription médicale.

### Open Prices

Source : https://prices.openfoodfacts.org/

Usage futur : récupérer ou comparer des prix alimentaires lorsque la couverture est suffisante.

Limite importante : les prix changent vite et la couverture dépend des contributions disponibles.

---

## 6. Garde-fous médicaux

Le moteur doit afficher une alerte et recommander un avis professionnel en cas de :

- douleur thoracique ;
- malaise ou syncope ;
- essoufflement inhabituel ;
- grossesse ;
- hypertension non contrôlée ;
- maladie cardiaque connue ;
- maladie rénale ou métabolique importante ;
- blessure récente ;
- douleur aiguë à l'exercice.

---

## 7. Règles à ne pas franchir

- Ne pas prescrire de traitement.
- Ne pas conseiller de dopage, stéroïdes, peptides, produits dopants ou médicaments pour performance.
- Ne pas générer de programme spécialisé pathologie sans avis professionnel.
- Ne pas affirmer qu'un calcul est exact.
- Ne pas présenter les prix comme garantis sans API à jour.
