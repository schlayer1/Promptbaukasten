---
name: gemini-school-api
description: >-
  Offizielle Referenzarchitektur für die Google Gemini API-Anbindung in allen Schul-Webapplikationen 
  der Heimbürgeschule Kahla (Appportal, Kahoot, Menti, Translatorapp, Promptbaukasten).
  Dokumentiert verifizierte Flash-Modelle, schließt veraltete/eingestellte Modelle (1.5, 2.0, 2.5) 
  konsequent aus, liefert die bewährte Kaskaden-Logik mit Schulschlüssel-Fallback und regelt
  den schlanken Gemini-Standard sowie den Vercel-Environment-Setup-Workflow.
---

# Google Gemini API Referenzstandard für Schul-Webapplikationen

Dieses Regelwerk und Moduldesign verhindert typische Modellfehler (`404 Not Found`, `410 Gone`, `429 Rate Limit`, `"no longer available to new users"`), die auftreten, wenn veraltete Modellbezeichner in neuen Projekten hartcodiert werden.

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

## 2. Der 3-Stufen-Schlüssel-Standard (BYOK & Schul-Fallback)

In jeder Schul-App muss die Schlüssel-Ermittlung in folgender Reihenfolge erfolgen:

1. **Persönlicher Lehrkraft-Schlüssel** (aus `localStorage`)
2. **Vercel / Vite Umgebungsvariable** (`import.meta.env.VITE_GEMINI_API_KEY`)
3. **Schul-Standardschlüssel** (als Base64 hinterlegt, damit Schüler/Lehrkräfte die App sofort ohne Login/Setup nutzen können):

```typescript
const decodeDefaultKey = (): string => {
  try {
    const b64 = 'QVEuQWI4Uk42SUpRQTM1V0ZScTRfLTdsUFAxQVU1Y1l5bkVTN3VmekZjdjlyZktHMjhhV2c=';
    if (typeof atob !== 'undefined') return atob(b64);
    if (typeof Buffer !== 'undefined') return Buffer.from(b64, 'base64').toString('utf8');
  } catch {}
  return '';
};
export const DEFAULT_SCHOOL_GEMINI_KEY = decodeDefaultKey();
```

---

## 3. Die Ausfall-Kaskade (`executeWithCascade`)

Niemals nur einen einzigen Modellnamen aufrufen! Wenn Google auf einem Server hohe Last (`503`), ein Rate-Limit (`429`) oder Modelländerungen (`404`) meldet, schaltet die Kaskade **stillschweigend innerhalb von Millisekunden auf das nächste Modell** um:

```typescript
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

const SUNSET_OR_DISCONTINUED_PATTERNS = [
  '2.5-flash', '2.5-pro', '1.5-flash', '1.5-pro', '1.0-pro', 
  '2.0-flash', '2.0-pro', '8b', 'embedding', 'aqa', 'tts', 'image'
];
```

### Kaskaden-Schleife:
```typescript
for (const model of candidateModels) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 4096 }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        cachedWorkingModel = model;
        return text;
      }
    }
    // Bei 503, 429 oder 404: nächste Iteration der Schleife
  } catch (err) {
    // Weitermachen mit nächstem Kandidaten
  }
}
```

---

## 4. Verbindlicher Abschluss-Schritt: Vercel Handover Workflow

Sobald die KI-Integration in einem Projekt technisch implementiert und lauffähig ist, muss der Assistent den Nutzer am Ende des Tasks **aktiv und unaufgefordert** nach dem API-Key fragen und die Schritte zur Hinterlegung auf Vercel erläutern:

1. **Nutzer-Abfrage**:
   > *"Die technische KI-Anbindung ist eingerichtet. Möchtest du deinen eigenen Gemini API-Key direkt hinterlegen, oder soll ich dir die Schritte für Vercel zeigen?"*

2. **Vercel-Anleitung**:
   - Gehe im Vercel-Dashboard deines Projekts auf: **Settings** $\rightarrow$ **Environment Variables**.
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: `[Dein Gemini API-Schlüssel von aistudio.google.com]`
   - **Environment**: Alle Haken setzen (`Production`, `Preview`, `Development`).
   - Anschließend unter **Deployments** beim neuesten Deployment auf die drei Punkte (...) klicken und **Redeploy** wählen.

---

## 5. Checkliste für neue Module in Antigravity
1. Wurde `DEFAULT_SCHOOL_GEMINI_KEY` als Basis-Fallback eingebaut?
2. Wurde `gemini-flash-lite-latest` als primäres Modell gewählt?
3. Wurden alte 1.5er und 2.0er / 2.5er Namen aus Dropdowns und Arrays verbannt?
4. Wurde die Modellauswahl schlank auf Gemini gehalten (sofern keine Drittanbieter gefordert waren)?
5. Wurde nach Abschluss aktiv nach dem API-Key und Vercel-Setup gefragt?
