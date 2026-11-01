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

Dieses Regelwerk und Moduldesign verhindert typische Modellfehler (`404 Not Found`, `410 Gone`, `429 Rate Limit`, `"no longer available to new users"`), die auftreten, wenn veraltete Modellbezeichner in neuen Projekten hartcodiert werden, sowie API-Key-Sperrungen durch ungewollte clientseitige Offenlegung.

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

### Die moderne Architektur: Serverless Proxy (`/api/gemini`)
1. **Server-Secret in Vercel**: `GEMINI_API_KEY` wird als **Type: Secret** ohne `VITE_`-Prefix hinterlegt.
2. **Serverless Function**: `api/gemini.ts` führt die Modell-Kaskade serverseitig aus. Der geheime Schlüssel verlässt niemals die Server-Infrastruktur.
3. **Persönlicher Lehrkraft-Schlüssel (BYOK)**: Falls Lehrkräfte im Browser einen eigenen Schlüssel in den Einstellungen speichern, wird dieser im Request-Body an `/api/gemini` übergeben und hat Vorrang.
4. **Vite Local Dev & Preview**: In `vite.config.ts` fängt ein Proxy-Middleware-Plugin `/api/gemini` ab, sodass Tests und `npm run dev` / `npm run preview` lokal identisch funktionieren.

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
```

---

## 4. Verbindlicher Vercel Handover Workflow

Sobald die KI-Integration in einem Projekt technisch implementiert und lauffähig ist, muss der Assistent den Nutzer am Ende des Tasks **aktiv und verständlich** anleiten, wie der Schlüssel in Vercel als Secret hinterlegt wird:

1. **Vercel-Anleitung**:
   - Gehe im Vercel-Dashboard deines Projekts auf: **Settings** $\rightarrow$ **Environment Variables**.
   - **Key**: `GEMINI_API_KEY` (ohne `VITE_`-Prefix!)
   - **Value**: `[Dein Gemini API-Schlüssel von aistudio.google.com]`
   - **Type**: `Secret` (sensitiv geschützt)
   - **Environments**: Alle Haken setzen (`Production`, `Preview`, `Development`).
   - Anschließend unter **Deployments** beim neuesten Deployment auf die drei Punkte (...) klicken und **Redeploy** wählen.

---

## 5. Checkliste für Module in Antigravity
1. Wurde sichergestellt, dass KEIN API-Key im Quellcode steht (weder Plaintext noch Base64)?
2. Wurde der Serverless-Proxy `/api/gemini` für sichere Key-Verwaltung als Vercel-Secret (`GEMINI_API_KEY`) implementiert?
3. Wurde `gemini-flash-lite-latest` als primäres Modell in der Kaskade gewählt?
4. Wurden alte 1.5er und 2.0er / 2.5er Namen aus Dropdowns und Arrays verbannt?
5. Wurde die Modellauswahl schlank auf Gemini gehalten (sofern keine Drittanbieter gefordert waren)?
6. Wurden lokale Vite-Middlewares für `npm run dev` und `npm run preview` in `vite.config.ts` integriert?
