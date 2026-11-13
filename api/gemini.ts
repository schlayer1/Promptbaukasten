// Vercel Serverless Function: /api/gemini
// Ermöglicht die sichere Nutzung des Google Gemini API-Keys als Vercel-Secret (GEMINI_API_KEY)
// ohne clientseitige Offenlegung im Browser-Bundle (kein VITE_-Prefix nötig).

const CANDIDATE_FLASH_MODELS = [
  'gemini-4-hydrogen',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-flash-latest',
];

export default async function handler(req: any, res: any) {
  // CORS-Header für sichere Kommunikation
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen sind für /api/gemini zulässig.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Ungültiges JSON im Request-Body.' });
      }
    }
    body = body || {};

    const { systemPrompt, userPrompt, model, temperature = 0.3 } = body;

    // Priorität: 
    // 1. Individueller Lehrkraft-Key (BYOK) aus Request-Body (falls gesetzt und nicht der Dummy-String)
    // 2. Vercel Secret GEMINI_API_KEY (Server-Environment-Variable)
    // 3. Fallback VITE_GEMINI_API_KEY
    const clientKey = (typeof body.apiKey === 'string' && body.apiKey.trim() !== 'serverless-proxy') 
      ? body.apiKey.trim() 
      : '';
    const serverKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
    const activeKey = clientKey || serverKey;

    if (!activeKey) {
      return res.status(401).json({
        error: 'Kein Gemini API-Schlüssel konfiguriert. Bitte hinterlege GEMINI_API_KEY in Vercel unter "Environment Variables" als Secret oder trage deinen persönlichen Schlüssel im Dialog ein.'
      });
    }

    if (!userPrompt && !systemPrompt) {
      return res.status(400).json({ error: 'userPrompt oder systemPrompt erforderlich.' });
    }

    // Modell-Kandidaten-Kette aufbauen
    const candidateModels: string[] = [];
    if (model && model !== 'auto' && !candidateModels.includes(model)) {
      candidateModels.push(model);
    }
    for (const m of CANDIDATE_FLASH_MODELS) {
      if (!candidateModels.includes(m)) {
        candidateModels.push(m);
      }
    }

    let lastErrorMessage = '';
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${userPrompt}` : userPrompt;

    for (const currentModel of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${activeKey}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50000);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: fullPrompt }]
              }
            ],
            generationConfig: {
              temperature,
              maxOutputTokens: 6000
            }
          })
        });

        clearTimeout(timeoutId);

        let data: any = null;
        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (response.ok && data) {
          const firstCandidate = data.candidates?.[0];
          const text = firstCandidate?.content?.parts?.[0]?.text;
          if (text && typeof text === 'string' && text.trim().length > 0) {
            return res.status(200).json({ text, model: currentModel });
          }

          // Safety / Block checks
          const finishReason = firstCandidate?.finishReason;
          const blockReason = data.promptFeedback?.blockReason;
          if (finishReason && finishReason !== 'STOP') {
            lastErrorMessage = `Modell ${currentModel} beendete die Generierung mit Status "${finishReason}".`;
          } else if (blockReason) {
            lastErrorMessage = `Prompt wurde durch Sicherheitsfilter geblockt (${blockReason}).`;
          } else {
            lastErrorMessage = `Modell ${currentModel} lieferte eine leere Antwort.`;
          }
          continue;
        }

        const errMsg = data?.error?.message || `HTTP ${response.status}`;
        lastErrorMessage = errMsg;

        if (response.status === 400 && (errMsg.includes('API_KEY_INVALID') || errMsg.includes('key not valid'))) {
          return res.status(400).json({ error: 'Der angegebene Gemini API-Schlüssel ist ungültig. Bitte prüfe den Schlüssel.' });
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        lastErrorMessage = err?.name === 'AbortError' ? `Timeout nach 50s bei Modell ${currentModel}` : (err?.message || String(err));
      }
    }

    return res.status(502).json({
      error: `Kein Gemini-Modell erreichbar. Letzter Fehler: ${lastErrorMessage}`
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Interner Serverfehler im Gemini-Proxy.' });
  }
}
