// Vercel Serverless Function: /api/gemini
// Ermöglicht die sichere Nutzung des Google Gemini API-Keys als Vercel-Secret (GEMINI_API_KEY)
// ohne clientseitige Offenlegung im Browser-Bundle (kein VITE_-Prefix nötig).

const CANDIDATE_FLASH_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite-preview',
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

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

        if (response.ok) {
          const data: any = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return res.status(200).json({ text, model: currentModel });
          }
        }

        const errJson: any = await response.json().catch(() => ({}));
        const errMsg = errJson.error?.message || `HTTP ${response.status}`;
        lastErrorMessage = errMsg;

        if (response.status === 400 && (errMsg.includes('API_KEY_INVALID') || errMsg.includes('key not valid'))) {
          return res.status(400).json({ error: 'Der angegebene Gemini API-Schlüssel ist ungültig. Bitte prüfe den Schlüssel.' });
        }
      } catch (err: any) {
        lastErrorMessage = err?.message || String(err);
      }
    }

    return res.status(502).json({
      error: `Kein Gemini-Modell erreichbar. Letzter Fehler: ${lastErrorMessage}`
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Interner Serverfehler im Gemini-Proxy.' });
  }
}
