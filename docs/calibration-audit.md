# Audit calibration — familles, muscles et formules

## Résumé

Audit réalisé sur le moteur de calibration, les familles musculaires, les profils d’exercices, les transferts de charge et l’interface mobile.

Statut actuel :

- Les grands groupes affichés dans le tableau de calibration sont complets pour un profil avancé : Pecs, Dos, Épaules, Jambes, Bras, Mollets.
- Les mouvements internes couvrent les principaux patrons utiles au calcul : développé/chest press, écarté/pec deck, rowing, tirage vertical, développé épaules, élévation latérale, squat/leg press, leg extension, leg curl, hip thrust, curl, pushdown, calf raise.
- Les exercices principaux ont des profils de muscles, stabilité, modalité et coefficient de charge.
- Les transferts entre exercices utilisent une similarité composite : muscles sollicités, famille de mouvement, mécanique et stabilité.
- Les exercices non transférables restent en RIR au lieu de recevoir une fausse charge calculée.

## Corrections appliquées

### 1. Menus fermés par défaut

Les étapes principales de la page ne sont plus ouvertes au chargement. L’utilisateur voit d’abord :

- Étape 1 — Profil
- Étape 2 — Calibration
- Étape 3 — Générer le programme

Il choisit ensuite lui-même ce qu’il veut dérouler.

### 2. Haltères : poids par main

Les mouvements haltères précisent maintenant l’unité d’entrée :

- Développé haltères : kg par haltère
- Développé incliné haltères : kg par haltère
- Développé épaules haltères : kg par haltère
- Curl haltères : kg par haltère
- Élévation latérale haltères : kg par main

Pour les développés haltères et curls bilatéraux, le moteur convertit le poids saisi en charge interne totale lorsque c’est nécessaire pour comparer avec une barre ou une machine.

Exemple : développé incliné haltères 30 kg = 30 kg par main = 60 kg internes pour les transferts.

### 3. Sous-tests en rouleaux

Chaque mouvement devient un sous-menu indépendant :

- Pecs
  - Développé / chest press
  - Écarté / pec deck
- Jambes
  - Squat / leg press
  - Quadriceps / leg extension
  - Ischios / leg curl
  - Fessiers / hip thrust

Cela évite un gros bloc de champs ouvert d’un coup.

### 4. Minimum selon le niveau

Le tableau distingue :

- minimum requis pour le niveau choisi ;
- couverture avancée complète.

Exemple :

- Minimum pour ton niveau : 0/3
- Tous les groupes avancés : 0/13

## Audit des familles

### Pecs

Familles : horizontal_push, pec_isolation

Exercices couverts :

- Développé couché
- Chest press machine
- Développé incliné barre
- Développé incliné haltères
- Développé décliné
- Développé haltères
- Pec deck
- Écarté poulie
- Cable fly
- Butterfly machine

Muscles représentés : pectoraux, haut des pectoraux, triceps, deltoïde antérieur, biceps stabilisateur léger.

Correction importante : les haltères sont maintenant saisis en kg par haltère et convertis en charge interne. Les pecs ont maintenant deux tests avancés : un test de poussée lourde et un test d’isolation/adduction horizontale.

### Dos

Familles : horizontal_pull, vertical_pull

Exercices couverts :

- Rowing machine
- Rowing barre
- Rameur bas prise triangle
- Rameur bas prise ouverte machine
- Rowing haltère appuyé
- High row machine
- Tirage vertical / pulley
- Tirage supination
- Tractions assistées
- Pullover poulie bras tendus
- Face pull
- Oiseau machine inversée

Muscles représentés : grand dorsal, rhomboïdes, trapèzes, biceps, lombaires, grand rond, deltoïde postérieur, rotateurs externes.

Point de prudence : face pull et oiseau inversé ne doivent pas transférer fortement vers rowing lourd. Le moteur les garde avec une similarité plus basse ou un transfert prudent.

### Épaules

Familles : vertical_push, shoulder_abduction

Exercices couverts :

- Développé assis
- Développé militaire
- Shoulder press machine
- Développé haltères assis
- Élévation latérale haltères
- Élévation latérale poulie
- Élévation latérale machine
- Élévation frontale à la corde

Muscles représentés : deltoïde antérieur, deltoïde latéral, triceps, haut pectoraux, trapèzes.

Correction déjà appliquée : l’élévation latérale est une famille séparée du développé épaules, car le transfert entre développé lourd et élévation latérale est faible.

### Jambes

Familles : leg_press_pattern, knee_extension, knee_flexion, hip_extension

Exercices couverts :

- Leg press 45°
- Squat Smith
- Hack squat
- Goblet squat
- Presse horizontale
- Leg extension
- Leg extension unilatéral
- Leg curl couché
- Leg curl assis
- Leg curl debout
- Hip thrust
- Hip thrust machine
- Glute bridge
- RDL

Muscles représentés : quadriceps, fessiers, ischios, adducteurs, mollets, tronc, lombaires.

Point important : hack squat et leg press restent proches mais pas identiques. Hack squat met plus l’accent sur quadriceps, leg press dépend beaucoup du placement des pieds, et squat Smith garde plus de demande globale.

### Bras

Familles : elbow_flexion, elbow_extension

Exercices couverts :

- Curl barre
- Curl Scott machine
- Curl câble
- Curl haltères
- Extension triceps corde
- Pushdown barre
- Extension machine
- Triceps français

Muscles représentés : biceps, brachial, avant-bras, triceps, deltoïde antérieur.

Correction importante : curl haltères est saisi en kg par haltère et converti en charge interne pour comparaison avec barre/câble.

### Mollets

Famille : calf_raise

Exercices couverts :

- Mollets debout à la machine
- Mollets assis
- Presse à mollets

Muscles représentés : gastrocnémien, soléaire, stabilisateurs du pied.

Point de prudence : mollets assis et debout ne ciblent pas exactement les mêmes proportions gastrocnémien/soléaire, donc les coefficients restent distincts.

## Audit des formules

### Estimation 1RM

Le moteur utilise une estimation basée sur la série sous-maximale et le RIR :

- répétitions effectives = reps réalisées + RIR ;
- moyenne Epley / Brzycki ;
- Training Max = 90 % de l’e1RM estimé ;
- fiabilité plus haute entre 3 et 10 répétitions, plus basse au-delà.

### Calibration

Le moteur calcule :

- charge saisie ;
- charge interne normalisée si haltères ;
- e1RM estimé ;
- Training Max ;
- plage de travail 8-12 reps ;
- score de confiance selon répétitions, douleur et technique.

### Transfert entre exercices

Le transfert utilise :

- similarité musculaire ;
- similarité du mouvement ;
- similarité mécanique ;
- stabilité de l’exercice ;
- coefficient de charge source/cible.

Si le transfert est trop faible, le moteur ne calcule pas de charge et repasse en RIR.

## Points à surveiller plus tard

- Ajouter une famille spécifique deltoïde postérieur si l’utilisateur veut calibrer précisément face pull / reverse pec deck.
- Ajouter une distinction pied haut / pied bas pour leg press si l’interface devient plus avancée.
- Ajouter unilateral/bilateral explicite pour plus d’exercices unilatéraux.
- Ajouter un affichage “charge cible par main” dans les résultats finaux quand la cible est un exercice haltère.
