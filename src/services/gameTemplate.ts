export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  afbLevel?: 'I' | 'II' | 'III';
}

export function buildSelfContainedGameHtml({
  title,
  subject,
  grade,
  topic,
  questions,
  inclusionMode = false,
  vocabulary = []
}: {
  title: string;
  subject: string;
  grade: number;
  topic: string;
  questions: QuizQuestion[];
  inclusionMode?: boolean;
  vocabulary?: { term: string; explanation: string }[];
}): string {
  const safeQuestionsJson = JSON.stringify(questions);
  const safeVocabJson = JSON.stringify(vocabulary);

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(title)} - Interaktive Lernspiel-Werkstatt</title>
  <style>
    :root {
      --primary: #006185;
      --primary-dark: #004561;
      --primary-light: #e1f3fa;
      --secondary: #006b5f;
      --secondary-light: #e0f7f4;
      --accent: #e67e22;
      --bg: #f0f4f9;
      --card-bg: #ffffff;
      --text: #091d2e;
      --text-muted: #536471;
      --border: #dbe4ee;
      --correct: #10b981;
      --wrong: #ef4444;
      --font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

    body {
      background: linear-gradient(135deg, #eaf2fb 0%, #f7f9ff 100%);
      color: var(--text);
      font-family: var(--font-family);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem 0.75rem;
    }

    .game-container {
      width: 100%;
      max-width: 680px;
      background: var(--card-bg);
      border-radius: 1.5rem;
      border: 1px solid var(--border);
      box-shadow: 0 20px 40px -10px rgba(0, 97, 133, 0.16), 0 2px 10px rgba(0,0,0,0.04);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* TOP STATUS BAR */
    .top-bar {
      background: linear-gradient(135deg, #006185 0%, #0b7ba7 100%);
      color: #ffffff;
      padding: 1rem 1.25rem;
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
      gap: 0.4rem;
    }

    .stats-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .xp-pill {
      background: #ffdcbd;
      color: #854d00;
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 900;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .xp-pill.bump {
      transform: scale(1.25);
    }

    .streak-badge {
      background: #ef4444;
      color: white;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      display: none;
      animation: pulse 1s infinite alternate;
    }

    .sound-toggle-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: background 0.2s;
    }
    .sound-toggle-btn:hover { background: rgba(255,255,255,0.3); }

    /* PROGRESS BAR */
    .progress-track {
      background: #e2e8f0;
      height: 6px;
      width: 100%;
      position: relative;
    }
    .progress-fill {
      background: linear-gradient(90deg, #00A896 0%, #10b981 100%);
      height: 100%;
      width: 0%;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* PLAY AREA */
    .game-content {
      padding: 1.5rem 1.25rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;
    }

    .afb-level-indicator {
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.2rem 0.6rem;
      border-radius: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .afb-i { background: #ecfdf5; color: #065f46; border: 1px solid #10b981; }
    .afb-ii { background: #fffbeb; color: #92400e; border: 1px solid #f59e0b; }
    .afb-iii { background: #fef2f2; color: #991b1b; border: 1px solid #ef4444; }

    .action-icons-group {
      display: flex;
      gap: 0.4rem;
    }

    .tool-btn {
      background: #e1f3fa;
      border: 1px solid #bce1f3;
      color: #006185;
      border-radius: 0.6rem;
      padding: 0.35rem 0.65rem;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      transition: all 0.2s;
    }
    .tool-btn:hover {
      background: #006185;
      color: #ffffff;
      border-color: #006185;
    }

    .question-prompt {
      font-size: 1.25rem;
      font-weight: 800;
      line-height: 1.4;
      color: #0f172a;
      margin-bottom: 1.25rem;
    }

    /* OPTIONS LIST */
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
      gap: 0.85rem;
      transition: all 0.15s ease-out;
      position: relative;
    }

    .option-button:hover:not(:disabled) {
      border-color: var(--primary);
      background: #f8fbff;
      transform: translateY(-2px);
      border-bottom-width: 5px;
    }

    .option-button:active:not(:disabled) {
      transform: translateY(2px);
      border-bottom-width: 2px;
    }

    .option-badge {
      width: 2rem;
      height: 2rem;
      border-radius: 0.6rem;
      background: #f1f5f9;
      color: #475569;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.85rem;
      flex-shrink: 0;
      transition: all 0.2s;
    }

    .option-button.is-correct {
      border-color: var(--correct) !important;
      background: #ecfdf5 !important;
      color: #065f46 !important;
      border-bottom-width: 4px !important;
    }
    .option-button.is-correct .option-badge {
      background: var(--correct);
      color: #ffffff;
    }

    .option-button.is-wrong {
      border-color: var(--wrong) !important;
      background: #fef2f2 !important;
      color: #991b1b !important;
      border-bottom-width: 4px !important;
    }
    .option-button.is-wrong .option-badge {
      background: var(--wrong);
      color: #ffffff;
    }

    /* FEEDBACK POPUP BANNER */
    .feedback-card {
      display: none;
      padding: 1rem 1.25rem;
      border-radius: 1rem;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-top: 0.5rem;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .feedback-card.correct {
      display: block;
      background: #ecfdf5;
      border: 1.5px solid #10b981;
      color: #065f46;
    }
    .feedback-card.wrong {
      display: block;
      background: #fef2f2;
      border: 1.5px solid #ef4444;
      color: #991b1b;
    }

    .next-stage-btn {
      display: none;
      margin-top: 1rem;
      width: 100%;
      background: linear-gradient(135deg, var(--primary) 0%, #0b7ba7 100%);
      color: #ffffff;
      border: none;
      border-bottom: 4px solid var(--primary-dark);
      border-radius: 1rem;
      padding: 0.95rem;
      font-size: 1.05rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.15s;
    }
    .next-stage-btn:hover {
      filter: brightness(1.08);
      transform: translateY(-2px);
    }
    .next-stage-btn:active {
      transform: translateY(2px);
      border-bottom-width: 1px;
    }

    /* GLOSSAR / WORTSPEICHER DRAWER */
    .vocab-drawer {
      display: none;
      position: absolute;
      inset: 0;
      background: #ffffff;
      z-index: 30;
      flex-direction: column;
      padding: 1.5rem;
      animation: fadeIn 0.2s ease-out;
    }
    .vocab-drawer.open {
      display: flex;
    }
    .vocab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1.5px solid #e2e8f0;
    }
    .vocab-list {
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .vocab-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.85rem;
      padding: 0.85rem 1rem;
    }

    /* CERTIFICATE / VICTORY VIEW */
    .victory-view {
      display: none;
      text-align: center;
      padding: 2.5rem 1.5rem;
    }

    .trophy-glow {
      width: 90px;
      height: 90px;
      margin: 0 auto 1.25rem;
      background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      box-shadow: 0 10px 30px rgba(255, 140, 0, 0.4);
      animation: bounceTrophy 1s ease infinite alternate;
    }

    .cert-frame {
      border: 3px double var(--primary);
      border-radius: 1.25rem;
      background: #fbfdff;
      padding: 1.75rem 1.25rem;
      margin: 1.5rem 0;
      box-shadow: 0 4px 16px rgba(0,0,0,0.04);
      position: relative;
    }

    .cert-seal {
      font-size: 0.8rem;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--primary);
      letter-spacing: 0.06em;
      margin-bottom: 0.5rem;
    }

    .pupil-input {
      border: 1.5px solid var(--border);
      border-radius: 0.6rem;
      padding: 0.5rem 0.75rem;
      font-size: 1rem;
      text-align: center;
      font-weight: 700;
      color: var(--primary);
      width: 80%;
      max-width: 320px;
      margin: 0.5rem 0;
      outline: none;
    }
    .pupil-input:focus { border-color: var(--primary); }

    .btn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
      margin-top: 1.25rem;
    }

    .game-action-btn {
      padding: 0.85rem 1.5rem;
      border-radius: 0.85rem;
      font-size: 0.95rem;
      font-weight: 800;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-secondary { background: #e2e8f0; color: #1e293b; }
    .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
    .btn-secondary:hover { background: #cbd5e1; }

    #confettiCanvas {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none;
      z-index: 50;
    }

    @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.08); } }
    @keyframes bounceTrophy { from { transform: translateY(0); } to { transform: translateY(-8px); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    @media print {
      body { background: white; padding: 0; }
      .top-bar, .btn-row, .sound-toggle-btn { display: none !important; }
      .game-container { box-shadow: none; border: none; max-width: 100%; }
      .cert-frame { border: 2px solid #000; }
    }
  </style>
</head>
<body>

  <div class="game-container">
    <canvas id="confettiCanvas"></canvas>

    <!-- TOP BAR -->
    <header class="top-bar">
      <div>
        <span class="badge-pill">${escapeHtml(subject)} • Klasse ${grade}</span>
        <div style="font-size:0.95rem; font-weight:800; margin-top:0.25rem; opacity:0.95;">
          ${escapeHtml(topic)}
        </div>
      </div>

      <div class="stats-group">
        <div class="streak-badge" id="streakBadge">🔥 3er Streak!</div>
        <div class="xp-pill" id="xpPill">⭐ 0 XP</div>
        <button class="sound-toggle-btn" id="soundBtn" onclick="toggleAudio()" title="Ton ein/aus">🔊</button>
      </div>
    </header>

    <!-- PROGRESS BAR -->
    <div class="progress-track">
      <div class="progress-fill" id="progressFill"></div>
    </div>

    <!-- MAIN GAME SCREEN -->
    <main class="game-content" id="questionScreen">
      <div class="question-header">
        <span class="afb-level-indicator afb-i" id="afbBadge">AFB I • Basis</span>
        
        <div class="action-icons-group">
          ${vocabulary.length > 0 ? `
            <button class="tool-btn" onclick="openVocabDrawer()">
              📖 Wortspeicher (${vocabulary.length})
            </button>
          ` : ''}
          <button class="tool-btn" id="speakBtn" onclick="speakCurrentQuestion()">
            🗣️ Vorlesen
          </button>
        </div>
      </div>

      <h2 class="question-prompt" id="questionText">Frage lädt...</h2>

      <div class="options-stack" id="optionsGrid"></div>

      <div class="feedback-card" id="feedbackBox"></div>

      <button class="next-stage-btn" id="continueBtn" onclick="proceedToNextQuestion()">
        Weiter zur nächsten Aufgabe ➔
      </button>
    </main>

    <!-- WORTSPEICHER DRAWER (FÖRDERMODUS & DaZ) -->
    <div class="vocab-drawer" id="vocabDrawer">
      <div class="vocab-header">
        <h3 style="font-weight:800; font-size:1.1rem; color:var(--primary);">📖 Fach-Wortspeicher (Einfache Sprache)</h3>
        <button class="tool-btn" onclick="closeVocabDrawer()">✕ Schließen</button>
      </div>
      <div class="vocab-list" id="vocabList"></div>
    </div>

    <!-- VICTORY & DIGITALES EHREN-ZERTIFIKAT -->
    <div class="victory-view" id="victoryScreen">
      <div class="trophy-glow">🏆</div>
      <h2 style="font-size:1.6rem; font-weight:900; color:var(--primary); margin-bottom:0.25rem;">
        Ausgezeichnete Leistung!
      </h2>
      <p style="color:var(--text-muted); font-size:0.9rem;">
        Du hast die Lerneinheit erfolgreich und meisterhaft abgeschlossen.
      </p>

      <div class="cert-frame">
        <div class="cert-seal">Staatliche Regelschule Heimbürgeschule Kahla</div>
        <h3 style="font-size:1.3rem; font-weight:900; color:#0f172a; margin:0.3rem 0;">
          DIGITALES EHREN-ZERTIFIKAT
        </h3>
        <p style="font-size:0.85rem; color:#64748b;">Ausgestellt für Schüler/in:</p>
        
        <input type="text" class="pupil-input" id="pupilNameInput" placeholder="Dein Vor- und Nachname..." value="Erfolgreiche/r Schüler/in">
        
        <div style="font-size:1.5rem; font-weight:900; color:var(--secondary); margin:0.6rem 0;" id="finalXpText">
          ⭐ 100 XP ERREICHT
        </div>

        <div style="font-size:0.85rem; color:#475569; line-height:1.5;">
          Fach: <strong>${escapeHtml(subject)}</strong> • Klassenstufe: <strong>${grade}</strong><br>
          Thema: <em>${escapeHtml(topic)}</em>
        </div>

        <div style="margin-top:0.85rem; font-size:0.75rem; color:#94a3b8; border-top:1px dashed #cbd5e1; padding-top:0.5rem;" id="certDateText">
          Datum: heute
        </div>
      </div>

      <div class="btn-row">
        <button class="game-action-btn btn-primary" onclick="window.print()">
          🖨️ Zertifikat drucken / PDF
        </button>
        <button class="game-action-btn btn-secondary" onclick="restartChallenge()">
          🔄 Nochmal spielen
        </button>
      </div>
    </div>

  </div>

  <script>
    // 100% INLINE WEB AUDIO API SYNTHESIZER (ZERO EXTERNAL MP3s)
    const SoundBox = {
      enabled: true,
      ctx: null,
      getAudioContext() {
        if (!this.ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC) this.ctx = new AC();
        }
        return this.ctx;
      },
      beep(freq, duration, type = 'sine', gainVal = 0.12, delay = 0) {
        if (!this.enabled) return;
        setTimeout(() => {
          try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume();
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
          } catch(e){}
        }, delay);
      },
      playSuccess() {
        // Arpeggiated Major chord: C5, E5, G5, C6
        this.beep(523.25, 0.15, 'sine', 0.14, 0);
        this.beep(659.25, 0.15, 'sine', 0.14, 90);
        this.beep(783.99, 0.18, 'sine', 0.15, 180);
        this.beep(1046.50, 0.35, 'triangle', 0.18, 270);
      },
      playStreak() {
        this.beep(587.33, 0.12, 'triangle', 0.15, 0);
        this.beep(880.00, 0.14, 'triangle', 0.16, 80);
        this.beep(1174.66, 0.3, 'sine', 0.2, 160);
      },
      playWrong() {
        this.beep(240, 0.15, 'sawtooth', 0.12, 0);
        this.beep(190, 0.25, 'sawtooth', 0.14, 120);
      },
      playFanfare() {
        this.beep(523.25, 0.2, 'triangle', 0.2, 0);
        this.beep(659.25, 0.2, 'triangle', 0.2, 150);
        this.beep(783.99, 0.2, 'triangle', 0.2, 300);
        this.beep(1046.50, 0.6, 'triangle', 0.25, 450);
      }
    };

    function toggleAudio() {
      SoundBox.enabled = !SoundBox.enabled;
      document.getElementById('soundBtn').innerText = SoundBox.enabled ? '🔊' : '🔇';
    }

    // GAME STATE
    const QUESTIONS = ${safeQuestionsJson};
    const VOCABULARY = ${safeVocabJson};

    let currentIndex = 0;
    let xp = 0;
    let streakCount = 0;
    let isAnswered = false;

    function renderActiveQuestion() {
      isAnswered = false;
      const q = QUESTIONS[currentIndex];
      if (!q) { showFinalVictory(); return; }

      const progressPercent = (currentIndex / QUESTIONS.length) * 100;
      document.getElementById('progressFill').style.width = progressPercent + '%';

      // AFB Badge
      const afbEl = document.getElementById('afbBadge');
      const lvl = q.afbLevel || 'I';
      afbEl.innerText = 'AFB ' + lvl + ' • ' + (lvl === 'I' ? 'Basiswissen' : lvl === 'II' ? 'Transfer' : 'Reflexion');
      afbEl.className = 'afb-level-indicator afb-' + lvl.toLowerCase();

      document.getElementById('questionText').innerText = q.question;

      const fb = document.getElementById('feedbackBox');
      fb.className = 'feedback-card';
      fb.style.display = 'none';
      document.getElementById('continueBtn').style.display = 'none';

      const grid = document.getElementById('optionsGrid');
      grid.innerHTML = '';

      const letters = ['A', 'B', 'C', 'D', 'E'];
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-button';
        btn.innerHTML = '<span class="option-badge">' + letters[idx] + '</span> <span>' + escapeText(opt) + '</span>';
        btn.onclick = () => handleChoice(idx, btn);
        grid.appendChild(btn);
      });
    }

    function handleChoice(selectedIdx, btnEl) {
      if (isAnswered) return;
      isAnswered = true;
      const q = QUESTIONS[currentIndex];

      const allBtns = document.querySelectorAll('.option-button');
      allBtns.forEach(b => b.disabled = true);

      const fb = document.getElementById('feedbackBox');
      const isRight = selectedIdx === q.correctIndex;

      if (isRight) {
        btnEl.classList.add('is-correct');
        streakCount++;
        
        let earned = 25;
        if (streakCount >= 3) {
          earned = 40;
          SoundBox.playStreak();
          const sBadge = document.getElementById('streakBadge');
          sBadge.innerText = '🔥 ' + streakCount + 'er Streak!';
          sBadge.style.display = 'inline-block';
        } else {
          SoundBox.playSuccess();
        }

        xp += earned;
        triggerXpBump();

        fb.className = 'feedback-card correct';
        fb.innerHTML = '<strong>✨ Fantastisch! Richtig gelöst.</strong><br>' + 
          (q.explanation ? escapeText(q.explanation) : 'Ausgezeichnet verstanden!');
      } else {
        btnEl.classList.add('is-wrong');
        streakCount = 0;
        document.getElementById('streakBadge').style.display = 'none';
        SoundBox.playWrong();

        if (allBtns[q.correctIndex]) {
          allBtns[q.correctIndex].classList.add('is-correct');
        }

        fb.className = 'feedback-card wrong';
        fb.innerHTML = '<strong>💡 Guter Versuch!</strong><br>' + 
          (q.explanation ? escapeText(q.explanation) : 'Die grün markierte Antwort ist fachlich korrekt.');
      }

      document.getElementById('continueBtn').style.display = 'block';
    }

    function triggerXpBump() {
      const pill = document.getElementById('xpPill');
      pill.innerText = '⭐ ' + xp + ' XP';
      pill.classList.add('bump');
      setTimeout(() => pill.classList.remove('bump'), 250);
    }

    function proceedToNextQuestion() {
      currentIndex++;
      if (currentIndex < QUESTIONS.length) {
        renderActiveQuestion();
      } else {
        showFinalVictory();
      }
    }

    function showFinalVictory() {
      document.getElementById('progressFill').style.width = '100%';
      document.getElementById('questionScreen').style.display = 'none';
      document.getElementById('victoryScreen').style.display = 'block';
      document.getElementById('finalXpText').innerText = '⭐ ' + xp + ' XP ERREICHT';
      document.getElementById('certDateText').innerText = 'Ausgestellt am ' + new Date().toLocaleDateString('de-DE');
      
      SoundBox.playFanfare();
      launchConfetti();
    }

    function restartChallenge() {
      currentIndex = 0;
      xp = 0;
      streakCount = 0;
      document.getElementById('streakBadge').style.display = 'none';
      document.getElementById('xpPill').innerText = '⭐ 0 XP';
      document.getElementById('victoryScreen').style.display = 'none';
      document.getElementById('questionScreen').style.display = 'flex';
      renderActiveQuestion();
    }

    // SPEECH SYNTHESIS (VORLESEN)
    function speakCurrentQuestion() {
      if (!('speechSynthesis' in window)) {
        alert('Dein Browser unterstützt keine Sprachausgabe.');
        return;
      }
      window.speechSynthesis.cancel();
      const q = QUESTIONS[currentIndex];
      if (!q) return;

      const txt = q.question + '. Antworten: ' + q.options.join(', ');
      const utt = new SpeechSynthesisUtterance(txt);
      utt.lang = 'de-DE';
      utt.rate = 0.92;
      window.speechSynthesis.speak(utt);
    }

    // WORTSPEICHER DRAWER
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

    // 100% INLINE CONFETTI CANNON (NO EXTERNAL NETWORK REQUESTS)
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
          p.vy += 0.35; // gravity
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

    // Init
    renderActiveQuestion();
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function generateMoodleGiftExport(questions: QuizQuestion[], title: string): string {
  let gift = `// GIFT Format fuer Thueringer Schulcloud (TSC) / Moodle\n`;
  gift += `// Erstellt mit dem KI-Unterrichts-Baukasten (Thueringer Regelschule)\n`;
  gift += `// Thema: ${title}\n\n`;

  questions.forEach((q, idx) => {
    gift += `::Aufgabe ${idx + 1} - ${q.afbLevel ? 'AFB ' + q.afbLevel : 'Regelschule'}:: ${q.question} {\n`;
    q.options.forEach((opt, oIdx) => {
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
