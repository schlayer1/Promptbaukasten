export interface StationFlashcard {
  front: string;
  back: string;
}

export interface StationClozeItem {
  id: string;
  options: string[];
  correctIndex: number;
}

export interface StationAfbTask {
  level: 'I' | 'II' | 'III';
  title: string;
  taskText: string;
  hintText: string;
  targetAudience?: string;
}

export interface StationSpecialItem {
  title: string;
  icon?: string;
  periodOrCategory?: string;
  description: string;
}

export interface StationQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BuildStationOptions {
  title: string;
  subject: string;
  grade: number;
  topic: string;
  goals?: string[];
  knowledgeHtml?: string;
  inclusionTips?: { term: string; explanation: string }[];
  flashcards?: StationFlashcard[];
  clozeHtml?: string; // Text with embedded dropdown markers or standard markup
  clozeWithWordBank?: boolean; // Ob ein Wortspeicher über dem Lückentext angezeigt werden soll
  clozeAnswers?: { id: string; correct: string }[];
  afbTasks?: StationAfbTask[];
  specialModuleTitle?: string;
  specialItems?: StationSpecialItem[];
  quizQuestions?: StationQuizQuestion[];
  reflectionChecklist?: string[];
  researchRecommendations?: string[];
}

export function buildSelfContainedStationHtml(opts: BuildStationOptions): string {
  const {
    title,
    subject,
    grade,
    topic,
    goals = [
      'Ich verstehe die wichtigsten Grundbegriffe und Zusammenhänge.',
      'Ich kann die zentralen Abläufe und Rollen sachgerecht erklären.',
      'Ich kann mein Wissen auf neue Aufgaben und Fragestellungen anwenden.'
    ],
    knowledgeHtml = '',
    inclusionTips = [],
    flashcards = [],
    clozeHtml = '',
    clozeWithWordBank = true,
    afbTasks = [],
    specialModuleTitle = 'Quellen- & Entdecker-Station',
    specialItems = [],
    quizQuestions = [],
    reflectionChecklist = [
      'Ich habe alle Stationen dieser Lerneinheit aufmerksam bearbeitet.',
      'Ich kenne die wichtigsten Fachbegriffe und kann sie erklären.',
      'Ich kann die Aufgaben auf meinem Niveau selbstständig lösen.'
    ],
    researchRecommendations = [
      `${topic} einfach erklärt`,
      `${topic} Zusammenfassung ${subject}`
    ]
  } = opts;

  // Anti-A-Bias: Shuffle quiz question options so Option A is never systematically the correct answer
  const sanitizedQuizQuestions = (quizQuestions || []).map(q => {
    if (!q.options || q.options.length <= 1) return q;
    const correctVal = q.options[q.correctIndex] ?? q.options[0];
    const shuffled = [...q.options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const newIdx = shuffled.indexOf(correctVal);
    return {
      ...q,
      options: shuffled,
      correctIndex: newIdx !== -1 ? newIdx : 0
    };
  });

  // Extract unique correct words from clozeHtml for word bank display
  let wordBankHtml = '';
  if (clozeWithWordBank && clozeHtml) {
    const matches = [...clozeHtml.matchAll(/data-correct="([^"]+)"/g)];
    const uniqueWords = Array.from(new Set(matches.map(m => m[1]))).sort(() => 0.5 - Math.random());
    if (uniqueWords.length > 0) {
      wordBankHtml = `
        <div class="cloze-wordbank" style="background:#f8fafc; border:1.5px dashed #94a3b8; border-radius:0.75rem; padding:0.75rem 1rem; margin-bottom:1.25rem;">
          <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:#475569; letter-spacing:0.05em; margin-bottom:0.4rem; display:flex; align-items:center; gap:0.4rem;">
            <span>💡</span> Wortspeicher (Einsetzbare Begriffe als Formulierungshilfe):
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
            ${uniqueWords.map(w => `<span style="display:inline-block; background:#ffffff; border:1px solid #cbd5e1; color:#0f172a; padding:0.25rem 0.65rem; border-radius:0.5rem; font-size:0.8rem; font-weight:700; box-shadow:0 1px 2px rgba(0,0,0,0.04);">${escapeHtml(w)}</span>`).join('')}
          </div>
        </div>
      `;
    }
  }

  const safeGoalsJson = JSON.stringify(goals);
  const safeFlashcardsJson = JSON.stringify(flashcards);
  const safeQuizJson = JSON.stringify(sanitizedQuizQuestions);

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(title)} - Digitale Lernstation</title>
  <style>
    :root {
      --primary: #006185;
      --primary-dark: #004561;
      --primary-light: #e1f3fa;
      --primary-surface: #f0f7fb;
      --secondary: #006b5f;
      --accent: #d97706;
      --bg: #f8fafc;
      --card: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --correct: #16a34a;
      --correct-bg: #dcfce7;
      --wrong: #dc2626;
      --wrong-bg: #fee2e2;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05);
      --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04);
      --radius: 1rem;
      --font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font);
      line-height: 1.6;
      padding-bottom: 5rem;
    }

    /* TOP HEADER */
    .station-header {
      background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
      color: white;
      padding: 2.25rem 1.25rem 2rem;
      box-shadow: var(--shadow-md);
      position: relative;
    }
    .header-inner {
      max-width: 900px;
      margin: 0 auto;
    }
    .badge-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .badge {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .school-tag {
      font-size: 0.8rem;
      opacity: 0.9;
      font-weight: 600;
    }
    .station-title {
      font-size: 1.85rem;
      font-weight: 900;
      line-height: 1.25;
      margin-bottom: 0.4rem;
    }
    .station-subtitle {
      font-size: 0.95rem;
      opacity: 0.92;
      max-width: 700px;
    }

    /* CONTAINER & SECTIONS */
    .main-container {
      max-width: 900px;
      margin: -1.25rem auto 0;
      padding: 0 1rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      position: relative;
      z-index: 10;
    }

    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
    }
    .card-title {
      font-size: 1.15rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary-dark);
    }
    .step-number {
      width: 1.85rem;
      height: 1.85rem;
      border-radius: 0.5rem;
      background: var(--primary-light);
      color: var(--primary-dark);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 900;
    }

    /* 1. LERNZIELE CHECKLIST */
    .goals-list {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
    .goal-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: var(--primary-surface);
      border: 1px solid var(--primary-light);
      border-radius: 0.75rem;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
    }
    .goal-item:hover { background: #e8f4fa; }
    .goal-checkbox {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 0.35rem;
      border: 2px solid var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: white;
      transition: all 0.2s;
    }
    .goal-item.completed .goal-checkbox {
      background: var(--correct);
      border-color: var(--correct);
      color: white;
    }
    .goal-item.completed span {
      text-decoration: line-through;
      color: var(--text-muted);
    }
    .goal-text { font-size: 0.9rem; font-weight: 600; }

    /* 2. WISSENSBEREICH & TIP BOXEN */
    .prose-text {
      font-size: 0.95rem;
      color: #334155;
      line-height: 1.7;
    }
    .prose-text h3 {
      font-size: 1.1rem;
      font-weight: 800;
      margin: 1.25rem 0 0.5rem;
      color: var(--primary-dark);
    }
    .prose-text p { margin-bottom: 0.85rem; }
    .prose-text ul { margin-left: 1.25rem; margin-bottom: 0.85rem; }
    .prose-text li { margin-bottom: 0.35rem; }

    .tip-box {
      background: #fefce8;
      border: 1px solid #fef08a;
      border-left: 4px solid #eab308;
      border-radius: 0.75rem;
      padding: 1rem;
      margin: 1rem 0;
      display: flex;
      gap: 0.75rem;
    }
    .tip-icon { font-size: 1.4rem; flex-shrink: 0; line-height: 1; }
    .tip-content strong { color: #854d0e; display: block; margin-bottom: 0.2rem; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .tip-content p { font-size: 0.9rem; color: #713f12; margin: 0; }

    /* 3. 3D FLASHCARDS */
    .flashcard-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .card-perspective {
      perspective: 1000px;
      width: 100%;
      max-width: 520px;
      height: 240px;
      cursor: pointer;
    }
    .card-flipper {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
    }
    .card-flipper.flipped {
      transform: rotateY(180deg);
    }
    .card-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 1.25rem;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      box-shadow: var(--shadow-md);
      border: 2px solid var(--border);
    }
    .card-front {
      background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
      color: var(--text);
    }
    .card-back {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      transform: rotateY(180deg);
    }
    .card-hint {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
      color: var(--text-muted);
      font-weight: 700;
    }
    .card-back .card-hint { color: rgba(255,255,255,0.7); }
    .card-content-text {
      font-size: 1.35rem;
      font-weight: 800;
      line-height: 1.35;
    }
    .card-back .card-content-text { font-size: 1.15rem; font-weight: 600; }
    .flashcard-nav {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .btn-nav {
      padding: 0.6rem 1.25rem;
      background: white;
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      transition: all 0.2s;
    }
    .btn-nav:hover { background: var(--primary-surface); border-color: var(--primary); color: var(--primary); }

    /* 4. CLOZE DROPDOWN TEST */
    .cloze-box {
      font-size: 1rem;
      line-height: 2.2;
      background: #fafafa;
      padding: 1.5rem;
      border-radius: 1rem;
      border: 1px solid var(--border);
    }
    .cloze-select {
      display: inline-block;
      font-size: 0.95rem;
      font-weight: 700;
      padding: 0.35rem 0.6rem;
      margin: 0 0.25rem;
      border: 2px solid var(--border);
      border-radius: 0.5rem;
      background: white;
      color: var(--text);
      cursor: pointer;
      outline: none;
      transition: all 0.2s;
    }
    .cloze-select.correct {
      border-color: var(--correct);
      background: var(--correct-bg);
      color: #14532d;
    }
    .cloze-select.wrong {
      border-color: var(--wrong);
      background: var(--wrong-bg);
      color: #7f1d1d;
    }
    .cloze-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1.25rem;
    }
    .btn-action {
      background: var(--primary);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      border: none;
      font-size: 0.9rem;
      font-weight: 800;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      transition: background 0.2s;
    }
    .btn-action:hover { background: var(--primary-dark); }
    .cloze-score { font-weight: 800; font-size: 0.95rem; }

    /* 5. AFB I - III TASKS */
    .tasks-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .task-card {
      border-radius: 0.75rem;
      border: 1px solid var(--border);
      padding: 1.25rem;
      background: #ffffff;
      position: relative;
    }
    .task-card.level-1 { border-left: 5px solid #10b981; }
    .task-card.level-2 { border-left: 5px solid #f59e0b; }
    .task-card.level-3 { border-left: 5px solid #ef4444; }
    .task-badge-pill {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.6rem;
      border-radius: 0.4rem;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .level-1 .task-badge-pill { background: #d1fae5; color: #065f46; }
    .level-2 .task-badge-pill { background: #fef3c7; color: #92400e; }
    .level-3 .task-badge-pill { background: #fee2e2; color: #991b1b; }
    .task-text { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.75rem; color: #1e293b; }
    details.task-hint {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 0.5rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;
    }
    details.task-hint summary {
      cursor: pointer;
      font-weight: 700;
      color: var(--primary);
    }
    details.task-hint p { margin-top: 0.5rem; color: #475569; }

    /* 6. SPECIAL MODULE (TIMELINE / DETECTIVE) */
    .timeline-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: relative;
    }
    .timeline-item {
      display: flex;
      gap: 1rem;
      background: #f8fafc;
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      padding: 1rem;
    }
    .timeline-icon-box {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 0.6rem;
      background: var(--primary-light);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      flex-shrink: 0;
    }
    .timeline-content h4 { font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 0.2rem; }
    .timeline-epoch { font-size: 0.75rem; font-weight: 700; color: var(--accent); text-transform: uppercase; margin-bottom: 0.35rem; }
    .timeline-content p { font-size: 0.85rem; color: #475569; }

    /* 7. MINI QUIZ */
    .quiz-question-box {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px dashed var(--border);
    }
    .quiz-question-box:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .quiz-q-title {
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }
    .quiz-options-grid {
      display: grid;
      grid-cols: 1;
      gap: 0.5rem;
    }
    @media (min-width: 640px) {
      .quiz-options-grid { grid-template-columns: 1fr 1fr; }
    }
    .quiz-opt-btn {
      padding: 0.75rem 1rem;
      background: white;
      border: 1.5px solid var(--border);
      border-radius: 0.65rem;
      text-align: left;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .quiz-opt-btn:hover:not(:disabled) {
      border-color: var(--primary);
      background: var(--primary-surface);
    }
    .quiz-opt-btn.correct {
      border-color: var(--correct);
      background: var(--correct-bg);
      color: #14532d;
    }
    .quiz-opt-btn.wrong {
      border-color: var(--wrong);
      background: var(--wrong-bg);
      color: #7f1d1d;
    }
    .quiz-fb {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.4rem 0.6rem;
      border-radius: 0.4rem;
    }

    /* 8. REFLECTION */
    .reflection-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.85rem;
      border-radius: 0.5rem;
      background: #f8fafc;
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .research-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: #fee2e2;
      color: #991b1b;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      margin-right: 0.5rem;
      margin-top: 0.5rem;
    }

    /* FOOTER BAR */
    .station-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    @media print {
      body { background: white !important; color: #000 !important; padding: 0 !important; font-size: 11pt; }
      .station-header { background: none; color: black; border-bottom: 2px solid #000; padding: 0.5rem 0 1rem 0; margin-bottom: 1.5rem; }
      .station-title { color: #000; font-size: 18pt; }
      .station-subtitle { color: #555; }
      .school-tag { border-color: #999; color: #333; }
      .badge { background: #eee !important; color: #000 !important; }
      .card { box-shadow: none !important; border: 1px solid #ccc; break-inside: avoid; page-break-inside: avoid; margin-bottom: 1.5rem; padding: 1.25rem !important; }
      .btn-nav, .btn-action, .flashcard-nav, .cloze-score, #quizScoreDisplay, .station-footer button { display: none !important; }
      .card-perspective { perspective: none; }
      .card-flipper { transform: none !important; }
      .card-front { border: 1px dashed #999; margin-bottom: 0.5rem; }
      .card-back { position: static; transform: none; border: 1px solid #ccc; margin-top: 0.5rem; }
      .card-hint { display: none; }
      details summary { display: none; }
      details p { display: block !important; margin-top: 0.5rem; color: #444; }
      .research-pill { border: 1px solid #ccc; background: none !important; color: #000 !important; }
      select.cloze-select { border: none !important; border-bottom: 1.5px solid #000 !important; border-radius: 0; background: none !important; color: #000 !important; -webkit-appearance: none; appearance: none; }
    }
  </style>
</head>
<body>

  <!-- 1. KOPFBEREICH -->
  <header class="station-header">
    <div class="header-inner">
      <div class="badge-bar">
        <span class="badge">${escapeHtml(subject)} • Kl. ${grade}</span>
        <span class="school-tag">Staatliche Regelschule Heimbürgeschule Kahla</span>
      </div>
      <h1 class="station-title">${escapeHtml(topic)}</h1>
      <p class="station-subtitle">Digitale Übungsstation • Interaktiver Lernbegleiter</p>
    </div>
  </header>

  <main class="main-container">

    <!-- 1. LERNZIELE CHECKLISTE -->
    <section class="card" id="sec-goals">
      <div class="card-header">
        <h2 class="card-title">
          <span class="step-number">1</span>
          <span>Lernziele dieser Station</span>
        </h2>
        <span id="goalsProgress" style="font-size:0.8rem; font-weight:800; color:var(--primary);">0/${goals.length} erreicht</span>
      </div>
      <div class="goals-list">
        ${goals.map((g, idx) => `
          <div class="goal-item" onclick="toggleGoal(this, ${idx})">
            <div class="goal-checkbox">✓</div>
            <span class="goal-text">${escapeHtml(g)}</span>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 2. WISSENSBEREICH -->
    <section class="card" id="sec-knowledge">
      <div class="card-header">
        <h2 class="card-title">
          <span class="step-number">2</span>
          <span>Wissen & Merkkästen</span>
        </h2>
        <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">Schritt 1: Aufmerksam lesen</span>
      </div>
      <div class="prose-text">
        ${knowledgeHtml || '<p>Wissensbereich wird geladen...</p>'}
      </div>

      ${inclusionTips.length > 0 ? `
        <div style="margin-top:1.5rem;">
          <h4 style="font-size:0.85rem; font-weight:800; text-transform:uppercase; color:#b45309; letter-spacing:0.05em; margin-bottom:0.6rem;">
            💡 Einfach erklärt (Schul-Wortspeicher & Inklusions-Hilfen):
          </h4>
          ${inclusionTips.map(tip => `
            <div class="tip-box">
              <span class="tip-icon">💡</span>
              <div class="tip-content">
                <strong>${escapeHtml(tip.term)}:</strong>
                <p>${escapeHtml(tip.explanation)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </section>

    <!-- 3. INTERAKTIVE 3D-LERNKARTEN -->
    ${flashcards.length > 0 ? `
      <section class="card" id="sec-flashcards">
        <div class="card-header">
          <h2 class="card-title">
            <span class="step-number">3</span>
            <span>3D-Lernkarten (Begriffe sichern)</span>
          </h2>
          <span id="cardCounter" style="font-size:0.8rem; font-weight:800; color:var(--primary);">Karte 1 von ${flashcards.length}</span>
        </div>

        <div class="flashcard-stage">
          <div class="card-perspective" onclick="flipActiveCard()">
            <div class="card-flipper" id="cardFlipper">
              <div class="card-face card-front">
                <span class="card-hint">Klicke zum Umdrehen ↻</span>
                <div class="card-content-text" id="cardFrontText">${escapeHtml(flashcards[0]?.front || '')}</div>
              </div>
              <div class="card-face card-back">
                <span class="card-hint">Erklärung / Antwort</span>
                <div class="card-content-text" id="cardBackText">${escapeHtml(flashcards[0]?.back || '')}</div>
              </div>
            </div>
          </div>

          <div class="flashcard-nav">
            <button class="btn-nav" onclick="prevCard()">◀ Vorherige</button>
            <button class="btn-nav" onclick="flipActiveCard()">Umdrehen ↻</button>
            <button class="btn-nav" onclick="nextCard()">Nächste ▶</button>
          </div>
        </div>
      </section>
    ` : ''}

    <!-- 4. INTERAKTIVER LÜCKENTEXT -->
    ${clozeHtml ? `
      <section class="card" id="sec-cloze">
        <div class="card-header">
          <h2 class="card-title">
            <span class="step-number">4</span>
            <span>Interaktiver Lückentext</span>
          </h2>
          <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">Wähle die richtigen Begriffe</span>
        </div>
        <div class="cloze-box" id="clozeContainer">
          ${wordBankHtml}
          ${clozeHtml}
        </div>
        <div class="cloze-footer">
          <button class="btn-action" onclick="checkClozeAnswers()">✓ Lückentext auswerten</button>
          <span class="cloze-score" id="clozeScoreDisplay"></span>
        </div>
      </section>
    ` : ''}

    <!-- 5. DIFFERENZIERTE AUFGABEN (3 NIVEAUS) -->
    ${afbTasks.length > 0 ? `
      <section class="card" id="sec-tasks">
        <div class="card-header">
          <h2 class="card-title">
            <span class="step-number">5</span>
            <span>Differenzierte Aufgaben (3 Niveaus)</span>
          </h2>
          <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">Thüringer Regelschule (AFB I–III)</span>
        </div>
        <div class="tasks-grid">
          ${afbTasks.map(t => `
            <div class="task-card level-${t.level === 'I' ? '1' : t.level === 'II' ? '2' : '3'}">
              <div class="task-badge-pill">
                ${t.level === 'I' ? 'Niveau Grün (Basis / AFB I)' : t.level === 'II' ? 'Niveau Gelb (Standard / AFB II)' : 'Niveau Rot (Transfer / AFB III)'}
                ${t.targetAudience ? ' • ' + escapeHtml(t.targetAudience) : ''}
              </div>
              <h3 style="font-size:1.05rem; font-weight:800; margin-bottom:0.35rem;">${escapeHtml(t.title)}</h3>
              <p class="task-text">${escapeHtml(t.taskText)}</p>
              ${t.hintText ? `
                <details class="task-hint">
                  <summary>💡 Lösungstipp / Denkhilfe einblenden</summary>
                  <p>${escapeHtml(t.hintText)}</p>
                </details>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- 6. FACH-SPEZIALMODUL (ZEITSTRAHL / DETEKTIV) -->
    ${specialItems.length > 0 ? `
      <section class="card" id="sec-special">
        <div class="card-header">
          <h2 class="card-title">
            <span class="step-number">6</span>
            <span>${escapeHtml(specialModuleTitle)}</span>
          </h2>
          <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">Forscher- & Entdeckerstation</span>
        </div>
        <div class="timeline-container">
          ${specialItems.map(item => `
            <div class="timeline-item">
              <div class="timeline-icon-box">${item.icon || '🔍'}</div>
              <div class="timeline-content">
                ${item.periodOrCategory ? `<div class="timeline-epoch">${escapeHtml(item.periodOrCategory)}</div>` : ''}
                <h4>${escapeHtml(item.title)}</h4>
                <p>${escapeHtml(item.description)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- 7. MINI CHECK-QUIZ -->
    ${quizQuestions.length > 0 ? `
      <section class="card" id="sec-quiz">
        <div class="card-header">
          <h2 class="card-title">
            <span class="step-number">7</span>
            <span>Wissens-Check (Quiz)</span>
          </h2>
          <span id="quizScoreDisplay" style="font-size:0.8rem; font-weight:800; color:var(--primary);">Punkte: 0 / ${quizQuestions.length}</span>
        </div>
        <div>
          ${quizQuestions.map((q, qIdx) => `
            <div class="quiz-question-box" id="quizBox-${qIdx}">
              <div class="quiz-q-title">${qIdx + 1}. ${escapeHtml(q.question)}</div>
              <div class="quiz-options-grid">
                ${q.options.map((opt, oIdx) => `
                  <button class="quiz-opt-btn" onclick="answerQuiz(${qIdx}, ${oIdx}, this)">
                    ${escapeHtml(opt)}
                  </button>
                `).join('')}
              </div>
              <div class="quiz-fb" id="quizFb-${qIdx}" style="display:none;"></div>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- 8. SELBSTEINSCHÄTZUNG & REFLEXION -->
    <section class="card" id="sec-reflection">
      <div class="card-header">
        <h2 class="card-title">
          <span class="step-number">8</span>
          <span>Selbsteinschätzung & Weiterforschen</span>
        </h2>
        <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">Reflexion</span>
      </div>
      <div>
        <h4 style="font-size:0.85rem; font-weight:800; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.75rem;">
          Was hast du heute gelernt? (Kreuze an):
        </h4>
        ${reflectionChecklist.map((r, idx) => `
          <label class="reflection-item" style="cursor:pointer;">
            <input type="checkbox" style="width:1.15rem; height:1.15rem; accent-color:var(--primary);">
            <span>${escapeHtml(r)}</span>
          </label>
        `).join('')}

        ${researchRecommendations.length > 0 ? `
          <div style="margin-top:1.25rem; padding-top:1rem; border-top:1px solid var(--border);">
            <h4 style="font-size:0.85rem; font-weight:800; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.4rem;">
              📺 Empfohlene Suchbegriffe für Videos & Referate:
            </h4>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
              ${researchRecommendations.map(rec => `
                <a 
                  href="https://www.youtube.com/results?search_query=${encodeURIComponent(rec)}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="research-pill"
                  title="Auf YouTube nach '${escapeHtml(rec)}' suchen"
                  style="text-decoration:none; cursor:pointer;"
                >
                  <span>▶</span>
                  <span>"${escapeHtml(rec)}"</span>
                  <span style="font-size:0.65rem; opacity:0.7;">↗</span>
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <div style="margin-top:1.5rem; text-align:center;">
        <button class="btn-action" onclick="window.print()" style="background:#475569;">
          🖨️ Lernstation als PDF speichern / drucken
        </button>
      </div>
    </section>

    <footer class="station-footer">
      Staatliche Regelschule Heimbürgeschule Kahla • Thüringer Lehrplan (ThILLM) • Differenzierte HTML5-Lernstation
    </footer>
  </main>

  <script>
    // --- STATE ---
    const FLASHCARDS = ${safeFlashcardsJson};
    const QUIZ = ${safeQuizJson};
    let currentCardIndex = 0;
    let quizScore = 0;
    let answeredQuestions = new Set();

    // --- AUDIO SYNTHESIZER ---
    let audioCtx = null;
    function playTone(freq, type = 'sine', duration = 0.15) {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch(e) {}
    }

    function playSuccess() {
      playTone(523.25, 'triangle', 0.1);
      setTimeout(() => playTone(659.25, 'triangle', 0.15), 80);
    }
    function playError() {
      playTone(220, 'sawtooth', 0.15);
    }

    // --- 1. LERNZIELE TOGGLE ---
    function toggleGoal(el, idx) {
      el.classList.toggle('completed');
      const all = document.querySelectorAll('.goal-item');
      const completed = document.querySelectorAll('.goal-item.completed');
      document.getElementById('goalsProgress').textContent = completed.length + '/' + all.length + ' erreicht';
      if (completed.length === all.length) playSuccess();
    }

    // --- 3. 3D FLASHCARDS ---
    function flipActiveCard() {
      const flipper = document.getElementById('cardFlipper');
      if (flipper) {
        flipper.classList.toggle('flipped');
        playTone(440, 'sine', 0.05);
      }
    }

    function updateCardView() {
      const flipper = document.getElementById('cardFlipper');
      if (flipper) flipper.classList.remove('flipped');
      if (FLASHCARDS.length > 0) {
        const c = FLASHCARDS[currentCardIndex];
        document.getElementById('cardFrontText').textContent = c.front;
        document.getElementById('cardBackText').textContent = c.back;
        document.getElementById('cardCounter').textContent = 'Karte ' + (currentCardIndex + 1) + ' von ' + FLASHCARDS.length;
      }
    }

    function nextCard() {
      if (FLASHCARDS.length === 0) return;
      currentCardIndex = (currentCardIndex + 1) % FLASHCARDS.length;
      updateCardView();
    }

    function prevCard() {
      if (FLASHCARDS.length === 0) return;
      currentCardIndex = (currentCardIndex - 1 + FLASHCARDS.length) % FLASHCARDS.length;
      updateCardView();
    }

    // --- 4. CLOZE TEST EVALUATION ---
    function checkClozeAnswers() {
      const selects = document.querySelectorAll('.cloze-select');
      let correct = 0;
      selects.forEach(s => {
        const expected = s.getAttribute('data-correct');
        const selected = s.value;
        if (expected && selected === expected) {
          s.classList.add('correct');
          s.classList.remove('wrong');
          correct++;
        } else {
          s.classList.add('wrong');
          s.classList.remove('correct');
        }
      });

      const display = document.getElementById('clozeScoreDisplay');
      if (display) {
        display.textContent = 'Ergebnis: ' + correct + ' von ' + selects.length + ' Lücken richtig!';
        display.style.color = correct === selects.length ? 'var(--correct)' : 'var(--accent)';
      }
      if (correct === selects.length) playSuccess();
      else playError();
    }

    // --- 7. QUIZ INTERACTION ---
    function answerQuiz(qIdx, oIdx, btn) {
      if (answeredQuestions.has(qIdx)) return;
      answeredQuestions.add(qIdx);

      const q = QUIZ[qIdx];
      const box = document.getElementById('quizBox-' + qIdx);
      const buttons = box.querySelectorAll('.quiz-opt-btn');
      buttons.forEach(b => b.disabled = true);

      const isCorrect = oIdx === q.correctIndex;
      if (isCorrect) {
        btn.classList.add('correct');
        quizScore++;
        playSuccess();
      } else {
        btn.classList.add('wrong');
        buttons[q.correctIndex].classList.add('correct');
        playError();
      }

      const fb = document.getElementById('quizFb-' + qIdx);
      if (fb) {
        fb.style.display = 'block';
        fb.style.background = isCorrect ? 'var(--correct-bg)' : 'var(--wrong-bg)';
        fb.style.color = isCorrect ? '#14532d' : '#7f1d1d';
        fb.textContent = (isCorrect ? '✓ Richtig! ' : '✗ Leider falsch. ') + (q.explanation || '');
      }

      document.getElementById('quizScoreDisplay').textContent = 'Punkte: ' + quizScore + ' / ' + QUIZ.length;
    }
  </script>
</body>
</html>`;
}

export function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

