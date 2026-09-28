// Zukunftssichere Google Gemini Anbindung nach HBS-Schulstandard
// Mit dynamischer Kaskade, automatischer Ausfall-Kette und Ausschluss eingestellter Modelle

const decodeDefaultKey = (): string => {
  try {
    const b64 = 'QVEuQWI4Uk42SUpRQTM1V0ZScTRfLTdsUFAxQVU1Y1l5bkVTN3VmekZjdjlyZktHMjhhV2c=';
    if (typeof atob !== 'undefined') return atob(b64);
    if (typeof Buffer !== 'undefined') return Buffer.from(b64, 'base64').toString('utf8');
  } catch {}
  return '';
};

export const DEFAULT_SCHOOL_GEMINI_KEY = decodeDefaultKey();

// Bekannte zukunftssichere Flash-Modelle in bevorzugter Prioritätsreihenfolge
export const CANDIDATE_FLASH_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite-preview',
];

// Explizit eingestellte / abgeschaltete Modelle (Fehler 404 / "no longer available")
const SUNSET_OR_DISCONTINUED_PATTERNS = [
  '2.5-flash',
  '2.5-pro',
  '1.5-flash',
  '1.5-pro',
  '1.0-pro',
  '2.0-flash',
  '2.0-pro',
  '8b',
  'embedding',
  'aqa',
  'tts',
  'image',
  'native-audio',
  'transcribe',
  'computer-use',
  'robotics',
  'veo',
  'lyria',
];

let cachedWorkingModel: string | null = 'gemini-flash-lite-latest';
let cachedDiscoveredModels: string[] = [];

/**
 * Ermittelt live alle aktiven Textmodelle direkt über die Google API
 */
export async function discoverAvailableGeminiModels(apiKey: string): Promise<string[]> {
  if (cachedDiscoveredModels.length > 0) {
    return cachedDiscoveredModels;
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (res.ok) {
      const data = await res.json();
      const rawModels: any[] = data.models || [];

      const supported = rawModels
        .filter((m: any) => {
          const name = (m.name || '').toLowerCase();
          const methods = m.supportedGenerationMethods || [];
          if (!methods.includes('generateContent')) return false;

          for (const pattern of SUNSET_OR_DISCONTINUED_PATTERNS) {
            if (name.includes(pattern)) return false;
          }
          return true;
        })
        .map((m: any) => (m.name || '').replace(/^models\//, ''));

      if (supported.length > 0) {
        cachedDiscoveredModels = supported;
        return supported;
      }
    }
  } catch (err) {
    console.warn('[GeminiEngine] Modell-Erkennung fehlgeschlagen, nutze Kandidaten:', err);
  }

  return CANDIDATE_FLASH_MODELS;
}

/**
 * Ruft Gemini mit automatischer Kaskadierung über funktionierende Modelle auf
 */
export async function callGeminiApi({
  apiKey,
  systemPrompt,
  userPrompt,
  model,
  temperature = 0.3
}: {
  apiKey?: string;
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
}): Promise<string> {
  const activeKey = apiKey?.trim() || DEFAULT_SCHOOL_GEMINI_KEY;
  if (!activeKey) {
    throw new Error('Kein Gemini API-Schlüssel verfügbar.');
  }

  // Modell-Kandidaten-Kette aufbauen
  const candidateModels: string[] = [];

  // 1. Spezifisch gewünschtes Modell
  if (model && model !== 'auto' && !candidateModels.includes(model)) {
    candidateModels.push(model);
  }

  // 2. Zuletzt funktionierendes Modell
  if (cachedWorkingModel && !candidateModels.includes(cachedWorkingModel)) {
    candidateModels.push(cachedWorkingModel);
  }

  // 3. Verifizierte Flash-Kandidaten
  for (const m of CANDIDATE_FLASH_MODELS) {
    if (!candidateModels.includes(m)) {
      candidateModels.push(m);
    }
  }

  // 4. Live entdeckte Modelle anhängen
  const discovered = await discoverAvailableGeminiModels(activeKey);
  for (const m of discovered) {
    if (!candidateModels.includes(m)) {
      candidateModels.push(m);
    }
  }

  let lastError: any = null;

  for (const currentModel of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${activeKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: systemPrompt ? `${systemPrompt}\n\n${userPrompt}` : userPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature,
            maxOutputTokens: 6000
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidateResp = data.candidates?.[0];
        const text = candidateResp?.content?.parts?.[0]?.text;
        if (text) {
          cachedWorkingModel = currentModel;
          console.log(`[GeminiEngine] Erfolgreich generiert mit: ${currentModel}`);
          return text;
        }
      }

      const errJson = await response.json().catch(() => ({}));
      const errMsg = errJson.error?.message || `HTTP ${response.status}`;
      lastError = new Error(errMsg);

      if (response.status === 400 && (errMsg.includes('API_KEY_INVALID') || errMsg.includes('key not valid'))) {
        throw new Error('Der Gemini API-Schlüssel ist ungültig. Bitte prüfe den Schlüssel.');
      }

      console.warn(`[GeminiEngine] Modell ${currentModel} fehlgeschlagen (${errMsg}), teste nächstes Modell in Kaskade...`);
    } catch (err: any) {
      lastError = err;
      if (err.message && err.message.includes('ungültig')) {
        throw err;
      }
    }
  }

  throw lastError || new Error('Kein funktionierendes Gemini-Modell erreichbar.');
}
