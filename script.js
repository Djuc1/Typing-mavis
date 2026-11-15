// DOM Elements
const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const timeContainer = document.querySelector('.time-container');
const scoreContainer = document.querySelector('.score-container');
const endgameEl = document.getElementById('end-game-container');
const settingsBtn = document.getElementById('settings-btn');
const settings = document.getElementById('settings');
const difficultySelect = document.getElementById('difficulty');
const themeSelect = document.getElementById('theme-select');

// List of clean words for game
const words = [
  'peter obi',
  'sigh',
  'tense',
  'airplane',
  'ball',
  'pies',
  'juice',
  'warlike',
  'bad',
  'kwankwaso',
  'north',
  'dependent',
  'steer',
  'silver',
  'highfalutin',
  'superficial',
  'quince',
  'eight',
  'feeble',
  'admit',
  'drag',
  'loving',
  'galaxy',
  'velocity',
  'zenith',
  'cascade',
  'phantom',
  'quantum',
  'horizon',
  'abducted',
  'adventurous',
  'algebra',
  'basketball',
  'encountered',
  'entertainment',
  'exceptional',
  'experience',
  'matrix',
  'NDC',
  'vote',
  'election',
  'democracy',
  'south',
  'east',
  'rigging'
];

// Init state
let randomWord = '';
let score = 0;
let time = 10;
let isGameOver = false;

// --------------------------------------------------------------------------
// THEME HANDLING (Clean 3-theme system: Neo-Dark, Cyberpunk, Paper Minimal)
// --------------------------------------------------------------------------
const validThemes = ['neo-dark', 'cyberpunk', 'paper'];
let currentTheme = localStorage.getItem('speed_typer_theme') || 'neo-dark';

// Reset legacy or removed themes (like aurora) to neo-dark
if (!validThemes.includes(currentTheme)) {
  currentTheme = 'neo-dark';
  localStorage.setItem('speed_typer_theme', currentTheme);
}

document.body.setAttribute('data-theme', currentTheme);

if (themeSelect) {
  themeSelect.value = currentTheme;
  themeSelect.addEventListener('change', e => {
    const selectedTheme = e.target.value;
    if (validThemes.includes(selectedTheme)) {
      currentTheme = selectedTheme;
      document.body.setAttribute('data-theme', selectedTheme);
      localStorage.setItem('speed_typer_theme', selectedTheme);
    }
  });
}

// --------------------------------------------------------------------------
// DIFFICULTY HANDLING
// --------------------------------------------------------------------------
const validDifficulties = ['easy', 'medium', 'hard'];
let difficulty = localStorage.getItem('difficulty') || 'medium';

if (!validDifficulties.includes(difficulty)) {
  difficulty = 'medium';
  localStorage.setItem('difficulty', difficulty);
}

if (difficultySelect) {
  difficultySelect.value = difficulty;
  difficultySelect.addEventListener('change', e => {
    difficulty = e.target.value;
    localStorage.setItem('difficulty', difficulty);
  });
}

// Focus on input
text.focus();

// Start countdown
const timeInterval = setInterval(updateTime, 1000);

// Generate random word
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// Add word to DOM with pop micro-animation
function addWordToDOM() {
  randomWord = getRandomWord();
  word.innerHTML = randomWord;

  // Trigger pop animation
  word.classList.remove('word-pop');
  void word.offsetWidth; // Force reflow
  word.classList.add('word-pop');
}

// Update score with micro-feedback
function updateScore() {
  score++;
  scoreEl.innerHTML = score;

  if (scoreContainer) {
    scoreContainer.style.transform = 'scale(1.08)';
    setTimeout(() => {
      scoreContainer.style.transform = 'scale(1)';
    }, 150);
  }
}

// Update time countdown
function updateTime() {
  time--;
  timeEl.innerHTML = time + 's';

  // Danger pulse when time <= 3s
  if (timeContainer) {
    if (time <= 3 && time > 0) {
      timeContainer.classList.add('danger');
    } else {
      timeContainer.classList.remove('danger');
    }
  }

  if (time <= 0) {
    clearInterval(timeInterval);
    gameOver();
  }
}

// Game over screen
function gameOver() {
  isGameOver = true;
  if (timeContainer) timeContainer.classList.remove('danger');

  endgameEl.innerHTML = `
    <div class="end-game-card">
      <div class="end-game-icon">
        <i class="fas fa-trophy"></i>
      </div>
      <h1>Time's Up!</h1>
      <p class="end-game-sub">Great effort! Here is your final summary:</p>
      
      <div class="end-stats-box">
        <div class="end-stat-title">Final Score</div>
        <div class="end-stat-score">${score}</div>
        <div class="end-stat-difficulty">Difficulty: <strong>${difficulty}</strong></div>
      </div>

      <button id="restart-btn" class="btn-restart" onclick="location.reload()">
        <i class="fas fa-redo"></i> Play Again
      </button>
    </div>
  `;

  endgameEl.style.display = 'flex';

  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) {
    restartBtn.focus();
  }
}

// Initialize first word
addWordToDOM();

// --------------------------------------------------------------------------
// EVENT LISTENERS
// --------------------------------------------------------------------------

// Typing input validation & word completion
text.addEventListener('input', e => {
  const insertedText = e.target.value.trim().toLowerCase();

  // Visual error indication if input doesn't match word prefix
  if (insertedText.length > 0 && !randomWord.startsWith(insertedText)) {
    text.classList.add('shake-error');
  } else {
    text.classList.remove('shake-error');
  }

  // Exact match
  if (insertedText === randomWord) {
    addWordToDOM();
    updateScore();

    // Clear input
    e.target.value = '';
    text.classList.remove('shake-error');

    // Add bonus time based on difficulty
    if (difficulty === 'hard') {
      time += 2;
    } else if (difficulty === 'medium') {
      time += 3;
    } else {
      time += 5;
    }

    // Refresh display
    timeEl.innerHTML = time + 's';
    if (timeContainer && time > 3) {
      timeContainer.classList.remove('danger');
    }
  }
});

// Settings button toggle
settingsBtn.addEventListener('click', () => {
  settings.classList.toggle('hide');
});

// Keyboard shortcuts
window.addEventListener('keydown', e => {
  // Close settings with Escape
  if (e.key === 'Escape' && !settings.classList.contains('hide')) {
    settings.classList.add('hide');
  }

  // Quick restart with Enter or Space when game is over
  if (isGameOver && (e.key === 'Enter' || e.key === ' ')) {
    window.location.reload();
  }
});
