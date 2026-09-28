import { AiProvider } from '../types/ai';

interface OpenAiCompatRequest {
  provider: AiProvider;
  apiKey: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}

const ENDPOINTS: Record<AiProvider, string> = {
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  mistral: 'https://api.mistral.ai/v1/chat/completions',
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
  gemini: '' // Uses dedicated geminiEngine
};

const OPENROUTER_FALLBACK_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'qwen/qwen-2.5-72b-instruct:free',
  'mistralai/mistral-7b-instruct:free'
];

export async function callOpenAiCompatibleApi({
  provider,
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  temperature = 0.3
}: OpenAiCompatRequest): Promise<string> {
  const endpoint = ENDPOINTS[provider];
  if (!endpoint) {
    throw new Error(`Kein Endpoint für Provider "${provider}" definiert`);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin || 'https://promptbaukasten.vercel.app';
    headers['X-Title'] = 'KI-Unterrichts-Baukasten (Thüringer Regelschule)';
  }

  // Build list of models to try
  const modelsToTry = provider === 'openrouter'
    ? [model, ...OPENROUTER_FALLBACK_MODELS.filter(m => m !== model)]
    : [model];

  let lastError: Error | null = null;

  for (const currentModel of modelsToTry) {
    const payload = {
      model: currentModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature,
      max_tokens: provider === 'openrouter' ? 4000 : 6000
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const choice = data.choices?.[0];
        const content = choice?.message?.content;
        if (content) {
          return content;
        }
      }

      let errorDetail = '';
      try {
        const errJson = await response.json();
        errorDetail = errJson.error?.message || JSON.stringify(errJson);
      } catch {
        errorDetail = await response.text();
      }

      if (response.status === 429) {
        lastError = new Error(
          `[OPENROUTER] Server-Überlastung (429): Die kostenlosen Server für "${currentModel}" sind im Moment weltweit überlastet. Tipp: Wechsle oben für sofortige Generierung auf Google Gemini (kostenlos via AI Studio) oder Groq Cloud.`
        );
        // Continue to try next fallback model if openrouter
        if (provider === 'openrouter') {
          console.warn(`[OpenRouter] Modell ${currentModel} lieferte 429, versuche nächstes Fallback-Modell...`);
          continue;
        }
      } else {
        lastError = new Error(`[${provider.toUpperCase()}] API-Fehler (${response.status}): ${errorDetail}`);
        // If it's a fatal non-429 error (like bad api key 401), stop immediately
        if (response.status === 401 || response.status === 403) {
          throw lastError;
        }
      }
    } catch (err: any) {
      lastError = err;
      if (err.message && err.message.includes('401')) {
        throw err;
      }
    }
  }

  throw lastError || new Error(`[${provider.toUpperCase()}] Generierung fehlgeschlagen`);
}
