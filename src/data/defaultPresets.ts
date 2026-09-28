import { TaskFormat } from '../types/generator';
import { ProviderConfig } from '../types/ai';

export const TASK_FORMATS: TaskFormat[] = [
  {
    id: 'lernstation',
    title: 'Digitale Lernstation & Website',
    subtitle: 'All-in-One HTML mit 8 Modulen',
    description: 'Vollwertige Übungswebsite mit Lernziel-Checkliste, 3D-Karten, Lückentext-Sofortcheck, 3 AFB-Niveaus mit Klapp-Tipps, Zeitstrahl & Reflexion.',
    icon: 'Globe',
    tag: '⭐ All-in-One Station'
  },
  {
    id: 'arbeitsblatt',
    title: 'Differenziertes Arbeitsblatt',
    subtitle: '3 Niveaustufen & DIN-A4 Drucklayout',
    description: 'Strukturiertes Arbeitsblatt mit schulspezifischer Kopfzeile, 3 Niveaustufen (Grün, Gelb, Rot), DaZ-Wortspeicherbox und Lösungsteil.',
    icon: 'FileText',
    tag: 'Druckfertig & PDF'
  },
  {
    id: 'lernspiel',
    title: 'Interaktives HTML-Lernspiel',
    subtitle: 'Autarkes Single-File HTML für Tablets',
    description: 'Interaktives Quiz- & Zuordnungsspiel mit Soundeffekten (Web Audio API), Offline-Sprachausgabe (Web Speech) und Punkte-Zertifikat.',
    icon: 'Gamepad2',
    tag: '100% Offline Tablet-Ready'
  },
  {
    id: 'test',
    title: 'Test / Klassenarbeit',
    subtitle: 'Mit Bepunktung & Erwartungshorizont',
    description: 'Prüfungsbogen mit genauer Punkteverteilung nach Thüringer Notenschlüssel, Zweispaltigkeit und Bewertungsmatrix für die Hand der Lehrkraft.',
    icon: 'CheckSquare',
    tag: 'Mit Notenskala'
  },
  {
    id: 'einstieg',
    title: 'Einstieg & Stundeneröffnung',
    subtitle: 'Impuls, Problemstellung & Vorwissen',
    description: 'Aktivierender Einstieg (Kognitiver Konflikt, Bildimpuls, Silentium-Rätsel) inklusive vorbereitetem Tafelbild und Lernzielformulierung.',
    icon: 'Sparkles',
    tag: 'Didaktischer Impuls'
  }
];

export const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    badge: 'Standard / Großer Kontext',
    description: 'Empfohlen für umfangreiche Unterrichtsmaterialien & detailreiche Lernspiele. Hohe Generierungsqualität.',
    freeTierInfo: 'Kostenloses Kontingent via Google AI Studio (15 Abfragen/Min kostenlos).',
    apiKeyUrl: 'https://aistudio.google.com/app/apikey',
    defaultModel: 'gemini-flash-lite-latest',
    availableModels: [
      { id: 'gemini-flash-lite-latest', label: 'Gemini Flash Lite (Ultra-stabil & schnell)', recommended: true },
      { id: 'gemini-3-flash-preview', label: 'Gemini 3 Flash Preview (Neueste Generation)' },
      { id: 'gemini-flash-latest', label: 'Gemini Flash Latest (Standard)' },
      { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash' }
    ],
    envKeyName: 'VITE_GEMINI_API_KEY'
  },
  groq: {
    id: 'groq',
    name: 'Groq Cloud',
    badge: 'Ultra-schnell (1-3 Sek.)',
    description: 'Blitzschnelle Inferenz auf LPU-Hardware. Perfekt für spontane Materialerstellung im laufenden Unterricht.',
    freeTierInfo: 'Kostenloser Tier via Groq Console verfügbar.',
    apiKeyUrl: 'https://console.groq.com/keys',
    defaultModel: 'llama-3.3-70b-versatile',
    availableModels: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile (Empfehlung)', recommended: true },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant (Extrem schnell)' }
    ],
    envKeyName: 'VITE_GROQ_API_KEY'
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral AI',
    badge: 'EU-Datenschutz (Paris)',
    description: 'Europäischer Spitzen-Anbieter mit Servern in der EU. Hohe Datenschutzkonformität für Schulen.',
    freeTierInfo: 'Kostenlose Test-Kontingente via Mistral La Plateforme.',
    apiKeyUrl: 'https://console.mistral.ai/api-keys/',
    defaultModel: 'mistral-small-latest',
    availableModels: [
      { id: 'mistral-small-latest', label: 'Mistral Small (Ausgewogen & schnell)', recommended: true },
      { id: 'codestral-latest', label: 'Codestral (Exzellent für HTML/Code)' }
    ],
    envKeyName: 'VITE_MISTRAL_API_KEY'
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    badge: 'Universal-Router',
    description: 'Bündelt dutzende Modelle mit automatischer Ausfall-Kette.',
    freeTierInfo: 'Nutzt standardmäßig das Preset @preset/freie-modelle.',
    apiKeyUrl: 'https://openrouter.ai/keys',
    defaultModel: '@preset/freie-modelle',
    availableModels: [
      { id: '@preset/freie-modelle', label: '★ Preset: Freie Modelle (@preset/freie-modelle)', recommended: true },
      { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B Instruct (Free)' },
      { id: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash Exp (Free)' },
      { id: 'deepseek/deepseek-r1:free', label: 'DeepSeek R1 (Free)' }
    ],
    envKeyName: 'VITE_OPENROUTER_API_KEY'
  }
};
