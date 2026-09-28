# KI-Unterrichts-Baukasten & Lernspiel-Werkstatt (Thüringer Regelschule)

Eine moderne, didaktisch geschärfte Web-Applikation für Lehrkräfte an Thüringer Regelschulen zur KI-gestützten Erstellung von differenzierten Unterrichtsmaterialien, interaktiven Offline-Lernspielen (HTML5) und transparenten Erwartungshorizonten nach dem **Thüringer Lehrplan (ThILLM)** und den **KMK-Anforderungsbereichen (AFB I–III)**.

Entwickelt für die **Staatliche Regelschule Heimbürgeschule Kahla** und harmonisiert mit dem HBS-Designsystem.

---

## 🚀 Hauptfunktionen

### 1. Multi-Provider AI-Hub (Bring Your Own Key & Automatischer Schul-Fallback)
- **Google Gemini**: Standard / Empfehlung für lange, didaktisch anspruchsvolle Ausgaben (mit dynamischer Model-Discovery wie in der Translatorapp: `gemini-2.0-flash`, `gemini-1.5-flash`).
- **Groq Cloud**: Blitzschnelle Inferenz (2-3 Sek.) mit `llama-3.3-70b-versatile` und `llama-3.1-8b-instant`.
- **Mistral AI**: EU-Datenschutz-Option aus Paris (`mistral-small-latest`, `codestral-latest`).
- **OpenRouter**: Universal-Router mit kostenfreien Modellen (`meta-llama/llama-3.3-70b-instruct:free`).
- **Smarter Fallback**: Wenn Lehrkräfte keinen persönlichen Key im Browser hinterlegen, greift die App automatisch auf die in Vercel konfigurierten Schulschlüssel zurück.

### 2. Thüringer Curriculum-Datenbasis (`thueringenCurriculum.ts`)
Vollständige Abdeckung der Thüringer Rahmenstundentafel:
- **Kernfächer**: Deutsch, Mathematik, Englisch (1. FS)
- **Naturwissenschaftlich-technisch**: Mensch-Natur-Technik (MNT Kl. 5/6), Biologie (ab 7), Physik (ab 7), Chemie (ab 7), Astronomie (Kl. 9/10), WRT (Wirtschaft-Recht-Technik, ab 7)
- **Gesellschaftswissenschaftlich**: Geografie (ab 5), Geschichte (ab 6), Sozialkunde (ab 8)
- **Ästhetisch & Sport**: Kunsterziehung, Musik, Sport
- **Werte & Orientierung**: Ethik, Evangelische Religion, Katholische Religion
- **Wahlpflichtbereich**: Darstellen & Gestalten, Informatik / Medienbildung, Natur & Technik, 2. Fremdsprache (Französisch / Russisch)

### 3. Thüringer Operatoren-Wächter & AFB-Tuning
- Offizielle Thüringer Operatoren nach ThILLM (Nennen, Erläutern, Beurteilen etc.).
- Anpassbare Punkte-Gewichtung (Standard-Preset: 40% AFB I / 40% AFB II / 20% AFB III).
- Koppelung an die drei Aufgabenniveaus:
  - 🟢 **Niveau Grün**: AFB I (Reproduktion & Fachwissen)
  - 🟡 **Niveau Gelb**: AFB II (Reorganisation & Transfer)
  - 🔴 **Niveau Rot**: AFB III (Reflexion, Sach- und Werturteil, Gestaltung)

### 4. Inklusion, DaZ & Barrierefreiheit (Fördermodus)
- Automatischer Fachwortspeicher mit Begriffserklärungen in einfacher Sprache.
- Sprachsensible Aufgabenstellungen.
- Integrierte Offline-Vorlesefunktion im Lernspiel via Web Speech API (`window.speechSynthesis`).

