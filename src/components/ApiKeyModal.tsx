import React, { useState } from 'react';
import { X, Key, ShieldCheck, AlertCircle, ExternalLink, Eye, EyeOff, Save, Sparkles, Server } from 'lucide-react';
import { AiProvider } from '../types/ai';
import { PROVIDER_CONFIGS } from '../data/defaultPresets';
import { getStoredApiKeys, saveApiKey, getEffectiveApiKey, getEffectiveOpenRouterPreset, saveOpenRouterPreset } from '../services/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeysChanged: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeysChanged,
  onShowToast
}) => {
  if (!isOpen) return null;

  const [keys, setKeys] = useState(() => getStoredApiKeys());
  const [preset, setPreset] = useState(() => getEffectiveOpenRouterPreset() || '');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const providers: AiProvider[] = ['gemini', 'groq', 'mistral', 'openrouter'];

  const toggleShowKey = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleKeyChange = (provider: AiProvider, val: string) => {
    setKeys(prev => ({ ...prev, [provider]: val }));
  };

  const handleSave = (provider: AiProvider) => {
    const val = keys[provider] || '';
    saveApiKey(provider, val);
    if (provider === 'openrouter') {
      saveOpenRouterPreset(preset);
    }
    onKeysChanged();
    onShowToast('Gespeichert', `Einstellungen für ${PROVIDER_CONFIGS[provider].name} wurden aktualisiert.`, 'success');
  };

  const handleClear = (provider: AiProvider) => {
    saveApiKey(provider, '');
    setKeys(prev => ({ ...prev, [provider]: '' }));
    if (provider === 'openrouter') {
      saveOpenRouterPreset('');
      setPreset('');
    }
    onKeysChanged();
    onShowToast('Entfernt', `Persönlicher Key für ${PROVIDER_CONFIGS[provider].name} gelöscht.`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-school-primary px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">KI-Anbieter & API-Schlüssel</h3>
              <p className="text-xs text-school-primaryLight">Bring Your Own Key & Automatischer Schul-Fallback</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-school-surface">
          <div className="bg-school-surfaceContainer p-4 rounded-xl border border-school-border flex items-start gap-3 text-xs text-school-textMain">
            <Server className="w-5 h-5 text-school-primary shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-1">Vercel & Schulnetz-Hinweis:</strong>
              Wenn du diesen Baukasten auf Vercel deployst, kannst du die Umgebungsvariablen (<code className="bg-white px-1.5 py-0.5 rounded text-school-primary font-mono font-bold">VITE_GEMINI_API_KEY</code>, etc.) in den Vercel Project Settings hinterlegen. Die App nutzt diese automatisch als Fallback, falls Lehrkräfte keinen individuellen Schlüssel eintragen!
            </div>
          </div>

          <div className="space-y-4">
            {providers.map(p => {
              const cfg = PROVIDER_CONFIGS[p];
              const effective = getEffectiveApiKey(p);
              const isConfigured = !!effective;
              const isCustom = effective?.isCustom ?? false;
              const isVisible = !!showKeys[p];

              return (
                <div 
                  key={p}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-soft transition hover:border-school-primary"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${isConfigured ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-amber-400 ring-4 ring-amber-100'}`} />
                      <h4 className="font-bold text-slate-800 text-sm">{cfg.name}</h4>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {cfg.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isConfigured && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isCustom 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          <ShieldCheck className="w-3 h-3" />
                          {isCustom ? 'Persönlicher Key' : 'Schul-Key (Vercel)'}
                        </span>
                      )}
                      {!isConfigured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Kein Key
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mb-3">{cfg.description}</p>

                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <input
                        type={isVisible ? 'text' : 'password'}
                        placeholder={effective && !isCustom ? 'Schulweiter Key aktiv (Vercel ENV)' : `Persönlichen ${cfg.name} API-Key eingeben...`}
                        value={keys[p] || ''}
                        onChange={e => handleKeyChange(p, e.target.value)}
                        className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg pr-9 focus:outline-none focus:ring-2 focus:ring-school-primary focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey(p)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        title={isVisible ? 'Key verbergen' : 'Key anzeigen'}
                      >
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <button
                      onClick={() => handleSave(p)}
                      className="px-3 py-2 bg-school-primary text-white text-xs font-semibold rounded-lg hover:bg-school-primaryDark transition flex items-center gap-1.5 shrink-0"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Speichern
                    </button>

                    {keys[p] && (
                      <button
                        onClick={() => handleClear(p)}
                        className="px-2.5 py-2 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition shrink-0"
                        title="Persönlichen Key löschen"
                      >
                        Löschen
                      </button>
                    )}
                  </div>

                  {p === 'openrouter' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        OpenRouter Preset-Name / Slug (Optional):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="z. B. mein-free-preset oder @preset/mein-preset"
                          value={preset}
                          onChange={e => setPreset(e.target.value)}
                          className="flex-1 text-xs font-mono px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-school-primary"
                        />
                        <button
                          type="button"
                          onClick={() => handleSave('openrouter')}
                          className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                        >
                          Preset speichern
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Wenn angegeben, verwendet die App direkt dein in OpenRouter erstelltes Multi-Modell-Preset (mit automatischer Ausfall-Kette).
                      </p>
                    </div>
                  )}

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {cfg.freeTierInfo}
                    </span>
                    <a
                      href={cfg.apiKeyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-school-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Kostenlosen Key holen
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition"
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
};
