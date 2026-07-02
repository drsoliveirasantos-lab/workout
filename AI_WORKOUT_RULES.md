# AI_WORKOUT_RULES.md

Document permanent de référence pour toute conversation IA qui travaille sur Workout Nekouto.

Avant de générer, corriger ou intégrer du code, lire ce fichier et appliquer ses règles. Lire aussi `SOURCE_OF_TRUTH.md` et `STABILITY_CHECKLIST.md`.

---

## 1. Objectif général

Workout Nekouto doit produire un générateur d'entraînement et de nutrition clair, accessible et evidence-based pour `workout.nekouto.com`.

Le produit doit privilégier :

1. des formules explicites ;
2. des sources officielles ou scientifiques ;
3. des garde-fous de sécurité ;
4. une personnalisation progressive ;
5. une interface simple pour débutants.

Ne jamais présenter le site comme un avis médical, un diagnostic ou une prescription médicale.

---

## 2. Principe anti-hallucination

Ne pas inventer de recommandations chiffrées.

Chaque chiffre important doit être relié à une source, une formule ou une règle interne documentée :

- estimation 1RM ;
- pourcentage de charge ;
- progression ;
- volume hebdomadaire ;
- calories ;
- protéines ;
- recommandations d'activité physique ;
- limites de sécurité.

Si une recommandation est incertaine, l'interface doit afficher une mention de prudence.

---

## 3. Sources acceptables

Priorité des sources :

1. organismes gouvernementaux ou intergouvernementaux : WHO/OMS, CDC, NIH/NIDDK, ANSES, Santé publique France, Health.gov ;
2. consensus ou sociétés savantes : ACSM, ISSN, NSCA ;
3. articles scientifiques indexés : PubMed, PMC, revues à comité de lecture ;
4. bases ouvertes documentées : Open Food Facts, Open Prices.

Les sources doivent être stockées dans `docs/evidence.md` et/ou dans un module `src/data/sources.js` si elles sont utilisées dans l'interface.

---

## 4. Règles d'entraînement

Ne pas demander un vrai 1RM aux débutants.

Utiliser des séries sous-maximales :

- charge utilisée ;
- répétitions propres ;
- RIR/RPE si disponible ;
- estimation prudente du 1RM ;
- training max inférieur à l'estimation.

Règles initiales :

- e1RM Epley : `poids × (1 + répétitions / 30)` ;
- e1RM Brzycki : `poids × 36 / (37 - répétitions)` ;
- moyenne prudente si les deux sont disponibles ;
- Training Max : `90 % du e1RM` ;
- fiabilité haute si 3-10 reps, moyenne si 11-15 reps, basse au-delà.

L'utilisateur doit comprendre que l'e1RM est une estimation, pas une vérité physiologique absolue.

---

## 5. Règles de progression

Appliquer une progression conservatrice :

- si toutes les séries atteignent le haut de fourchette avec technique propre : augmenter ;
- haut du corps : +2 à +2,5 kg ou +2,5 à 5 % ;
- bas du corps : +2,5 à +5 kg ou +5 à 10 % ;
- fatigue/douleur/performance en baisse : maintenir ou deload.

Toujours privilégier technique et tolérance articulaire avant augmentation de charge.

---

## 6. Règles nutritionnelles

La nutrition doit rester pédagogique et pratique.

Calculs de base :

- métabolisme de base : Mifflin-St Jeor ;
- dépense totale : facteur d'activité ;
- perte de gras : déficit modéré ;
- prise de muscle : surplus modéré ;
- protéines : plage documentée selon poids et objectif.

Plans alimentaires :

- proposer des aliments économiques réalistes ;
- séparer aliments bruts, aliments pratiques et options plus chères ;
- ne pas promettre de prix exact sans source de prix à jour ;
- afficher les prix comme estimations modifiables.

---

## 7. Règles de sécurité

Déclencher un avertissement si l'utilisateur déclare :

- douleur thoracique ;
- malaise, syncope, essoufflement anormal ;
- grossesse ;
- hypertension non contrôlée ;
- pathologie cardiaque, rénale ou métabolique importante ;
- blessure récente ;
- douleur aiguë pendant l'exercice.

Le site doit recommander un avis médical dans ces cas.

---

## 8. Règles techniques repo

Toujours travailler sur la branche `preview`, sauf demande explicite contraire.

Ne pas modifier directement `main` après le bootstrap initial.

Approche recommandée :

1. créer ou modifier des fichiers sources légers ;
2. éviter les bundles énormes ;
3. garder les formules dans des modules isolés ;
4. documenter toute nouvelle règle scientifique ;
5. ajouter ou mettre à jour les tests ;
6. ouvrir une PR courte vers `main` quand la preview est stable.

---

## 9. Règles de qualité UI

L'application doit être utilisable sur mobile.

À vérifier avant déploiement :

- page d'accueil chargée ;
- aucun blocage par overlay ;
- formulaire utilisable au doigt ;
- génération de programme fonctionnelle ;
- résultats lisibles ;
- liens sources visibles ;
- aucun texte contradictoire avec le statut non médical.

---

## 10. Règle Cloudflare

Le site doit rester compatible Cloudflare Pages.

Par défaut :

- build command vide ou `npm run build` si build ajouté plus tard ;
- output directory : `/` ou `dist` selon architecture ;
- éviter les fichiers uniques > 25 MiB ;
- prévoir `_headers` et `_redirects` si nécessaire.
