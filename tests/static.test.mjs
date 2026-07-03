import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function text(path) {
  return readFile(path, 'utf8');
}

test('biomech profile uses only the two active SVG body maps', async () => {
  const html = await text('profil.html');
  const script = await text('src/biomech-profile.js');
  const build = await text('scripts/build-static.mjs');

  assert.match(html, /src\/biomech-profile\.js/);
  assert.doesNotMatch(html, /biomech-zone-filter/);
  assert.doesNotMatch(html, /biomech-click-zones/);
  assert.doesNotMatch(html, /biomech-map-cleanup/);
  assert.doesNotMatch(html, /biomech-map-overrides/);
  assert.doesNotMatch(html, /biomech-zone-visibility/);
  assert.match(script, /body_front_zones\.svg/);
  assert.match(script, /body_back\.svg/);
  assert.doesNotMatch(script, /body_back_and_front_zones/);
  assert.match(build, /body_front_zones\.svg/);
  assert.match(build, /body_back\.svg/);
  assert.doesNotMatch(build, /body_back_and_front_zones/);
});

test('plan page exposes quick mode, resume action and local workout tracking', async () => {
  const plan = await text('plan.html');
  const app = await text('src/app.js');
  const home = await text('index.html');
  const homeResume = await text('src/home-resume.js');

  assert.match(plan, /data-set-mode="quick"/);
  assert.match(plan, /id="resume-plan"/);
  assert.match(plan, /id="clear-saved-plan"/);
  assert.match(app, /workout-nykuto-plan-v1/);
  assert.match(app, /renderTodaySession/);
  assert.match(app, /data-exercise-feedback/);
  assert.match(app, /Sauvegardé sur cet appareil/);
  assert.match(home, /resume-home-plan/);
  assert.match(homeResume, /hasSavedPlan/);
});

test('premium controls include custom dropdown menus for short selects', async () => {
  const ux = await text('src/ux-polish.js');
  const css = await text('src/premium-controls.css');
  const workflow = await text('.github/workflows/validate.yml');

  assert.match(ux, /injectPremiumControlStyles/);
  assert.match(ux, /decoratePremiumControls/);
  assert.match(ux, /enhanceCustomSelect/);
  assert.match(ux, /customSelectLongNames/);
  assert.match(ux, /custom-select-native/);
  assert.match(ux, /premium-controls\.css\?v=20260703-select2/);
  assert.match(ux, /loadVisualPickers/);
  assert.match(ux, /visual-pickers\.js\?v=20260703-picker1/);
  assert.match(ux, /premium-control-field/);
  assert.match(css, /--control-bg-top/);
  assert.match(css, /appearance: none/);
  assert.match(css, /custom-select-menu/);
  assert.match(css, /custom-select-option/);
  assert.match(css, /var\(--control-border-strong\)/);
  assert.match(css, /data-control-icon/);
  assert.match(workflow, /dist\/src\/premium-controls\.css/);
  assert.match(workflow, /dist\/src\/visual-pickers\.js/);
});

test('visual pickers add compact number wheels and profile cards', async () => {
  const visual = await text('src/visual-pickers.js');
  const css = await text('src/visual-pickers.css');

  assert.match(visual, /pickerConfig/);
  assert.match(visual, /heightCm/);
  assert.match(visual, /number-wheel/);
  assert.match(visual, /visualChoiceMeta/);
  assert.match(visual, /physicalProfile/);
  assert.match(visual, /sex-card-group/);
  assert.match(visual, /physique-card-group/);
  assert.match(css, /number-wheel-track/);
  assert.match(css, /visual-choice-card/);
  assert.match(css, /visual-choice-icon/);
});

test('sources page explains the public method without exposing exact internal coefficients', async () => {
  const sources = await text('sources.html');

  assert.match(sources, /Méthode de calcul/);
  assert.match(sources, /répétitions effectives = répétitions réalisées \+ RIR/);
  assert.match(sources, /Epley = charge × \(1 \+ répétitions effectives \/ 30\)/);
  assert.match(sources, /Brzycki = charge × 36 \/ \(37 - répétitions effectives\)/);
  assert.match(sources, /similarité = pondération interne\(muscles, mouvement, mécanique, stabilité\)/);
  assert.match(sources, /charge cible ≈ plage source × coefficient prudent/);
  assert.match(sources, /fiabilité ≈ qualité du test × proximité biomécanique/);
  assert.doesNotMatch(sources, /45% muscles \+ 35% mouvement/);
  assert.doesNotMatch(sources, /0,88 \+ similarité × 0,12/);
});

test('public evidence page does not link raw internal documentation', async () => {
  const evidence = await text('evidence.html');
  const build = await text('scripts/build-static.mjs');

  assert.match(evidence, /Workout Nykuto/);
  assert.match(evidence, /documentation technique complète/);
  assert.doesNotMatch(evidence, /docs\/evidence\.md/);
  assert.doesNotMatch(build, /cp\('docs'/);
});

test('core site pages remain wired', async () => {
  const index = await text('index.html');
  const plan = await text('plan.html');
  const profile = await text('profil.html');

  assert.match(index, /Workout Nykuto/);
  assert.match(plan, /profile-form/);
  assert.match(profile, /Profil biomécanique/);
  assert.match(profile, /body-map-mount/);
});
