import { EXERCISES } from './data/exercises.js';
import { estimateOneRepMax, generateTrainingPlan } from './engine/training.js';
import { calculateNutritionTargets, buildBudgetMenu } from './engine/nutrition.js';

const state = {
  strengthTests: []
};

const selectors = {
  strengthForm: '#strength-form',
  profileForm: '#profile-form',
  exerciseSelect: '#exercise-id',
  testsList: '#tests-list',
  result: '#result'
};

function init() {
  hydrateExerciseSelect();
  bindForms();
  renderEmptyState();
}

function hydrateExerciseSelect() {
  const select = document.querySelector(selectors.exerciseSelect);
  if (!select) return;

  select.innerHTML = EXERCISES
    .filter((exercise) => exercise.loadSource === 'estimated-1rm')
    .map((exercise) => `<option value="${exercise.id}">${exercise.name}</option>`)
    .join('');
}

function bindForms() {
  const strengthForm = document.querySelector(selectors.strengthForm);
  const profileForm = document.querySelector(selectors.profileForm);
  const loadDemoButton = document.querySelector('#load-demo');
  const clearTestsButton = document.querySelector('#clear-tests');

  strengthForm?.addEventListener('submit', handleStrengthSubmit);
  profileForm?.addEventListener('submit', handleProfileSubmit);
  loadDemoButton?.addEventListener('click', loadDemo);
  clearTestsButton?.addEventListener('click', () => {
    state.strengthTests = [];
    renderTests();
    renderEmptyState();
  });
}

function handleStrengthSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const exerciseId = form.get('exerciseId');
  const exercise = EXERCISES.find((item) => item.id === exerciseId);

  try {
    const estimate = estimateOneRepMax({
      weight: form.get('testWeight'),
      reps: form.get('testReps'),
      rir: form.get('testRir')
    });

    const test = {
      exerciseId,
      exerciseName: exercise.name,
      ...estimate
    };

    state.strengthTests = state.strengthTests.filter((item) => item.exerciseId !== exerciseId);
    state.strengthTests.push(test);
    renderTests();
    renderNotice(`Test ajouté : ${exercise.name}, e1RM ≈ ${test.estimatedOneRm} kg, Training Max ${test.trainingMax} kg.`, 'success');
  } catch (error) {
    renderNotice(error.message, 'error');
  }
}

function handleProfileSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const profile = {
    sex: form.get('sex'),
    age: form.get('age'),
    heightCm: form.get('heightCm'),
    weightKg: form.get('weightKg'),
    level: form.get('level'),
    goal: form.get('goal'),
    daysPerWeek: form.get('daysPerWeek'),
    activity: form.get('activity'),
    budget: form.get('budget'),
    equipment: form.get('equipment'),
    injuries: form.get('injuries'),
    medicalFlags: form.get('medicalFlags')
  };

  try {
    const plan = generateTrainingPlan({ profile, strengthTests: state.strengthTests });
    const nutrition = calculateNutritionTargets(profile);
    const menu = buildBudgetMenu(nutrition);
    renderPlan(plan, nutrition, menu);
  } catch (error) {
    renderNotice(error.message, 'error');
  }
}

function renderTests() {
  const container = document.querySelector(selectors.testsList);
  if (!container) return;

  if (!state.strengthTests.length) {
    container.innerHTML = '<p class="muted">Aucun test ajouté. Tu peux quand même générer un plan : les charges seront données en RIR.</p>';
    return;
  }

  container.innerHTML = state.strengthTests.map((test) => `
    <article class="mini-card">
      <strong>${test.exerciseName}</strong>
      <span>${test.inputWeight} kg × ${test.inputReps} reps ${test.rir ? `+ RIR ${test.rir}` : ''}</span>
      <span>e1RM ≈ ${test.estimatedOneRm} kg · Training Max ${test.trainingMax} kg · fiabilité ${test.reliability}</span>
      ${test.warning ? `<em>${test.warning}</em>` : ''}
    </article>
  `).join('');
}

