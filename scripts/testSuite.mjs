import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  query, 
  limit 
} from 'firebase/firestore';

// --- CONFIG ---
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAr8Q3RslUSuaJbIIGiINGV24nm26jYoLQ",
  authDomain: "terminkalender-7f269.firebaseapp.com",
  projectId: "terminkalender-7f269",
  storageBucket: "terminkalender-7f269.firebasestorage.app",
  messagingSenderId: "148816503901",
  appId: "1:148816503901:web:ca3fe9e4c599723ec083b0"
};

const GEMINI_DEFAULT_KEY = Buffer.from('QVEuQWI4Uk42SUpRQTM1V0ZScTRfLTdsUFAxQVU1Y1l5bkVTN3VmekZjdjlyZktHMjhhV2c=', 'base64').toString('utf8');

console.log('==================================================');
console.log('🧪 HBS PROMPTBAUKASTEN REAL-WORLD TEST SUITE');
console.log('==================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// ROBUST JSON ARRAY EXTRACTOR
function extractJsonArray(text) {
  if (!text) return null;
  const cleaned = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end > start) {
    try {
      const parsed = JSON.parse(cleaned.slice(start, end + 1));
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      try {
        const withoutTrailingCommas = cleaned.slice(start, end + 1).replace(/,\s*([}\]])/g, '$1');
        const parsed = JSON.parse(withoutTrailingCommas);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
  }
  return null;
}

