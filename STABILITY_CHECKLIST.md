# Workout Nekouto — checklist de stabilité

Date initiale : 2026-07-02
Branche de travail : `preview`

---

## Principe principal

Corriger d'abord la source réelle du problème. Avant d'ajouter une couche JavaScript/CSS ou un contournement, identifier le fichier, la fonction, le sélecteur ou la règle responsable.

Ajouter un fichier séparé seulement si :

- le fichier source est généré ;
- la correction directe est risquée ;
- la compatibilité avec une ancienne structure doit être conservée ;
- un module isolé rend la logique plus testable.

---

## Avant chaque changement

1. Confirmer que le travail se fait sur `preview`.
2. Lire `AI_WORKOUT_RULES.md` et `SOURCE_OF_TRUTH.md`.
3. Identifier la zone concernée : UI, entraînement, nutrition, sources, tests, déploiement.
4. Modifier le fichier source le plus proche du problème.
5. Garder les commits petits et explicites.
6. Mettre à jour la documentation si une règle scientifique change.

---

## Tests obligatoires avant merge

- `/` charge sans erreur.
- Le formulaire accepte un profil débutant.
- L'estimation e1RM fonctionne.
- Le programme généré affiche exercices, séries, reps, charges et progression.
- Le module nutrition affiche calories, protéines et budget.
- Les sources sont visibles.
- Le site est lisible mobile.
- Aucune erreur console critique.

---

## Signaux d'alerte

- Le site demande un vrai 1RM à un débutant.
- Une charge est générée sans formule visible.
- Une recommandation médicale est formulée comme une prescription.
- Une source scientifique est absente ou non vérifiée.
- Des prix alimentaires sont présentés comme certains alors qu'ils sont estimés.
- Un bouton principal ne fonctionne pas sur mobile.
- Un fichier dépasse inutilement plusieurs Mo.

---

## Pages/sections MVP à valider

- Hero + promesse evidence-based.
- Profil utilisateur.
- Estimation de charge.
- Génération d'entraînement.
- Nutrition budget-aware.
- Sources et limites.
- Avertissement sécurité.
