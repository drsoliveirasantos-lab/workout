# Workout Nekouto — source of truth

Ce fichier est la première référence à lire avant toute modification du repository.

---

## Produit

Nom public : **Workout Nekouto**

Domaine cible :

```txt
workout.nekouto.com
```

Positionnement :

```txt
Générateur d'entraînements et de repères nutritionnels personnalisés, basé sur des formules transparentes, des recommandations officielles et des garde-fous de sécurité.
```

---

## Branche de travail

Branche de développement :

```txt
preview
```

Branche stable/déploiement final :

```txt
main
```

Règle : ne pas travailler directement sur `main`, sauf bootstrap initial ou demande explicite.

---

## Sources éditables

Architecture initiale sans framework lourd :

```txt
index.html
src/styles.css
src/app.js
src/engine/training.js
src/engine/nutrition.js
src/data/exercises.js
src/data/foods.js
src/data/sources.js
```

Ces fichiers sont les sources réelles. Ne pas créer de bundle minifié manuel tant que ce n'est pas nécessaire.

---

## Documentation scientifique

Source documentaire centrale :

```txt
docs/evidence.md
```

Toute nouvelle formule ou règle chiffrée doit être ajoutée dans ce fichier.

---

## Tests

Tests recommandés :

```txt
tests/workout-ui.spec.js
```

Priorité des tests :

1. boot-health ;
2. real-click-full ;
3. mobile-real-click ;
4. console-error-strict ;
5. formula-smoke ;
6. dead-link/sources-visible.

---

## Cloudflare Pages

Déploiement cible : GitHub → Cloudflare Pages.

Configuration initiale recommandée :

```txt
Framework preset: None / Static site
Build command: aucun au début, ou npm run build si build ajouté
Output directory: /
Production branch: main
Preview branch: preview
```

---

## Règles médicales et sécurité

Le site ne remplace pas un médecin, un kinésithérapeute, un diététicien ou un coach diplômé.

L'interface doit afficher des avertissements si un utilisateur mentionne :

- douleur thoracique ;
- malaise/syncope ;
- pathologie cardiaque ;
- hypertension non contrôlée ;
- grossesse ;
- maladie rénale/métabolique importante ;
- blessure récente ;
- douleur aiguë à l'effort.

---

## Ce qui n'est pas encore source de vérité

Ne pas traiter comme définitif :

- prix alimentaires saisis en dur ;
- programme avancé de powerlifting/bodybuilding ;
- prescriptions pour pathologies ;
- recommandations de suppléments ;
- données Open Food Facts/Open Prices sans validation de couverture.
