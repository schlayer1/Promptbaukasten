---
name: gemini-school-api
description: >-
  Offizielle Referenzarchitektur für die Google Gemini API-Anbindung in allen Schul-Webapplikationen 
  der Heimbürgeschule Kahla (Appportal, Kahoot, Menti, Translatorapp, Promptbaukasten).
  Dokumentiert verifizierte Flash-Modelle, schließt veraltete/eingestellte Modelle (1.5, 2.0, 2.5) 
  konsequent aus, liefert die bewährte Kaskaden-Logik mit Schulschlüssel-Fallback und regelt
  den schlanken Gemini-Standard sowie den Vercel-Environment-Setup-Workflow mit Serverless-Proxy.
---

# Google Gemini API Referenzstandard für Schul-Webapplikationen

Dieses Regelwerk und Moduldesign verhindert typische Modellfehler (`404 Not Found`, `410 Gone`, `429 Rate Limit`, `"no longer available to new users"`), die auftreten, wenn veraltete Modellbezeichner in neuen Projekten hartcodiert werden, sowie API-Key-Sperrungen durch ungewollte clientseitige Offenlegung im Browser.

---

## 0. Grundsatz: Schlanke Modellauswahl (Gemini by Default)

1. **Gemini als Standard**: Sofern in der Nutzeranfrage keine alternativen Provider (wie Groq, Mistral oder OpenRouter) explizit genannt werden, wird die Modellauswahl in Code und UI **strikt auf Google Gemini** beschränkt.
2. **Kein unnötiger Provider-Ballast**: Keine überflüssigen Auswahldropdowns oder Tabs für Drittanbieter-APIs einbauen, wenn der Nutzer lediglich eine funktionierende KI-Generierung für die Schule benötigt.
3. **Fokus**: Maximale Übersichtlichkeit und Einfachheit für Lehrkräfte und Schüler.

---

## 1. Aktuelle Modell-Landschaft (Stand 2026)

### ✅ ERLAUBTE & VERIFIZIERTE MODELLE (Flash-Familie)
Immer diese Modelle in absteigender Prioritätsreihenfolge verwenden:
1. `gemini-flash-lite-latest` (Höchste Stabilität, sofortige Antwortzeit, kein Quota-Fehler)
2. `gemini-3-flash-preview` (Sehr hohe Intelligenz, zukunftssicher)
3. `gemini-flash-latest` (Aktueller Standard-Alias)
4. `gemini-3.6-flash` / `gemini-3.7-flash` / `gemini-3.8-flash`
5. `gemini-3.5-flash`
6. `gemini-3.1-flash-lite-preview`

### ❌ UNBEDINGT AUSSCHLIESSEN (Discontinued / Deprecated)
Diese Modelle werfen Fehler und dürfen **weder** als Fallback noch in Dropdowns auftauchen:
* `gemini-1.5-flash`, `gemini-1.5-pro` (Eingestellt)
* `gemini-2.0-flash`, `gemini-2.0-pro` (Eingestellt)
* `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-2.5-flash-lite` (Meldung: *"no longer available to new users"*)
* `gemini-1.0-pro`
* Spezialisierte Nicht-Text-Modelle: `*image*`, `*tts*`, `*native-audio*`, `*embedding*`, `*aqa*`, `*transcribe*`, `*veo*`, `*lyria*`

---

## 2. Der sichere Serverless-Proxy-Standard (`GEMINI_API_KEY` als Vercel Secret)

> [!CAUTION]
> **STRIKTES SICHERHEITSGEBOT (SECRET PROTECTION):**
> API-Keys dürfen **NIEMALS** im Quellcode, Skripten oder Repositories hinterlegt werden – **auch nicht als Base64-kodierte Zeichenketten**!
> GitHub und Google durchsuchen öffentliche Repositories mit automatisierten Secret-Scannern in Echtzeit und dekodieren Base64 automatisch.
> Jeder exponierte Schlüssel führt zur sofortigen automatischen Schließung und Sperrung des Google-Cloud-Projekts.
> Zudem blockiert Vercel das Speichern von Variablen mit `VITE_`-Prefix als echtes `Secret`, weil Public-Prefixes Werte im Browser-Bundle exponieren.

### Die 3 Bausteine der Serverless-Architektur:

#### 1. Serverless Function (`api/gemini.ts`)
Wird von Vercel automatisch als geschützter Serverless-Endpunkt bereitgestellt. Liest `process.env.GEMINI_API_KEY` (Secret):

