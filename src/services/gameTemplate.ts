export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  afbLevel?: 'I' | 'II' | 'III';
}

export interface BuildGameOptions {
  title: string;
  subject: string;
  grade: number | string;
  topic: string;
  questions: QuizQuestion[];
  inclusionMode?: boolean;
  vocabulary?: { term: string; explanation: string }[];
  gameMode?: 'quiz' | 'memory' | 'order';
  gameSocialMode?: 'solo' | 'duell' | 'escape';
  gameStoryTheme?: 'neutral' | 'detective' | 'space' | 'alchemy' | 'custom';
  customStoryTheme?: string;
  orderSequence?: string[];
  escapeCode?: string;
}

export function buildSelfContainedGameHtml({
  title,
  subject,
  grade,
  topic,
  questions,
  inclusionMode = false,
  vocabulary = [],
  gameMode = 'quiz',
  gameSocialMode = 'solo',
  gameStoryTheme = 'neutral',
  customStoryTheme = '',
  orderSequence = [],
  escapeCode = '4829'
}: BuildGameOptions): string {
  const safeQuestionsJson = JSON.stringify(questions || []);
  const safeVocabJson = JSON.stringify(vocabulary || []);
  const safeOrderJson = JSON.stringify(orderSequence && orderSequence.length > 0 ? orderSequence : [
    'Schritt 1: Problemstellung und Phänomen erfassen',
    'Schritt 2: Fachbegriffe und Kriterien analysieren',
    'Schritt 3: Hypothese überprüfen und Ursache begründen',
    'Schritt 4: Ergebnis sichern und didaktisches Urteil fällen'
  ]);
  const safeEscapeCode = escapeCode || '4829';

  // Theme styling definitions
  let themeStyles = `
    --primary: #006185;
    --primary-dark: #004561;
    --primary-light: #e1f3fa;
    --secondary: #006b5f;
    --accent: #e67e22;
    --bg-grad: linear-gradient(135deg, #eaf2fb 0%, #f7f9ff 100%);
    --card-bg: #ffffff;
    --theme-title-prefix: "Lernspiel-Werkstatt";
    --theme-icon: "🎓";
  `;

  if (gameStoryTheme === 'detective') {
    themeStyles = `
      --primary: #1e293b;
      --primary-dark: #0f172a;
      --primary-light: #fef3c7;
      --secondary: #b45309;
      --accent: #d97706;
      --bg-grad: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      --card-bg: #f8fafc;
      --theme-title-prefix: "Fallakte: Spurensuche";
      --theme-icon: "🔍";
    `;
  } else if (gameStoryTheme === 'space') {
    themeStyles = `
      --primary: #0f172a;
      --primary-dark: #020617;
      --primary-light: #cffafe;
      --secondary: #0891b2;
      --accent: #06b6d4;
      --bg-grad: linear-gradient(135deg, #090d16 0%, #172554 100%);
      --card-bg: #0f172a;
      --text: #f8fafc;
      --theme-title-prefix: "Raumschiff-Mission";
      --theme-icon: "🚀";
    `;
  } else if (gameStoryTheme === 'alchemy') {
    themeStyles = `
      --primary: #064e3b;
      --primary-dark: #022c22;
      --primary-light: #d1fae5;
      --secondary: #059669;
      --accent: #10b981;
      --bg-grad: linear-gradient(135deg, #022c22 0%, #064e3b 100%);
      --card-bg: #ffffff;
      --theme-title-prefix: "Labor-Mission";
      --theme-icon: "🧪";
    `;
  } else if (gameStoryTheme === 'custom' && customStoryTheme && customStoryTheme.trim().length > 0) {
    themeStyles = `
      --primary: #581c87;
      --primary-dark: #3b0764;
      --primary-light: #f3e8ff;
      --secondary: #7e22ce;
      --accent: #d946ef;
      --bg-grad: linear-gradient(135deg, #1e1b4b 0%, #3b0764 100%);
      --card-bg: #ffffff;
      --theme-title-prefix: "${escapeHtml(customStoryTheme.trim())}";
      --theme-icon: "✨";
    `;
  }

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Interaktives Lernspiel</title>
  <style>
    :root {
      ${themeStyles}
      --text-main: #091d2e;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --correct: #10b981;
      --wrong: #ef4444;
      --p1-color: #ef4444;
      --p2-color: #2563eb;
      --font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

    body {
      background: var(--bg-grad);
      color: var(--text-main);
      font-family: var(--font-family);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0.75rem;
    }

    .game-container {
      width: 100%;
      max-width: 860px;
      background: var(--card-bg);
      border-radius: 1.5rem;
      border: 1px solid var(--border);
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px rgba(0,0,0,0.04);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* TOP STATUS BAR */
    .top-bar {
      background: var(--primary);
      color: #ffffff;
      padding: 0.85rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
    }

    .badge-pill {
      background: rgba(255, 255, 255, 0.22);
      backdrop-filter: blur(8px);
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .header-icons {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .btn-icon {
      background: rgba(255,255,255,0.18);
      border: none;
      color: white;
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 0.6rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: background 0.2s;
    }
    .btn-icon:hover { background: rgba(255,255,255,0.3); }

    /* PROGRESS TRACK */
    .progress-track {
      background: #e2e8f0;
      height: 6px;
      width: 100%;
      position: relative;
    }
    .progress-fill {
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      height: 100%;
      width: 0%;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* MAIN CONTENT */
    .game-content {
      padding: 1.5rem 1.25rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* ESCAPE CODE SAFE BANNER */
    .escape-safe-box {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: #ffffff;
      border-radius: 1.25rem;
      padding: 1rem;
      margin-bottom: 1.25rem;
      text-align: center;
      box-shadow: 0 10px 20px -5px rgba(0,0,0,0.3);
      border: 2px solid #334155;
    }
    .safe-title {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #94a3b8;
      margin-bottom: 0.5rem;
    }
    .safe-digits {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
    }
    .safe-digit {
      width: 3rem;
      height: 3.5rem;
      background: #020617;
      border: 2px solid #475569;
      border-radius: 0.75rem;
      font-family: monospace;
      font-size: 1.75rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #e2e8f0;
      box-shadow: inset 0 2px 5px rgba(0,0,0,0.6);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .safe-digit.unlocked {
      background: #065f46;
      border-color: #10b981;
      color: #34d399;
      transform: scale(1.08);
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
    }

    /* QUIZ OPTIONS */
    .question-prompt {
      font-size: 1.2rem;
      font-weight: 800;
      line-height: 1.4;
      color: var(--text-main);
      margin-bottom: 1.25rem;
    }

    .options-stack {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .option-button {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-bottom-width: 4px;
      border-radius: 1rem;
      padding: 1rem 1.15rem;
      text-align: left;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      transition: all 0.15s;
    }
    .option-button:hover:not(:disabled) {
      border-color: #cbd5e1;
      background: #f8fafc;
      transform: translateY(-2px);
    }
    .option-button:active:not(:disabled) {
      transform: translateY(2px);
      border-bottom-width: 2px;
    }
    .option-button.correct {
      background: #ecfdf5 !important;
      border-color: var(--correct) !important;
      color: #065f46 !important;
    }
    .option-button.wrong {
      background: #fef2f2 !important;
      border-color: var(--wrong) !important;
      color: #991b1b !important;
    }

    /* 2-PLAYER DUELL SPLIT SCREEN */
    .duell-score-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f1f5f9;
      border-radius: 1rem;
      padding: 0.6rem 1rem;
      margin-bottom: 1rem;
      font-weight: 800;
      font-size: 0.9rem;
    }
    .p1-score { color: var(--p1-color); }
    .p2-score { color: var(--p2-color); }

    .duell-players-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .duell-player-col {
      background: #f8fafc;
      border-radius: 1rem;
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
    }
    .duell-player-col.p1 { border-color: rgba(239, 68, 68, 0.4); }
    .duell-player-col.p2 { border-color: rgba(37, 99, 235, 0.4); }
    .player-header-label {
      font-size: 0.75rem;
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    /* MEMORY GAME STYLES */
    .memory-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.6rem;
      margin-bottom: 1rem;
      perspective: 1000px;
    }
    @media (max-width: 500px) {
      .memory-grid { grid-template-columns: repeat(3, 1fr); }
    }
    .memory-card {
      height: 5.5rem;
      background: #ffffff;
      border: 2px solid #cbd5e1;
      border-radius: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0.4rem;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .memory-card.back {
      background: linear-gradient(135deg, var(--primary) 0%, #0284c7 100%);
      color: white;
      font-size: 1.25rem;
    }
    .memory-card.matched {
      background: #ecfdf5;
      border-color: #10b981;
      color: #065f46;
      cursor: default;
      transform: scale(0.96);
    }

    /* CHRONOLOGY & ORDER STYLES */
    .order-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin-bottom: 1.25rem;
    }
    .order-item {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 1rem;
      padding: 0.85rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      font-size: 0.9rem;
      font-weight: 700;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }
    .order-item.correct-pos {
      border-color: #10b981;
      background: #f0fdf4;
    }
    .order-actions {
      display: flex;
      gap: 0.3rem;
    }
    .order-btn {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 0.5rem;
      padding: 0.3rem 0.6rem;
      font-size: 0.85rem;
      cursor: pointer;
      font-weight: bold;
    }
    .order-btn:hover { background: #e2e8f0; }

    /* EXPLANATION CARD */
    .explanation-card {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      font-size: 0.85rem;
      line-height: 1.45;
      animation: fadeIn 0.3s ease;
    }
    .btn-next, .btn-finish-action {
      width: 100%;
      padding: 0.9rem;
      background: var(--primary);
      color: #ffffff;
      border: none;
      border-radius: 1rem;
      font-size: 1rem;
      font-weight: 800;
      cursor: pointer;
      margin-top: 0.85rem;
      transition: background 0.2s, opacity 0.2s;
    }
    .btn-next:hover, .btn-finish-action:hover { opacity: 0.9; }

    /* FINISH SCREEN & CERTIFICATE */
    .finish-screen {
      text-align: center;
      padding: 1.5rem 0.5rem;
    }
    .trophy-icon { font-size: 4rem; margin-bottom: 0.5rem; display: inline-block; animation: bounce 1s infinite alternate; }
    @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }

    .certificate-card {
      background: #ffffff;
      border: 3px double #d4af37;
      border-radius: 1.5rem;
      padding: 1.5rem;
      margin: 1.25rem 0;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
    }

    /* CONFETTI CANVAS */
    #confettiCanvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 50;
    }

    /* WORTSPEICHER DRAWER */
    .vocab-drawer {
      position: absolute;
      top: 0;
      right: -100%;
      width: 85%;
      max-width: 380px;
      height: 100%;
      background: #ffffff;
      box-shadow: -10px 0 30px rgba(0,0,0,0.15);
      z-index: 60;
      transition: right 0.3s ease;
      display: flex;
      flex-direction: column;
    }
    .vocab-drawer.open { right: 0; }
    .vocab-header {
      background: var(--primary);
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 800;
    }
    .vocab-content {
      padding: 1rem;
      overflow-y: auto;
      flex: 1;
      font-size: 0.85rem;
    }
    .vocab-item {
      padding: 0.6rem;
      margin-bottom: 0.5rem;
      border-radius: 0.5rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body>

  <div class="game-container">
    <canvas id="confettiCanvas"></canvas>

    <!-- TOP STATUS BAR -->
    <div class="top-bar">
      <div style="display:flex; align-items:center; gap:0.5rem; min-width:0;">
        <span style="font-size:1.4rem;">${gameStoryTheme === 'detective' ? '🔍' : gameStoryTheme === 'space' ? '🚀' : gameStoryTheme === 'alchemy' ? '🧪' : '🎓'}</span>
        <div style="min-width:0;">
          <div class="badge-pill">${escapeHtml(subject)} • Kl. ${grade}</div>
          <div style="font-size:0.75rem; font-weight:800; opacity:0.9; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${escapeHtml(topic)}
          </div>
        </div>
      </div>

      <div class="header-icons">
        <button class="btn-icon" onclick="openVocabDrawer()" title="Fach-Wortspeicher öffnen">📖</button>
        <button class="btn-icon" id="soundBtn" onclick="toggleSound()" title="Sound an/aus">🔊</button>
      </div>
    </div>

    <!-- PROGRESS BAR -->
    <div class="progress-track">
      <div class="progress-fill" id="progressBar"></div>
    </div>

    <!-- PLAY AREA -->
    <div class="game-content" id="playArea">
      <!-- Dynamic Game Mode Content Injected by Script -->
    </div>

    <!-- WORTSPEICHER DRAWER -->
    <div class="vocab-drawer" id="vocabDrawer">
      <div class="vocab-header">
        <span>📖 Fach-Wortspeicher</span>
        <button onclick="closeVocabDrawer()" style="background:none; border:none; color:white; font-size:1.2rem; cursor:pointer;">✕</button>
      </div>
      <div class="vocab-content" id="vocabList"></div>
    </div>
  </div>

  <script>
    // --- GAME DATA ---
    const QUESTIONS = ${safeQuestionsJson};
    const VOCABULARY = ${safeVocabJson};
    const ORDER_ITEMS = ${safeOrderJson};
    const ESCAPE_CODE = "${safeEscapeCode}";
    const GAME_MODE = "${gameMode}";
    const SOCIAL_MODE = "${gameSocialMode}";
    const STORY_THEME = "${gameStoryTheme}";

    let currentIndex = 0;
    let score = 0;
    let soundEnabled = true;
    let p1Score = 0;
    let p2Score = 0;
    let unlockedDigitsCount = 0;

    // --- WEB AUDIO API SYNTHESIZER ---
    let audioCtx = null;
    function getAudioContext() {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch(e) {}
    }

    function playCorrectSound() {
      // Triad Chime
      playTone(523.25, 'triangle', 0.12, 0.12);
      setTimeout(() => playTone(659.25, 'triangle', 0.12, 0.12), 80);
      setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.15), 160);
    }

    function playWrongSound() {
      playTone(220, 'sawtooth', 0.18, 0.08);
      setTimeout(() => playTone(196, 'sawtooth', 0.25, 0.08), 120);
    }

    function playVictorySound() {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((n, i) => {
        setTimeout(() => playTone(n, 'triangle', 0.35, 0.15), i * 140);
      });
    }

    function playClick() {
      playTone(800, 'sine', 0.05, 0.05);
    }

    function toggleSound() {
      soundEnabled = !soundEnabled;
      document.getElementById('soundBtn').textContent = soundEnabled ? '🔊' : '🔇';
    }

    // --- SPEECH SYNTHESIS (VORLESEFUNKTION) ---
    function speakText(txt) {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(txt);
      u.lang = 'de-DE';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }

    // --- RENDER DISPATCHER ---
    function initGame() {
      if (GAME_MODE === 'memory') {
        initMemoryMode();
      } else if (GAME_MODE === 'order') {
        initOrderMode();
      } else {
        initQuizMode();
      }
    }

    // ==========================================
    // 1. QUIZ & DUELL & ESCAPE MODE
    // ==========================================
    function initQuizMode() {
      renderQuizQuestion();
    }

    function renderQuizQuestion() {
      const container = document.getElementById('playArea');
      if (currentIndex >= QUESTIONS.length) {
        showFinishScreen();
        return;
      }

      const q = QUESTIONS[currentIndex];
      const progressPercent = (currentIndex / QUESTIONS.length) * 100;
      document.getElementById('progressBar').style.width = progressPercent + '%';

      let html = '';

      // ESCAPE GAME SAFE DISPLAY
      if (SOCIAL_MODE === 'escape') {
        const digits = ESCAPE_CODE.split('');
        html += '<div class="escape-safe-box">';
        html += '  <div class="safe-title">🔐 KLASSENZIMMER-TRESOR (Kombination knacken)</div>';
        html += '  <div class="safe-digits">';
        digits.forEach((d, idx) => {
          const isUnlocked = idx < unlockedDigitsCount;
          html += '<div class="safe-digit ' + (isUnlocked ? 'unlocked' : '') + '">' + (isUnlocked ? d : '🔒') + '</div>';
        });
        html += '  </div>';
        html += '</div>';
      }

      // DUELL SCORE BAR
      if (SOCIAL_MODE === 'duell') {
        html += '<div class="duell-score-bar">';
        html += '  <span class="p1-score">🔴 Spieler 1: ' + p1Score + ' P.</span>';
        html += '  <span style="color:#64748b; font-size:0.75rem;">SCHNELLIGKEITS-DUELL</span>';
        html += '  <span class="p2-score">🔵 Spieler 2: ' + p2Score + ' P.</span>';
        html += '</div>';
      }

      // QUESTION PROMPT
      html += '<div class="question-prompt" id="questionText">' + escapeText(q.question) + '</div>';

      // OPTIONS LIST (OR DUELL 2-PLAYER SPLIT)
      if (SOCIAL_MODE === 'duell') {
        html += '<div class="duell-players-container">';
        // PLAYER 1 (RED)
        html += '  <div class="duell-player-col p1">';
        html += '    <div class="player-header-label" style="color:var(--p1-color);">🔴 Spieler 1</div>';
        q.options.forEach((opt, oIdx) => {
          html += '    <button class="option-button" onclick="handleDuellAnswer(1, ' + oIdx + ', this)">';
          html += '      <span>' + escapeText(opt) + '</span>';
          html += '    </button>';
        });
        html += '  </div>';

        // PLAYER 2 (BLUE)
        html += '  <div class="duell-player-col p2">';
        html += '    <div class="player-header-label" style="color:var(--p2-color);">🔵 Spieler 2</div>';
        q.options.forEach((opt, oIdx) => {
          html += '    <button class="option-button" onclick="handleDuellAnswer(2, ' + oIdx + ', this)">';
          html += '      <span>' + escapeText(opt) + '</span>';
          html += '    </button>';
        });
        html += '  </div>';
        html += '</div>';
      } else {
        // SOLO / ESCAPE OPTIONS
        html += '<div class="options-stack">';
        q.options.forEach((opt, oIdx) => {
          html += '<button class="option-button" onclick="handleQuizAnswer(' + oIdx + ', this)">';
          html += '  <span>' + escapeText(opt) + '</span>';
          html += '  <span style="font-size:0.75rem; color:#94a3b8; font-weight:800;">#' + (oIdx + 1) + '</span>';
          html += '</button>';
        });
        html += '</div>';
      }

      html += '<div id="feedbackContainer"></div>';
      container.innerHTML = html;
    }

    function handleQuizAnswer(selectedIndex, btnElement) {
      const q = QUESTIONS[currentIndex];
      const allButtons = document.querySelectorAll('.option-button');
      allButtons.forEach(b => b.disabled = true);

      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) {
        btnElement.classList.add('correct');
        playCorrectSound();
        score++;
        if (SOCIAL_MODE === 'escape' && unlockedDigitsCount < ESCAPE_CODE.length) {
          unlockedDigitsCount++;
        }
      } else {
        btnElement.classList.add('wrong');
        allButtons[q.correctIndex].classList.add('correct');
        playWrongSound();
      }

      const fb = document.getElementById('feedbackContainer');
      fb.innerHTML = 
        '<div class="explanation-card">' +
        '  <strong style="color:' + (isCorrect ? 'var(--correct)' : 'var(--wrong)') + ';">' +
             (isCorrect ? '✓ Ausgezeichnet gelöst!' : '✗ Denkfalle erkannt!') +
        '  </strong>' +
        '  <p style="margin-top:0.4rem;">' + escapeText(q.explanation) + '</p>' +
        '  <button class="btn-next" onclick="nextQuizQuestion()">Weiter zur nächsten Aufgabe ➔</button>' +
        '</div>';
    }

    function handleDuellAnswer(playerNum, selectedIndex, btnElement) {
      const q = QUESTIONS[currentIndex];
      const allButtons = document.querySelectorAll('.option-button');
      allButtons.forEach(b => b.disabled = true);

      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) {
        btnElement.classList.add('correct');
        playCorrectSound();
        if (playerNum === 1) p1Score++;
        else p2Score++;
      } else {
        btnElement.classList.add('wrong');
        playWrongSound();
        // Point goes to opposing player
        if (playerNum === 1) p2Score++;
        else p1Score++;
      }

      const fb = document.getElementById('feedbackContainer');
      fb.innerHTML = 
        '<div class="explanation-card" style="text-align:center;">' +
        '  <strong>' + (isCorrect ? 'Punkt für Spieler ' + playerNum + '!' : 'Fehler! Punkt für Spieler ' + (playerNum === 1 ? 2 : 1) + '!') + '</strong>' +
        '  <p style="margin-top:0.3rem;">' + escapeText(q.explanation) + '</p>' +
        '  <button class="btn-next" onclick="nextQuizQuestion()">Nächste Runde ➔</button>' +
        '</div>';
    }

    function nextQuizQuestion() {
      currentIndex++;
      renderQuizQuestion();
    }

    // ==========================================
    // 2. MEMORY PAIRS MODE
    // ==========================================
    let memoryCards = [];
    let flippedCards = [];
    let matchedCount = 0;

    function initMemoryMode() {
      // Build pairs from VOCABULARY or fallback
      let pairs = VOCABULARY.slice(0, 6);
      if (pairs.length < 3) {
        pairs = [
          { term: 'AFB I', explanation: 'Reproduktion von Basiswissen' },
          { term: 'AFB II', explanation: 'Reorganisation und Transfer' },
          { term: 'AFB III', explanation: 'Reflexion und eigenständiges Urteil' },
          { term: 'ThILLM', explanation: 'Thüringer Institut für Lehrerfortbildung' }
        ];
      }

      memoryCards = [];
      pairs.forEach((p, idx) => {
        memoryCards.push({ id: idx + '-term', matchId: idx, text: p.term, type: 'term' });
        memoryCards.push({ id: idx + '-exp', matchId: idx, text: p.explanation, type: 'exp' });
      });

      // Shuffle
      memoryCards.sort(() => Math.random() - 0.5);
      renderMemoryBoard();
    }

    function renderMemoryBoard() {
      const container = document.getElementById('playArea');
      let html = '<div style="text-align:center; margin-bottom:1rem;">';
      html += '  <h3 style="font-weight:800; font-size:1.1rem;">🃏 Fachbegriff-Memory</h3>';
      html += '  <p style="font-size:0.8rem; color:#64748b;">Finde zusammengehörige Paare aus Begriff und Erklärung!</p>';
      html += '</div>';

      html += '<div class="memory-grid">';
      memoryCards.forEach((c, idx) => {
        html += '<div class="memory-card back" id="memCard-' + idx + '" onclick="flipMemoryCard(' + idx + ')">';
        html += '  <span>?</span>';
        html += '</div>';
      });
      html += '</div>';

      container.innerHTML = html;
    }

    function flipMemoryCard(idx) {
      const cardEl = document.getElementById('memCard-' + idx);
      const cardData = memoryCards[idx];

      if (flippedCards.length >= 2 || cardEl.classList.contains('matched') || flippedCards.some(f => f.idx === idx)) {
        return;
      }

      // Flip open
      cardEl.classList.remove('back');
      cardEl.textContent = cardData.text;
      cardEl.style.fontSize = cardData.text.length > 20 ? '0.7rem' : '0.85rem';
      playTone(440, 'sine', 0.08, 0.05);

      flippedCards.push({ idx, data: cardData, el: cardEl });

      if (flippedCards.length === 2) {
        checkMemoryMatch();
      }
    }

    function checkMemoryMatch() {
      const [c1, c2] = flippedCards;
      if (c1.data.matchId === c2.data.matchId) {
        // Matched!
        playCorrectSound();
        c1.el.classList.add('matched');
        c2.el.classList.add('matched');
        matchedCount += 2;
        flippedCards = [];

        if (matchedCount >= memoryCards.length) {
          setTimeout(showFinishScreen, 600);
        }
      } else {
        playWrongSound();
        setTimeout(() => {
          c1.el.classList.add('back');
          c1.el.textContent = '?';
          c2.el.classList.add('back');
          c2.el.textContent = '?';
          flippedCards = [];
        }, 900);
      }
    }

    // ==========================================
    // 3. ORDER / CHRONOLOGY MODE
    // ==========================================
    let currentOrderList = [];

    function initOrderMode() {
      currentOrderList = [...ORDER_ITEMS].map((item, idx) => ({ text: item, originalIndex: idx }));
      // Shuffle initially
      currentOrderList.sort(() => Math.random() - 0.5);
      renderOrderMode();
    }

    function renderOrderMode() {
      const container = document.getElementById('playArea');
      let html = '<div style="text-align:center; margin-bottom:1rem;">';
      html += '  <h3 style="font-weight:800; font-size:1.1rem;">⏳ Chronologie & Ablauf sortieren</h3>';
      html += '  <p style="font-size:0.8rem; color:#64748b;">Bringe die Schritte in die richtige didaktische Reihenfolge!</p>';
      html += '</div>';

      html += '<div class="order-list">';
      currentOrderList.forEach((item, idx) => {
        html += '<div class="order-item" id="orderItem-' + idx + '">';
        html += '  <div style="display:flex; align-items:center; gap:0.5rem;">';
        html += '    <span style="font-size:0.75rem; color:#94a3b8; font-weight:800; width:1.5rem;">#' + (idx + 1) + '</span>';
        html += '    <span>' + escapeText(item.text) + '</span>';
        html += '  </div>';
        html += '  <div class="order-actions">';
        if (idx > 0) {
          html += '    <button class="order-btn" onclick="moveOrderItem(' + idx + ', -1)">▲</button>';
        }
        if (idx < currentOrderList.length - 1) {
          html += '    <button class="order-btn" onclick="moveOrderItem(' + idx + ', 1)">▼</button>';
        }
        html += '  </div>';
        html += '</div>';
      });
      html += '</div>';

      html += '<button class="btn-next" onclick="checkOrderResult()">Reihenfolge jetzt überprüfen ✓</button>';
      html += '<div id="orderFeedback"></div>';
      container.innerHTML = html;
    }

    function moveOrderItem(fromIdx, direction) {
      const toIdx = fromIdx + direction;
      const temp = currentOrderList[fromIdx];
      currentOrderList[fromIdx] = currentOrderList[toIdx];
      currentOrderList[toIdx] = temp;
      playClick();
      renderOrderMode();
    }

    function checkOrderResult() {
      let allCorrect = true;
      currentOrderList.forEach((item, idx) => {
        const el = document.getElementById('orderItem-' + idx);
        if (item.originalIndex === idx) {
          el.classList.add('correct-pos');
        } else {
          el.classList.remove('correct-pos');
          allCorrect = false;
        }
      });

      const fb = document.getElementById('orderFeedback');
      if (allCorrect) {
        playCorrectSound();
        fb.innerHTML = '<div class="explanation-card" style="text-align:center; background:#f0fdf4; border-color:#86efac; color:#166534; font-weight:bold;">' +
          '🎉 Perfekt! Alle Schritte sind in der richtigen logischen Reihenfolge!' +
          '</div>';
        setTimeout(showFinishScreen, 1200);
      } else {
        playWrongSound();
        fb.innerHTML = '<div class="explanation-card" style="text-align:center; background:#fef2f2; border-color:#fca5a5; color:#991b1b; font-weight:bold;">' +
          'Noch nicht ganz richtig. Grün markierte Schritte sitzen bereits an der richtigen Stelle.' +
          '</div>';
      }
    }

    // ==========================================
    // 4. FINISH SCREEN & CERTIFICATE
    // ==========================================
    function showFinishScreen() {
      playVictorySound();
      launchConfetti();
      document.getElementById('progressBar').style.width = '100%';

      const container = document.getElementById('playArea');
      let html = '<div class="finish-screen">';
      html += '  <div class="trophy-icon">🏆</div>';
      html += '  <h2 style="font-size:1.6rem; font-weight:900;">HERZLICHEN GLÜCKWUNSCH!</h2>';

      if (SOCIAL_MODE === 'escape') {
        html += '  <div style="background:#064e3b; color:#34d399; border:2px solid #10b981; border-radius:1rem; padding:1.25rem; margin:1rem 0;">';
        html += '    <div style="font-size:0.8rem; font-weight:bold; letter-spacing:0.1em; color:#a7f3d0;">TRESOR ERFOLGREICH GEÖFFNET!</div>';
        html += '    <div style="font-size:2.4rem; font-weight:900; letter-spacing:0.3em; margin:0.5rem 0; font-family:monospace;">' + ESCAPE_CODE + '</div>';
        html += '    <div style="font-size:0.75rem; color:#d1fae5;">Zeige diesen Code deiner Lehrkraft für die Klassenzimmer-Schatztruhe!</div>';
        html += '  </div>';
      } else if (SOCIAL_MODE === 'duell') {
        const winner = p1Score > p2Score ? '🔴 Spieler 1' : p2Score > p1Score ? '🔵 Spieler 2' : 'Unentschieden!';
        html += '  <div style="background:#f1f5f9; border-radius:1rem; padding:1rem; margin:1rem 0; font-size:1.2rem; font-weight:800;">';
        html += '    Sieger des Duells: ' + winner + '<br>';
        html += '    <span style="font-size:0.9rem; color:#64748b;">(Spieler 1: ' + p1Score + ' P. | Spieler 2: ' + p2Score + ' P.)</span>';
        html += '  </div>';
      }

      // PRINTABLE CERTIFICATE
      html += '  <div class="certificate-card">';
      html += '    <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:#b45309; letter-spacing:0.1em;">EHRENURKUNDE</div>';
      html += '    <div style="font-size:1.15rem; font-weight:900; margin:0.4rem 0;">Staatliche Regelschule Heimbürgeschule Kahla</div>';
      html += '    <p style="font-size:0.85rem; color:#475569;">Hat die interaktive Lerneinheit zum Thema</p>';
      html += '    <div style="font-size:1rem; font-weight:800; color:var(--primary); margin:0.4rem 0;">' + escapeText("${escapeHtml(topic)}") + '</div>';
      html += '    <p style="font-size:0.85rem; color:#475569;">im Fach ' + escapeText("${escapeHtml(subject)}") + ' (Klassenstufe ${grade}) erfolgreich gemeistert!</p>';
      html += '    <div style="margin-top:1rem;">';
      html += '      <input type="text" id="pupilNameInput" placeholder="Name der Schülerin / des Schülers..." style="text-align:center; font-weight:bold; font-size:1rem; padding:0.5rem 1rem; border:1px solid #cbd5e1; border-radius:0.75rem; width:80%; max-width:300px;">';
      html += '    </div>';
      html += '  </div>';

      html += '  <div style="display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap;">';
      html += '    <button class="btn-finish-action" style="width:auto; padding:0.7rem 1.5rem;" onclick="window.print()">🖨️ Urkunde drucken</button>';
      html += '    <button class="btn-finish-action" style="width:auto; padding:0.7rem 1.5rem; background:#64748b;" onclick="location.reload()">🔄 Nochmal spielen</button>';
      html += '  </div>';
      html += '</div>';

      container.innerHTML = html;
    }

    // --- WORTSPEICHER DRAWER ---
    function openVocabDrawer() {
      const list = document.getElementById('vocabList');
      list.innerHTML = '';
      VOCABULARY.forEach(v => {
        const item = document.createElement('div');
        item.className = 'vocab-item';
        item.innerHTML = '<strong style="color:var(--primary);">' + escapeText(v.term) + ':</strong> ' + escapeText(v.explanation);
        list.appendChild(item);
      });
      document.getElementById('vocabDrawer').classList.add('open');
    }

    function closeVocabDrawer() {
      document.getElementById('vocabDrawer').classList.remove('open');
    }

    // --- 100% INLINE CONFETTI ---
    function launchConfetti() {
      const canvas = document.getElementById('confettiCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;

      const pieces = [];
      const colors = ['#006185', '#10b981', '#f59e0b', '#e67e22', '#3b82f6', '#ec4899'];

      for (let i = 0; i < 90; i++) {
        pieces.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.8) * 14,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 10
        });
      }

      let frame = 0;
      function animate() {
        if (frame > 90) { ctx.clearRect(0,0,canvas.width,canvas.height); return; }
        ctx.clearRect(0,0,canvas.width,canvas.height);
        pieces.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35;
          p.rotation += p.vRot;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
          ctx.restore();
        });
        frame++;
        requestAnimationFrame(animate);
      }
      animate();
    }

    function escapeText(str) {
      const p = document.createElement('p');
      p.textContent = str;
      return p.innerHTML;
    }

    // Start Game
    initGame();
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function generateMoodleGiftExport(questions: QuizQuestion[], title: string): string {
  let gift = `// GIFT Format fuer Thueringer Schulcloud (TSC) / Moodle\n`;
  gift += `// Erstellt mit dem KI-Unterrichts-Baukasten (Thueringer Regelschule)\n`;
  gift += `// Thema: ${title}\n\n`;

  (questions || []).forEach((q, idx) => {
    gift += `::Aufgabe ${idx + 1} - ${q.afbLevel ? 'AFB ' + q.afbLevel : 'Regelschule'}:: ${q.question} {\n`;
    (q.options || []).forEach((opt, oIdx) => {
      if (oIdx === q.correctIndex) {
        gift += `  =${opt} # ${q.explanation || 'Richtig!'}\n`;
      } else {
        gift += `  ~${opt}\n`;
      }
    });
    gift += `}\n\n`;
  });

  return gift;
}
