# Workout Nykuto

Evidence-based workout and nutrition planning prototype for `workout.nykuto.com`.

## Status

Initial MVP created on the `preview` branch.

## Working rule

Development work should happen on the `preview` branch first. `main` is kept as the deployable baseline.

Reference files to read before editing:

1. `AI_WORKOUT_RULES.md`
2. `SOURCE_OF_TRUTH.md`
3. `STABILITY_CHECKLIST.md`
4. `docs/evidence.md`

## Scope

- Estimate training loads from submaximal sets instead of unsafe 1RM testing for beginners.
- Generate beginner/intermediate strength and hypertrophy sessions using transparent formulas.
- Add nutrition targets and budget-aware food suggestions.
- Keep sources, formulas, limits, and safety rules visible in the repository.

## Current MVP features

- Static Cloudflare-compatible page.
- e1RM estimation with Epley and Brzycki.
- Conservative Training Max at 90% of estimated 1RM.
- Training generation for 2-5 sessions/week.
- Goal-specific intensity logic.
- Nutrition targets with Mifflin-St Jeor BMR.
- Budget-aware food baskets.
- Safety warning if medical risk terms are declared.
- Source registry and evidence documentation.
- Node test suite and GitHub Actions validation.

## Local commands

```bash
npm test
npm run build
```

The static build is copied to `dist/`.

## Cloudflare Pages setup

Recommended first setup:

```txt
Production branch: main
Preview branch: preview
Build command: npm run build
Output directory: dist
```

## Safety disclaimer

Workout Nykuto is an educational tool. It does not replace medical, dietetic, physiotherapy or professional coaching advice.