### 5. Dreigleisige Ausgabe & Export
- **Tab 1: Interaktives HTML-Lernspiel**:
  - 100% autarke Single-File-HTML-Datei (keine externen CDNs oder MP3s nötig).
  - Gamification: XP/Sterne, animierter Fortschrittsbalken, Soundeffekte via Web Audio API.
  - Live-Iframe Sandbox zum sofortigen Ausprobieren im Browser.
  - Dynamischer QR-Code für Tablet-Verteilung im Klassenraum.
  - GIFT-Export für die Thüringer Schulcloud (TSC) und Moodle.
- **Tab 2: Druckfertiges DIN-A4 Arbeitsblatt**:
  - Kopfzeile (Name, Klasse, Datum, Fach, Lehrplanbezug) + QR-Code zum Online-Lernspiel.
  - 3 Niveaustufen (Grün, Gelb, Rot), Wortspeicher und Lösungsbereich.
  - `@media print`-Optimierung für sauberen Browser-Druck und PDF-Export.
- **Tab 3: Bewertungsraster & Erwartungshorizont**:
  - Tabellarische Matrix (Aufgabe, AFB-Stufe, Leistungskriterien, Maximalpunkte).
  - Schüler-Rückmeldebogen und Thüringer Regelschul-Notenschlüssel (100–50%).
- **Tab 4: Prompt-Hub**:
  - 1-Klick-Kopie des didaktisch geschärften Fachdidaktiker-Prompts für externe KIs (ChatGPT, Claude, DeepSeek).

---

## ⚙️ Vercel Deployment & Umgebungsvariablen

Das Projekt ist für den direkten Push auf GitHub und das Deployment auf Vercel optimiert.

### In Vercel hinterlegbare Umgebungsvariablen:
In den **Vercel Project Settings** unter `Environment Variables` eintragen:

| Variable | Beschreibung | Kostenloser Key via |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Google Gemini API-Schlüssel | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `VITE_GROQ_API_KEY` | Groq Cloud API-Schlüssel | [Groq Console](https://console.groq.com/keys) |
| `VITE_MISTRAL_API_KEY` | Mistral AI API-Schlüssel | [Mistral Console](https://console.mistral.ai/api-keys/) |
| `VITE_OPENROUTER_API_KEY` | OpenRouter API-Schlüssel | [OpenRouter Keys](https://openrouter.ai/keys) |

---

## 💻 Lokale Entwicklung

```bash
# Repository klonen
git clone https://github.com/schlayer1/Promptbaukasten.git
cd Promptbaukasten

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktions-Build erstellen
npm run build
```

---

## 🏫 Integration in das HBS App-Portal

Dieser Baukasten reiht sich in die modularen Tools der Heimbürgeschule Kahla ein (z. B. Schul-Portal, Translatorapp, Tafel-App). Der Registrierungsschnipsel für `Landingpage Schulapps/src/config/apps.ts`:

```typescript
{
  id: "promptbaukasten",
  title: "KI-Unterrichts-Baukasten & Lernspiel-Werkstatt",
  shortTitle: "Unterrichts-Baukasten",
  subtitle: "Differenzierte Arbeitsblätter, HTML5-Lernspiele & Erwartungshorizonte",
  description: "Erstellt didaktisch fundierte Unterrichtsmaterialien nach Thüringer Regelschullehrplan (ThILLM) und KMK-Anforderungsbereichen (AFB I–III). Inklusive autarker Single-File HTML5-Lernspiele mit Sound und Vorlesefunktion.",
  url: "https://promptbaukasten.vercel.app", // bzw. verlinkter Deployment-Pfad
  category: "unterricht",
  badge: "ThILLM & HTML5",
  badgeColor: "blue",
  icon: "Sparkles",
  tags: ["Unterrichtsvorbereitung", "Differenzierung", "Lernspiele", "AFB", "Thüringen", "Inklusion", "DaZ"],
  offlineReady: true,
  privacyBadge: "DSGVO-konform (Clientseitig)",
  pedagogicalValue: "Ermöglicht passgenaue Differenzierung nach Thüringer Operatoren und erzeugt sofort einsetzbare interaktive Tablet-Spiele ohne Registrierung für Schüler."
}
```
