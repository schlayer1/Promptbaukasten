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

  // OpenRouter specific headers for rankings & identification
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin || 'https://promptbaukasten.vercel.app';
    headers['X-Title'] = 'KI-Unterrichts-Baukasten (Thüringer Regelschule)';
  }

  const payload = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature,
    max_tokens: 6000
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error?.message || JSON.stringify(errJson);
    } catch {
      errorDetail = await response.text();
    }
    throw new Error(`[${provider.toUpperCase()}] API-Fehler (${response.status}): ${errorDetail}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  const content = choice?.message?.content;

  if (!content) {
    throw new Error(`[${provider.toUpperCase()}] Antwort enthielt keinen Text`);
  }

  return content;
}
