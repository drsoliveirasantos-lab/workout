const STORAGE_KEY = 'workout-nykuto-plan-v1';

function initHomeResume() {
  const button = document.querySelector('#resume-home-plan');
  if (!button) return;

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    button.hidden = !saved?.hasSavedPlan;
  } catch {
    button.hidden = true;
  }
}

initHomeResume();