function renderPlan(plan, nutrition, menu) {
  const result = document.querySelector(selectors.result);
  if (!result) return;

  result.classList.remove('empty');

  result.innerHTML = `
    <div class="result-header">
      <p class="eyebrow">Programme généré</p>
      <h2>${plan.title}</h2>
      <p>${plan.intensity.cardio}</p>
    </div>

    ${plan.safety.flags.length ? `
      <div class="alert alert-warning">
        <strong>Prudence médicale</strong>
        <p>${plan.safety.message}</p>
        <small>Détecté : ${plan.safety.flags.join(', ')}</small>
      </div>
    ` : `
      <div class="alert alert-neutral">
        <strong>Sécurité</strong>
        <p>${plan.safety.message}</p>
      </div>
    `}

    <section class="result-section">
      <h3>Entraînement</h3>
      <div class="sessions-grid">
        ${plan.sessions.map(renderSession).join('')}
      </div>
    </section>

    <section class="result-section two-columns">
      <div>
        <h3>Progression</h3>
        <ul class="clean-list">
          <li><strong>Méthode :</strong> ${plan.progression.method}</li>
          <li>${plan.progression.rule}</li>
          <li><strong>Haut du corps :</strong> ${plan.progression.upperBody}</li>
          <li><strong>Bas du corps :</strong> ${plan.progression.lowerBody}</li>
          <li><strong>Deload :</strong> ${plan.progression.deload}</li>
          <li>${plan.progression.goalNote}</li>
        </ul>
      </div>
      <div>
        <h3>Nutrition</h3>
        <ul class="clean-list">
          <li><strong>BMR estimé :</strong> ${nutrition.bmr} kcal/jour</li>
          <li><strong>Maintenance :</strong> ${nutrition.maintenance} kcal/jour</li>
          <li><strong>Cible :</strong> ${nutrition.calories.min}-${nutrition.calories.max} kcal/jour</li>
          <li><strong>Protéines :</strong> ${nutrition.protein.min}-${nutrition.protein.max} g/jour</li>
          <li>${nutrition.calories.note}</li>
        </ul>
      </div>
    </section>

    <section class="result-section">
      <h3>${menu.title}</h3>
      <p><strong>Budget indicatif :</strong> ${menu.budget}</p>
      <p class="muted">${menu.note}</p>
      <div class="food-grid">
        ${menu.staples.map((food) => `
          <article class="food-card">
            <strong>${food.name}</strong>
            <span>${food.role}</span>
            <small>${food.protein}</small>
          </article>
        `).join('')}
      </div>
      <h4>Journée type</h4>
      <ol class="clean-list ordered">
        ${menu.dayTemplate.map((item) => `<li>${item}</li>`).join('')}
      </ol>
      <p>${menu.proteinTargetText}</p>
    </section>
  `;
}

function renderSession(session) {
  return `
    <article class="session-card">
      <h4>${session.title}</h4>
      <p class="muted">${session.warmup}</p>
      <div class="exercise-list">
        ${session.exercises.map((exercise) => `
          <div class="exercise-row">
            <div>
              <strong>${exercise.name}</strong>
              <span>${exercise.muscles.join(', ')}</span>
              <small>Alternative débutant : ${exercise.alternative}</small>
            </div>
            <div class="exercise-dose">
              <strong>${exercise.sets}×${exercise.repRange[0]}-${exercise.repRange[1]}</strong>
              <span>${exercise.loadText}</span>
              <small>${exercise.rest}</small>
            </div>
          </div>
        `).join('')}
      </div>
      <p class="muted">${session.cooldown}</p>
    </article>
  `;
}

function renderEmptyState() {
  const result = document.querySelector(selectors.result);
  if (!result) return;

  result.classList.add('empty');
  result.innerHTML = `
    <p class="eyebrow">Résultat</p>
    <h2>Ajoute un test de charge ou génère directement un programme.</h2>
    <p>Le moteur utilise un Training Max prudent. Sans test, les charges seront prescrites avec une logique RIR 2-3.</p>
  `;
}

function renderNotice(message, type = 'neutral') {
  const notice = document.querySelector('#notice');
  if (!notice) return;

  notice.textContent = message;
  notice.className = `notice ${type}`;
}

function loadDemo() {
  document.querySelector('[name="age"]').value = 29;
  document.querySelector('[name="heightCm"]').value = 169;
  document.querySelector('[name="weightKg"]').value = 85;
  document.querySelector('[name="level"]').value = 'beginner';
  document.querySelector('[name="goal"]').value = 'recomposition';
  document.querySelector('[name="daysPerWeek"]').value = 3;
  document.querySelector('[name="activity"]').value = 'light';
  document.querySelector('[name="budget"]').value = 'very_low';
  document.querySelector('[name="equipment"]').value = 'basic';

  state.strengthTests = [
    { exerciseId: 'bench_press', exerciseName: 'Développé couché', ...estimateOneRepMax({ weight: 60, reps: 6, rir: 1 }) },
    { exerciseId: 'squat', exerciseName: 'Squat', ...estimateOneRepMax({ weight: 80, reps: 5, rir: 1 }) }
  ];
  renderTests();
  renderNotice('Profil de démonstration chargé.', 'success');
}

init();
