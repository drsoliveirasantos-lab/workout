import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function text(path) {
  return readFile(path, 'utf8');
}

test('static site smoke check', async () => {
  const index = await text('index.html');
  const plan = await text('plan.html');
  const profile = await text('profil.html');
  const profileScript = await text('src/biomech-profile.js');
  const build = await text('scripts/build-static.mjs');

  assert.match(index, /Workout Nykuto/);
  assert.match(plan, /profile-form/);
  assert.match(profile, /body-map-mount/);
  assert.match(profileScript, /body_back_and_front_zones\.svg/);
  assert.match(profileScript, /loadDirectSvgText/);
  assert.match(build, /body_back_and_front_zones\.svg/);
});
