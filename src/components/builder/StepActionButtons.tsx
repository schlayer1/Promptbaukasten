import React from 'react';
import { Copy, Wand2, Loader2, Key, AlertTriangle, ArrowRight } from 'lucide-react';
import { AiProvider } from '../../types/ai';
import { PROVIDER_CONFIGS } from '../../data/defaultPresets';
import { getEffectiveApiKey, getEffectiveOpenRouterPreset } from '../../services/aiService';

interface StepActionButtonsProps {
  provider: AiProvider;
  model: string;
  isGenerating: boolean;
  onModelChange: (model: string) => void;
  onGeneratePromptOnly: () => void;
  onGenerateWithAi: () => void;
  onOpenKeyModal: () => void;
}

export const StepActionButtons: React.FC<StepActionButtonsProps> = ({
  provider,
  model,
  isGenerating,
  onModelChange,
  onGeneratePromptOnly,
  onGenerateWithAi,
  onOpenKeyModal
}) => {
  const cfg = PROVIDER_CONFIGS[provider];
  const effectiveKey = getEffectiveApiKey(provider);
  const hasKey = !!effectiveKey;
  const openrouterPreset = provider === 'openrouter' ? getEffectiveOpenRouterPreset() : null;

  return (
    <div className="pt-4 border-t border-slate-200 space-y-3">
      {/* MODEL SELECTION & PROVIDER HINT */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Aktives KI-Modell:</span>
          <select
            value={model || cfg.defaultModel}
            onChange={e => onModelChange(e.target.value)}
            disabled={isGenerating}
            className="text-base sm:text-xs font-semibold px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-school-primary"
          >
            {openrouterPreset && openrouterPreset !== '@preset/freie-modelle' && (
              <option value="custom-preset">
                ★ Eigenes Preset ({openrouterPreset})
              </option>
            )}
            {cfg.availableModels.map(m => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className={`w-2 h-2 rounded-full ${hasKey ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-slate-600 font-medium">
            {hasKey ? `${cfg.name} bereit` : 'Kein API-Key hinterlegt'}
          </span>
          {!hasKey && (
            <button
              type="button"
              onClick={onOpenKeyModal}
              className="text-school-primary font-bold hover:underline ml-1"
            >
              Key eingeben
            </button>
          )}
        </div>
      </div>

      {/* DUAL ACTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* BUTTON A: NUR PROMPT */}
        <button
          type="button"
          onClick={onGeneratePromptOnly}
          disabled={isGenerating}
          className="p-3.5 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] disabled:opacity-50"
        >
          <Copy className="w-4 h-4 text-slate-600" />
          <span>Nur Prompt generieren</span>
        </button>

        {/* BUTTON B: DIREKT GENERIEREN VIA KI */}
        <button
          type="button"
          onClick={onGenerateWithAi}
          disabled={isGenerating}
          className={`p-3.5 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-float transition active:scale-[0.99] ${
            isGenerating
              ? 'bg-slate-500 cursor-not-allowed'
              : hasKey
              ? 'bg-gradient-to-r from-school-primary to-school-primaryContainer hover:opacity-95'
              : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>KI generiert Material...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Direkt generieren via {cfg.name.replace('Google ', '')}</span>
            </>
          )}
        </button>
      </div>

      {!hasKey && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            Tipp: Du kannst trotzdem sofort "Nur Prompt generieren" nutzen oder oben auf <strong>API-Keys</strong> klicken, um einen kostenlosen Key einzutragen.
          </div>
        </div>
      )}
    </div>
  );
};
