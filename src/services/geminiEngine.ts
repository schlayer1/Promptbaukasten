// Robust Google Gemini REST client with dynamic model discovery & automatic fallback
let cachedWorkingModel: string | null = null;
let cachedApiVersion: string = 'v1beta';

const TRUSTED_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-flash-latest',
  'gemini-2.0-flash-lite',
  'gemini-1.5-pro'
];

export async function discoverBestGeminiModel(apiKey: string): Promise<{ model: string; version: string }> {
  if (cachedWorkingModel) {
    return { model: cachedWorkingModel, version: cachedApiVersion };
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (res.ok) {
      const data = await res.json();
      const models: any[] = data.models || [];

      const supported = models.filter((m: any) => {
        const name: string = m.name || '';
        const methods: string[] = m.supportedGenerationMethods || [];
        return (
          methods.includes('generateContent') &&
          !name.includes('8b') &&
          !name.includes('2.5') &&
          !name.includes('embedding') &&
          !name.includes('aqa')
        );
      });

      for (const trusted of TRUSTED_MODELS) {
        const found = supported.find((m: any) => m.name === `models/${trusted}` || m.name.endsWith(`/${trusted}`));
        if (found) {
          const cleanName = found.name.replace(/^models\//, '');
          cachedWorkingModel = cleanName;
          cachedApiVersion = 'v1beta';
          return { model: cleanName, version: 'v1beta' };
        }
      }

      const anyFlash = supported.find((m: any) => m.name.includes('flash'));
      if (anyFlash) {
        const cleanName = anyFlash.name.replace(/^models\//, '');
        cachedWorkingModel = cleanName;
        cachedApiVersion = 'v1beta';
        return { model: cleanName, version: 'v1beta' };
      }

      if (supported.length > 0) {
        const cleanName = supported[0].name.replace(/^models\//, '');
        cachedWorkingModel = cleanName;
        cachedApiVersion = 'v1beta';
        return { model: cleanName, version: 'v1beta' };
      }
    }
  } catch (err) {
    console.warn('[Gemini] Live discovery failed, using standard fallback:', err);
  }

  return { model: 'gemini-2.0-flash', version: 'v1beta' };
}

export async function callGeminiApi({
  apiKey,
  systemPrompt,
  userPrompt,
  model = 'gemini-2.0-flash',
  temperature = 0.3
}: {
  apiKey: string;
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
}): Promise<string> {
  const { model: resolvedModel } = await discoverBestGeminiModel(apiKey);
  const targetModel = model && model !== 'gemini-2.0-flash' ? model : resolvedModel;

  const candidateModels = [
    targetModel,
    ...TRUSTED_MODELS.filter(m => m !== targetModel)
  ];

  const apiVersions = ['v1beta', 'v1'];
  let lastError: any = null;

  for (const candidate of candidateModels) {
    for (const version of apiVersions) {
      const endpoint = `https://generativelanguage.googleapis.com/${version}/models/${candidate}:generateContent?key=${apiKey}`;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: userPrompt }]
              }
            ],
            generationConfig: {
              temperature,
              maxOutputTokens: 8192
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidateResp = data.candidates?.[0];
          const text = candidateResp?.content?.parts?.[0]?.text;
          if (text) {
            return text;
          }
        }

        const errText = await response.text();
        lastError = new Error(`Gemini Error (${response.status}): ${errText}`);
      } catch (err) {
        lastError = err;
      }
    }
  }

  throw lastError || new Error('Gemini API Aufruf fehlgeschlagen');
}
