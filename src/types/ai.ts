export type AiProvider = 'gemini' | 'groq' | 'mistral' | 'openrouter';

export interface ProviderConfig {
  id: AiProvider;
  name: string;
  badge: string;
  description: string;
  freeTierInfo: string;
  apiKeyUrl: string;
  defaultModel: string;
  availableModels: { id: string; label: string; recommended?: boolean }[];
  envKeyName: string;
}

export interface ApiKeyStore {
  gemini?: string;
  groq?: string;
  mistral?: string;
  openrouter?: string;
  openrouterPreset?: string;
}

export interface GenerationRequest {
  provider: AiProvider;
  model?: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  apiKey?: string;
}

export interface GenerationResponse {
  success: boolean;
  content: string;
  provider: AiProvider;
  modelUsed: string;
  durationMs: number;
  error?: string;
}
