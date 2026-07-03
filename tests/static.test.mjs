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

test('core site pages remain wired', async () => {
  const index = await text('index.html');
  const plan = await text('plan.html');
  const profile = await text('profil.html');

  assert.match(index, /Workout Nykuto/);
  assert.match(plan, /profile-form/);
  assert.match(profile, /Profil biomécanique/);
  assert.match(profile, /body-map-mount/);
});