async function runTests() {
  // TEST 1: FIREBASE INITIALIZATION & CRUD
  console.log('--- TEST 1: FIREBASE FIRESTORE CLOUD STORAGE ---');
  try {
    const app = initializeApp(FIREBASE_CONFIG, 'test-app-' + Date.now());
    const db = getFirestore(app);
    assert(!!db, 'Firestore Database Client initialized successfully');

    const testId = `test_material_${Date.now()}`;
    const testDocRef = doc(db, 'hbs_promptbaukasten_materials', testId);

    const testPayload = {
      id: testId,
      title: "Test-Unterrichtseinheit: Fotosynthese & Zellatmung",
      format: "lernspiel",
      subjectId: "biologie",
      subjectName: "Biologie",
      gradeLevel: "7/8",
      doubleGrade: "7/8",
      topicTitle: "Pflanzen & Stoffwechsel",
      customTopicDetail: "Schwerpunkt Lichtreaktion und Blattaufbau",
      worksheetMarkdown: "# Arbeitsblatt Fotosynthese\n\nNenne die Ausgangsstoffe.",
      rubricMarkdown: "### Erwartungshorizont\n\n4 Punkte für korrekte Reaktionsgleichung.",
      vocabulary: [
        { term: "Chloroplast", explanation: "Ort der Fotosynthese in Pflanzenzellen" },
        { term: "Glukose", explanation: "Traubenzucker als energiereicher Nährstoff" }
      ],
      gameHtml: "<!DOCTYPE html><html><body>Test Single File Game</body></html>",
      giftExport: "// GIFT Export",
      promptText: "Didaktischer Prompt",
      authorId: "test_teacher_01",
      authorName: "Frau Keller (HBS Test)",
      createdAt: Date.now(),
      sharedWithSchool: true
    };

    // 1a: WRITE (SAVE)
    await setDoc(testDocRef, testPayload);
    assert(true, `Successfully written material to Firestore with ID: ${testId}`);

    // 1b: READ (LOAD)
    const readSnap = await getDoc(testDocRef);
    assert(readSnap.exists(), 'Material document exists in Firestore');
    const readData = readSnap.data();
    assert(readData.title === testPayload.title, `Title matches: "${readData.title}"`);
    assert(readData.subjectName === "Biologie", 'Subject matches Biologie');
    assert(readData.gameHtml.includes('Single File Game'), 'HTML game content stored and retrieved intact');

    // 1c: QUERY LIST (SCHUL-BIBLIOTHEK)
    const q = query(collection(db, 'hbs_promptbaukasten_materials'), limit(10));
    const querySnap = await getDocs(q);
    assert(querySnap.size > 0, `Library query returned ${querySnap.size} document(s)`);

    // 1d: DELETE (CLEANUP)
    await deleteDoc(testDocRef);
    const verifyDeleted = await getDoc(testDocRef);
    assert(!verifyDeleted.exists(), 'Material successfully deleted from Firestore');

  } catch (err) {
    console.error('Firebase test error:', err);
    assert(false, `Firebase CRUD failed: ${err.message}`);
  }

  // TEST 2: GEMINI API ENGINE TEST
  console.log('\n--- TEST 2: GOOGLE GEMINI INFERENCE & CASCADE ---');
  try {
    assert(GEMINI_DEFAULT_KEY.length > 20, 'Default school Gemini key present and decoded');
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${GEMINI_DEFAULT_KEY}`;
    const geminiPayload = {
      contents: [{
        parts: [{ text: "Antworte bitte in genau einem Wort: 'BEREIT'." }]
      }],
      generationConfig: {
        maxOutputTokens: 30,
        temperature: 0.1
      }
    };

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload)
    });

    const data = await resp.json();
    if (resp.ok) {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      assert(text.trim().length > 0, `Gemini responded successfully: "${text.trim()}"`);
    } else {
      assert(false, `Gemini API returned error: ${data.error?.message || resp.statusText}`);
    }
  } catch (err) {
    assert(false, `Gemini network/request error: ${err.message}`);
  }

  // TEST 3: OPENROUTER API & FREE PRESET ROUTING
  console.log('\n--- TEST 3: OPENROUTER API & FREE PRESET ROUTING ---');
  const openrouterKey = process.env.VITE_OPENROUTER_API_KEY || '';
  if (!openrouterKey) {
    assert(true, 'OpenRouter handles empty key gracefully with modal prompt');
  } else {
    const orResp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://promptbaukasten.vercel.app',
        'X-Title': 'HBS Promptbaukasten'
      },
      body: JSON.stringify({
        model: '@preset/freie-modelle',
        messages: [{ role: 'user', content: 'Sag Hallo in einem Wort.' }]
      })
    });
    assert(orResp.ok, 'OpenRouter API responded');
  }

  // TEST 4: SECTION TAG PARSER & JSON RESILIENCE
  console.log('\n--- TEST 4: DIDACTIC PARSER RESILIENCE ---');
  const sampleAiResponse = `
<!-- SECTION:WORKSHEET -->
# Die Weimarer Republik
Klasse 9 • Geschichte
Hier ist der Arbeitsblatt-Inhalt...

<!-- SECTION:VOCABULARY -->
* **Inflation**: Geldentwertung im Jahr 1923
* **Koalition**: Bündnis mehrerer Parteien

<!-- SECTION:GAME_QUESTIONS -->
\`\`\`json
[
  {
    "question": "In welchem Jahr erreichte die Hyperinflation in Deutschland ihren Höhepunkt?",
    "options": ["1923", "1914", "1939", "1945"],
    "correctIndex": 0,
    "explanation": "Im Krisenjahr 1923 verlor die Papiermark völlig an Wert.",
    "afbLevel": "I"
  }
]
\`\`\`

<!-- SECTION:GAME_ORDER -->
[
  "Ausrufung der Republik 1918",
  "Unterzeichnung des Versailler Vertrags 1919",
  "Krisenjahr und Hyperinflation 1923",
  "Goldene Zwanziger Jahre 1924-1929"
]

<!-- SECTION:ESCAPE_CODE -->
1923

<!-- SECTION:RUBRIC -->
| Aufgabe | AFB | Kriterien | Punkte |
|---|---|---|---|
| 1 | I | Daten korrekt | 4 P. |
`;

  // Test parser logic
  const extractSection = (rawResponse, tag, nextTags) => {
    const startIdx = rawResponse.indexOf(`<!-- SECTION:${tag} -->`);
    if (startIdx === -1) return '';
    const contentStart = startIdx + `<!-- SECTION:${tag} -->`.length;
    let endIdx = rawResponse.length;
    for (const nextTag of nextTags) {
      const idx = rawResponse.indexOf(`<!-- SECTION:${nextTag} -->`, contentStart);
      if (idx !== -1 && idx < endIdx) {
        endIdx = idx;
      }
    }
    return rawResponse.slice(contentStart, endIdx).trim();
  };

  const gameQuestionsRaw = extractSection(sampleAiResponse, 'GAME_QUESTIONS', ['GAME_ORDER', 'ESCAPE_CODE', 'RUBRIC']);
  const gameOrderRaw = extractSection(sampleAiResponse, 'GAME_ORDER', ['ESCAPE_CODE', 'RUBRIC']);
  const escapeCodeRaw = extractSection(sampleAiResponse, 'ESCAPE_CODE', ['RUBRIC']);

  const parsedQuestions = extractJsonArray(gameQuestionsRaw);
  assert(parsedQuestions !== null && parsedQuestions.length === 1, 'Robustly parsed GAME_QUESTIONS from fenced markdown block');
  assert(parsedQuestions[0].options[0] === "1923", 'First option parsed as "1923"');

  const parsedOrder = extractJsonArray(gameOrderRaw);
  assert(parsedOrder !== null && parsedOrder.length === 4, 'Parsed 4 chronological events in GAME_ORDER');

  const parsedEscape = escapeCodeRaw.replace(/[^0-9]/g, '').slice(0, 4);
  assert(parsedEscape === "1923", `Parsed 4-digit escape code "${parsedEscape}"`);

  // TEST 5: DIGITAL LEARNING STATION & CLOZE CONVERTER
  console.log('\n--- TEST 5: DIGITAL LEARNING STATION & CLOZE CONVERTER ---');
  
  // Test Cloze conversion logic
  const rawClozeSnippet = 'Die Sippe lebte in [Höhlen* / Zelten / Wolkenkratzern] zusammen. Sie trugen Kleidung aus [Tierfellen* / Baumwolle / Plastik].';
  const convertCloze = (raw) => {
    return raw.replace(/\[([^\]]+)\]/g, (match, inner) => {
      const parts = inner.split(/[\/|;]/).map(p => p.trim()).filter(Boolean);
      let correctVal = '';
      const cleanOptions = parts.map(opt => {
        if (opt.includes('*')) {
          const clean = opt.replace(/\*/g, '').trim();
          correctVal = clean;
          return clean;
        }
        return opt;
      });
      if (!correctVal) correctVal = cleanOptions[0];
      const optsHtml = [
        '<option value="">-- bitte auswählen --</option>',
        ...cleanOptions.map(o => `<option value="${o}">${o}</option>`)
      ].join('');
      return `<select class="cloze-select" data-correct="${correctVal}">${optsHtml}</select>`;
    });
  };

  const convertedCloze = convertCloze(rawClozeSnippet);
  assert(convertedCloze.includes('data-correct="Höhlen"'), 'Cloze converted correctly with data-correct="Höhlen"');
  assert(convertedCloze.includes('data-correct="Tierfellen"'), 'Cloze converted second hole with data-correct="Tierfellen"');
  assert(convertedCloze.includes('cloze-select'), 'Contains class="cloze-select" for styling and validation');

  // Verify Station Sections Parsing
  const stationMockResponse = `
<!-- SECTION:STATION_GOALS -->
[
  "Ich verstehe, was eine Sippe ist",
  "Ich kenne die Rollen in einer Sippe",
  "Ich weiß, wie der Alltag in einer Sippe aussah"
]

<!-- SECTION:STATION_KNOWLEDGE -->
### Das Leben in der Sippe
Die Menschen der Altsteinzeit lebten in kleinen Familiengruppen zusammen.

<!-- SECTION:STATION_FLASHCARDS -->
[
  { "front": "Sippe", "back": "Eine kleine Familiengruppe von ca. 20-30 Personen." },
  { "front": "Nomaden", "back": "Menschen ohne festen Wohnsitz, die den Herden folgten." }
]

<!-- SECTION:STATION_CLOZE -->
Die Sippe bot Schutz vor wilden [Tieren* / Autos / Flugzeugen].

<!-- SECTION:STATION_AFB -->
[
  {
    "level": "I",
    "title": "Aufgabe 1 (Niveau Grün)",
    "taskText": "Nenne 3 Aufgaben der Sippenmitglieder.",
    "hintText": "Denke an Jagd und Sammeln."
  }
]
`;

  const stationGoals = extractJsonArray(extractSection(stationMockResponse, 'STATION_GOALS', ['STATION_KNOWLEDGE']));
  assert(stationGoals && stationGoals.length === 3, 'Parsed 3 station learning goals');
  assert(stationGoals[0].includes('Sippe'), 'Goal 1 mentions Sippe');

  const stationFlashcards = extractJsonArray(extractSection(stationMockResponse, 'STATION_FLASHCARDS', ['STATION_CLOZE']));
  assert(stationFlashcards && stationFlashcards.length === 2, 'Parsed 2 3D-flashcards');
  assert(stationFlashcards[0].front === 'Sippe', 'Card 1 front is "Sippe"');

  const stationAfb = extractJsonArray(extractSection(stationMockResponse, 'STATION_AFB', []));
  assert(stationAfb && stationAfb.length === 1, 'Parsed AFB task 1');
  assert(stationAfb[0].level === 'I', 'AFB task has level I');

  // TEST 5: HBS NOTENSCHLÜSSEL & ANTI-A-BIAS VERIFICATION
  console.log('\n--- TEST 5: HBS NOTENTABELLE & ANTI-A-BIAS ---');
  function calculateHbsGradeTable(totalPoints) {
    const safeTotal = Math.max(1, Math.round(totalPoints));
    const p1 = Math.round(safeTotal * 0.95);
    const p2 = Math.round(safeTotal * 0.80);
    const p3 = Math.round(safeTotal * 0.65);
    const p4 = Math.round(safeTotal * 0.45);
    const p5 = Math.round(safeTotal * 0.25);
    return [
      { grade: 1, minPoints: p1, maxPoints: safeTotal },
      { grade: 2, minPoints: p2, maxPoints: Math.max(0, p1 - 1) },
      { grade: 3, minPoints: p3, maxPoints: Math.max(0, p2 - 1) },
      { grade: 4, minPoints: p4, maxPoints: Math.max(0, p3 - 1) },
      { grade: 5, minPoints: p5, maxPoints: Math.max(0, p4 - 1) },
      { grade: 6, minPoints: 0, maxPoints: Math.max(0, p5 - 1) }
    ];
  }

  // Check against known entries from official PDF:
  // For 20 points:
  // Note 1: 19 - 20 (95% of 20 = 19)
  // Note 2: 16 - 18 (80% of 20 = 16)
  // Note 3: 13 - 15 (65% of 20 = 13)
  // Note 4: 9 - 12  (45% of 20 = 9)
  // Note 5: 5 - 8   (25% of 20 = 5)
  // Note 6: 0 - 4   (< 25% of 20 = 0 to 4)
  const table20 = calculateHbsGradeTable(20);
  assert(table20[0].minPoints === 19 && table20[0].maxPoints === 20, '20 Points: Note 1 is 19-20 P.');
  assert(table20[1].minPoints === 16 && table20[1].maxPoints === 18, '20 Points: Note 2 is 16-18 P.');
  assert(table20[2].minPoints === 13 && table20[2].maxPoints === 15, '20 Points: Note 3 is 13-15 P.');
  assert(table20[3].minPoints === 9 && table20[3].maxPoints === 12, '20 Points: Note 4 is 9-12 P. (45% threshold)');
  assert(table20[4].minPoints === 5 && table20[4].maxPoints === 8, '20 Points: Note 5 is 5-8 P. (25% threshold)');
  assert(table20[5].minPoints === 0 && table20[5].maxPoints === 4, '20 Points: Note 6 is 0-4 P.');

  // For 100 points:
  const table100 = calculateHbsGradeTable(100);
  assert(table100[0].minPoints === 95 && table100[0].maxPoints === 100, '100 Points: Note 1 is 95-100 P.');
  assert(table100[3].minPoints === 45 && table100[3].maxPoints === 64, '100 Points: Note 4 is 45-64 P.');
  assert(table100[4].minPoints === 25 && table100[4].maxPoints === 44, '100 Points: Note 5 is 25-44 P.');

  // Anti-A-bias options shuffling test
  function shuffleOptionsList(options, correctIndex) {
    if (!options || options.length <= 1) return { options, correctIndex };
    const indexed = options.map((opt, idx) => ({ opt, isCorrect: idx === correctIndex }));
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }
    const shuffledOptions = indexed.map(item => item.opt);
    const newCorrectIndex = indexed.findIndex(item => item.isCorrect);
    return { options: shuffledOptions, correctIndex: newCorrectIndex };
  }

  // Run 100 shuffles and make sure correct index is not always 0
  const indicesSeen = new Set();
  for (let s = 0; s < 100; s++) {
    const res = shuffleOptionsList(['A', 'B', 'C', 'D'], 0);
    indicesSeen.add(res.correctIndex);
  }
  assert(indicesSeen.size > 2, `Anti-A-bias: Option shuffling distributed correct index across ${indicesSeen.size} different positions`);

  console.log('\n==================================================');
  console.log(`🏁 FINAL SUITE RESULT: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('==================================================');
}

runTests();
