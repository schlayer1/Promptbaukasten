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
  inclusionMode = false
}: {
  title: string;
  subject: string;
  grade: number;
  topic: string;
  questions: QuizQuestion[];
  inclusionMode?: boolean;
}): string {
  const safeQuestionsJson = JSON.stringify(questions);

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Lernspiel</title>
  <style>
    :root {
      --primary: #006185;
      --primary-dark: #004c6a;
      --secondary: #006b5f;
      --accent: #e67e22;
      --bg: #f7f9ff;
      --card: #ffffff;
      --text: #091d2e;
      --muted: #4a5568;
      --border: #d1e4fb;
      --correct: #10b981;
      --wrong: #ef4444;
      --font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-family);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem 1rem;
    }
    .game-wrapper {
      width: 100%;
      max-width: 680px;
      background: var(--card);
      border-radius: 1.25rem;
      border: 1px solid var(--border);
      box-shadow: 0 10px 30px -5px rgba(0, 97, 133, 0.12);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    header.game-header {
      background: linear-gradient(135deg, var(--primary) 0%, #0b7ba7 100%);
      color: #ffffff;
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .meta-tag {
      background: rgba(255,255,255,0.2);
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .stats-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-weight: 700;
      font-size: 0.95rem;
    }
    .progress-container {
      background: #e2e8f0;
      height: 8px;
      width: 100%;
    }
    .progress-fill {
      background: var(--secondary);
      height: 100%;
      width: 0%;
      transition: width 0.3s ease;
    }
    main.game-body {
      padding: 1.75rem 1.5rem;
      flex: 1;
    }
    .question-box {
      margin-bottom: 1.5rem;
      position: relative;
    }
    .question-title {
      font-size: 1.2rem;
      font-weight: 700;
      line-height: 1.4;
      color: var(--text);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
    }
    .speak-btn {
      background: #e3efff;
      border: 1px solid #006185;
      color: #006185;
      border-radius: 0.5rem;
      padding: 0.35rem 0.6rem;
      font-size: 0.85rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-weight: 600;
      transition: all 0.2s;
    }
    .speak-btn:hover {
      background: #006185;
      color: #fff;
    }
    .options-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
      margin-top: 1.25rem;
    }
    .option-card {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 0.85rem;
      padding: 1rem 1.15rem;
      text-align: left;
      font-size: 1rem;
      font-weight: 500;
      color: #1e293b;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .option-card:hover:not(:disabled) {
      border-color: var(--primary);
      background: #f0f7ff;
      transform: translateY(-2px);
    }
    .option-letter {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      color: #475569;
      flex-shrink: 0;
    }
    .option-card.correct {
      border-color: var(--correct) !important;
      background: #ecfdf5 !important;
      color: #065f46 !important;
    }
    .option-card.correct .option-letter {
      background: var(--correct);
      color: #fff;
    }
    .option-card.wrong {
      border-color: var(--wrong) !important;
      background: #fef2f2 !important;
      color: #991b1b !important;
    }
    .option-card.wrong .option-letter {
      background: var(--wrong);
      color: #fff;
    }
    .feedback-banner {
      margin-top: 1.25rem;
      padding: 1rem 1.25rem;
      border-radius: 0.75rem;
      font-size: 0.95rem;
      line-height: 1.4;
      display: none;
      animation: fadeIn 0.3s ease;
    }
    .feedback-banner.correct {
      display: block;
      background: #ecfdf5;
      border: 1px solid #10b981;
      color: #065f46;
    }
    .feedback-banner.wrong {
      display: block;
      background: #fef2f2;
      border: 1px solid #ef4444;
      color: #991b1b;
    }
    .next-btn {
      display: none;
      margin-top: 1.25rem;
      width: 100%;
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: 0.75rem;
      padding: 0.85rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }
    .next-btn:hover {
      background: var(--primary-dark);
    }
    /* CERTIFICATE SCREEN */
    .certificate-view {
      display: none;
      text-align: center;
      padding: 2rem 1.5rem;
    }
    .certificate-badge {
      width: 80px;
      height: 80px;
      margin: 0 auto 1rem;
      background: #ffdcbd;
      border: 4px solid var(--accent);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.2rem;
    }
    .certificate-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }
    .certificate-box {
      border: 2px dashed #006185;
      border-radius: 1rem;
      background: #edf4ff;
      padding: 1.5rem;
      margin: 1.5rem 0;
      font-size: 1.05rem;
      line-height: 1.6;
    }
    .restart-btn {
      background: var(--secondary);
      color: #fff;
      border: none;
      border-radius: 0.75rem;
      padding: 0.85rem 1.5rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body>

  <div class="game-wrapper">
    <header class="game-header">
      <div>
        <span class="meta-tag">${escapeHtml(subject)} • Klasse ${grade}</span>
        <h1 style="font-size:1.1rem; font-weight:700; margin-top:0.25rem;">${escapeHtml(topic)}</h1>
      </div>
      <div class="stats-bar">
        <span id="starCounter">⭐ 0 XP</span>
        <span id="questionStep">1 / 1</span>
      </div>
    </header>

    <div class="progress-container">
      <div class="progress-fill" id="progressBar"></div>
    </div>

    <main class="game-body" id="playArea">
      <div class="question-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <span style="font-size:0.85rem; font-weight:700; color:var(--primary);" id="afbBadge">AFB-STUFE I</span>
          <button class="speak-btn" id="readBtn" onclick="speakCurrentQuestion()">🔊 Vorlesen</button>
        </div>
        <div class="question-title" id="questionText">Frage lädt...</div>
      </div>

      <div class="options-grid" id="optionsContainer"></div>

      <div class="feedback-banner" id="feedbackBanner"></div>

      <button class="next-btn" id="nextBtn" onclick="nextQuestion()">Nächste Aufgabe ➔</button>
    </main>

    <!-- ZERTIFIKAT -->
    <div class="certificate-view" id="certArea">
      <div class="certificate-badge">🏆</div>
      <h2 class="certificate-title">Klasse gemacht!</h2>
      <p style="color:var(--muted);">Du hast die Lerneinheit erfolgreich gemeistert.</p>

      <div class="certificate-box">
        <p><strong>Auszeichnung für Regelschüler/in:</strong></p>
        <p style="font-size:1.25rem; font-weight:800; color:var(--primary); margin:0.5rem 0;" id="finalScoreText">100 / 100 Punkte</p>
        <p>Thema: <em>${escapeHtml(topic)}</em> (${escapeHtml(subject)}, Kl. ${grade})</p>
        <p style="font-size:0.85rem; color:#64748b; margin-top:0.75rem;" id="certDate"></p>
      </div>

      <button class="restart-btn" onclick="restartGame()">🔄 Nochmal spielen</button>
    </div>
  </div>

  <script>
    // Audio Synthesizer via Web Audio API (keine externen MP3s noetig)
    const AudioEngine = {
      ctx: null,
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.ctx = new AudioContext();
        }
      },
      playTone(freq, type, duration, delay = 0) {
        this.init();
        if (!this.ctx) return;
        setTimeout(() => {
          try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
          } catch(e){}
        }, delay);
      },
      correct() {
        this.playTone(523.25, 'sine', 0.15, 0);   // C5
        this.playTone(659.25, 'sine', 0.2, 120);  // E5
        this.playTone(783.99, 'sine', 0.35, 240); // G5
      },
      wrong() {
        this.playTone(260, 'sawtooth', 0.18, 0);
        this.playTone(220, 'sawtooth', 0.25, 150);
      },
      fanfare() {
        this.playTone(440, 'triangle', 0.15, 0);
        this.playTone(554, 'triangle', 0.15, 120);
        this.playTone(659, 'triangle', 0.2, 240);
        this.playTone(880, 'triangle', 0.45, 380);
      }
    };

    const QUESTIONS = ${safeQuestionsJson};
    let currentIndex = 0;
    let score = 0;
    let answered = false;

    function renderQuestion() {
      answered = false;
      const q = QUESTIONS[currentIndex];
      if (!q) { showCertificate(); return; }

      document.getElementById('questionStep').innerText = (currentIndex + 1) + ' / ' + QUESTIONS.length;
      document.getElementById('progressBar').style.width = ((currentIndex) / QUESTIONS.length * 100) + '%';
      document.getElementById('afbBadge').innerText = q.afbLevel ? ('AFB-STUFE ' + q.afbLevel) : 'LERNFRAGE';
      document.getElementById('questionText').innerText = q.question;

      const fb = document.getElementById('feedbackBanner');
      fb.className = 'feedback-banner';
      fb.style.display = 'none';
      document.getElementById('nextBtn').style.display = 'none';

      const container = document.getElementById('optionsContainer');
      container.innerHTML = '';

      const letters = ['A', 'B', 'C', 'D', 'E'];
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-card';
        btn.innerHTML = '<span class="option-letter">' + letters[idx] + '</span> <span>' + escapeText(opt) + '</span>';
        btn.onclick = () => selectOption(idx, btn);
        container.appendChild(btn);
      });
    }

    function selectOption(selectedIndex, btnElement) {
      if (answered) return;
      answered = true;
      const q = QUESTIONS[currentIndex];
      const allBtns = document.querySelectorAll('.option-card');
      allBtns.forEach(b => b.disabled = true);

      const fb = document.getElementById('feedbackBanner');

      if (selectedIndex === q.correctIndex) {
        btnElement.classList.add('correct');
        AudioEngine.correct();
        score += 25;
        document.getElementById('starCounter').innerText = '⭐ ' + score + ' XP';
        fb.className = 'feedback-banner correct';
        fb.innerHTML = '<strong>Hervorragend! Richtig geloest.</strong><br>' + escapeText(q.explanation || 'Sehr gute fachliche Leistung!');
      } else {
        btnElement.classList.add('wrong');
        AudioEngine.wrong();
        if (allBtns[q.correctIndex]) {
          allBtns[q.correctIndex].classList.add('correct');
        }
        fb.className = 'feedback-banner wrong';
        fb.innerHTML = '<strong>Nicht ganz richtig.</strong><br>' + escapeText(q.explanation || 'Die markierte gruene Antwort ist die korrekte Loesung.');
      }

      document.getElementById('nextBtn').style.display = 'block';
    }

    function nextQuestion() {
      currentIndex++;
      if (currentIndex < QUESTIONS.length) {
        renderQuestion();
      } else {
        showCertificate();
      }
    }

    function showCertificate() {
      document.getElementById('progressBar').style.width = '100%';
      document.getElementById('playArea').style.display = 'none';
      document.getElementById('certArea').style.display = 'block';
      document.getElementById('finalScoreText').innerText = score + ' XP erreicht';
      document.getElementById('certDate').innerText = 'Ausgestellt am ' + new Date().toLocaleDateString('de-DE');
      AudioEngine.fanfare();
    }

    function restartGame() {
      currentIndex = 0;
      score = 0;
      document.getElementById('starCounter').innerText = '⭐ 0 XP';
      document.getElementById('certArea').style.display = 'none';
      document.getElementById('playArea').style.display = 'block';
      renderQuestion();
    }

    function speakCurrentQuestion() {
      if (!('speechSynthesis' in window)) {
        alert('Dein Browser unterstuetzt keine Sprachausgabe.');
        return;
      }
      window.speechSynthesis.cancel();
      const q = QUESTIONS[currentIndex];
      if (!q) return;

      const text = q.question + '. Optionen: ' + q.options.join(', ');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    function escapeText(str) {
      const p = document.createElement('p');
      p.textContent = str;
      return p.innerHTML;
    }

    // Auto-Start
    renderQuestion();
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