```typescript
// api/gemini.ts
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen zulässig.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Ungültiges JSON' }); }
    }
    body = body || {};

    const { systemPrompt, userPrompt, model, temperature = 0.3 } = body;
    const clientKey = (typeof body.apiKey === 'string' && body.apiKey.trim() !== 'serverless-proxy')
      ? body.apiKey.trim()
      : '';
    const serverKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
    const activeKey = clientKey || serverKey;

    if (!activeKey) {
      return res.status(401).json({
        error: 'Kein Gemini API-Schlüssel konfiguriert. Bitte hinterlege GEMINI_API_KEY in Vercel als Secret.'
      });
    }

    const candidateModels = [];
    if (model && model !== 'auto') candidateModels.push(model);
    for (const m of CANDIDATE_FLASH_MODELS) {
      if (!candidateModels.includes(m)) candidateModels.push(m);
    }

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${userPrompt}` : userPrompt;
    let lastErrorMessage = '';

    for (const currentModel of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${activeKey}`;
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: { temperature, maxOutputTokens: 6000 }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return res.status(200).json({ text, model: currentModel });
          }
        }
        const errJson = await response.json().catch(() => ({}));
        lastErrorMessage = errJson.error?.message || `HTTP ${response.status}`;
      } catch (err: any) {
        lastErrorMessage = err?.message || String(err);
      }
    }

    return res.status(502).json({ error: `Kein Modell erreichbar: ${lastErrorMessage}` });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Serverfehler im Gemini-Proxy' });
  }
}
```

#### 2. Lokaler Vite Proxy (`vite.config.ts`)
Ermöglicht identisches Verhalten bei lokalem `npm run dev` und `npm run preview`:

```typescript
function geminiLocalProxyPlugin(): Plugin {
  return {
    name: 'gemini-local-proxy',
    configureServer(server) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url?.split('?')[0] === '/api/gemini') {
          // Handhabung identisch zu handler(...) oben
        } else {
          next();
        }
      });
    },
    configurePreviewServer(server) {
      // identische Middleware für Preview
    }
  };
}
```

#### 3. Frontend-Aufruf (`src/services/geminiEngine.ts`)
Ruft standardmäßig `/api/gemini` auf. Bei rein statischem Hosting (404) und vorhandenem Schlüssel greift der automatische Direkt-Fallback:

```typescript
export async function callGeminiApi({ apiKey, systemPrompt, userPrompt, model, temperature = 0.3 }): Promise<string> {
  const cleanKey = apiKey?.trim() || '';
  const effectiveClientKey = (cleanKey && cleanKey !== 'serverless-proxy') ? cleanKey : '';

  try {
    const proxyResponse = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: effectiveClientKey || undefined,
        systemPrompt,
        userPrompt,
        model,
        temperature
      })
    });

    if (proxyResponse.ok) {
      const data = await proxyResponse.json();
      if (data?.text) return data.text;
    }
    if (proxyResponse.status !== 404) {
      const errJson = await proxyResponse.json().catch(() => ({}));
      throw new Error(errJson?.error || `HTTP ${proxyResponse.status}`);
    }
  } catch (proxyErr: any) {
    if (proxyErr.message && !proxyErr.message.includes('404')) throw proxyErr;
  }

  // Fallback: Direktaufruf
  ...
}
```

---

## 3. Verbindlicher Vercel Handover Workflow (Anleitung für den Nutzer)

Sobald die KI-Integration in einem Projekt technisch implementiert und lauffähig ist, muss der Assistent den Nutzer am Ende des Tasks **aktiv und verständlich** anleiten, wie der Schlüssel in Vercel als Secret hinterlegt wird:

1. **Vercel-Anleitung**:
   - Gehe im Vercel-Dashboard deines Projekts auf: **Settings** $\rightarrow$ **Environment Variables**.
   - **Key**: `GEMINI_API_KEY` (ohne `VITE_`-Prefix!)
   - **Value**: `[Dein Gemini API-Schlüssel von aistudio.google.com]`
   - **Type**: `Secret` (sensitiv geschützt, wird von Vercel ohne Warnung akzeptiert)
   - **Environments**: Alle 3 Haken setzen (`Production`, `Preview`, `Development`).
   - Auf **Save** klicken.
   - Anschließend unter **Deployments** beim neuesten Deployment auf die drei Punkte (...) klicken und **Redeploy** wählen.

---

## 4. Checkliste für Module in Antigravity
1. Wurde sichergestellt, dass KEIN API-Key im Quellcode steht (weder Plaintext noch Base64)?
2. Wurde der Serverless-Proxy `/api/gemini` für sichere Key-Verwaltung als Vercel-Secret (`GEMINI_API_KEY`) implementiert?
3. Wurde `gemini-flash-lite-latest` als primäres Modell in der Kaskade gewählt?
4. Wurden alte 1.5er und 2.0er / 2.5er Namen aus Dropdowns und Arrays verbannt?
5. Wurde die Modellauswahl schlank auf Gemini gehalten (sofern keine Drittanbieter gefordert waren)?
6. Wurden lokale Vite-Middlewares für `npm run dev` und `npm run preview` in `vite.config.ts` integriert?
