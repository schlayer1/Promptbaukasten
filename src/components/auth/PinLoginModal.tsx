import React, { useState } from 'react';
import { X, Lock, UserCheck, Shield, HelpCircle, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PinLoginModalProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const PinLoginModal: React.FC<PinLoginModalProps> = ({ onShowToast }) => {
  const { isLoginModalOpen, closeLoginModal, teachersList, login, loginGuest } = useAuth();
  
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachersList[0]?.id || '');
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setErrorMsg('Bitte gib deine 4-stellige PIN ein.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await login(selectedTeacherId, pin);
    setIsSubmitting(false);

    if (res.success) {
      const teacher = teachersList.find(t => t.id === selectedTeacherId);
      onShowToast('Willkommen zurück!', `Eingeloggt als ${teacher ? teacher.name : 'Lehrkraft'}.`, 'success');
      setPin('');
    } else {
      setErrorMsg(res.error || 'Ungültige PIN. Bitte prüfe deine Eingabe.');
    }
  };

  const handleGuest = () => {
    loginGuest();
    onShowToast('Gast-Modus', 'Du bist als Gast angemeldet.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-school-primary to-school-primaryContainer p-6 text-white text-center relative">
          <button
            onClick={closeLoginModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-white/20 mx-auto flex items-center justify-center shadow-soft mb-3">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="font-black text-xl leading-tight">Kollegiums-Login</h3>
          <p className="text-xs text-school-primaryLight mt-1">
            Staatliche Regelschule Heimbürgeschule Kahla
          </p>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-school-primary" />
              Name der Lehrkraft auswählen:
            </label>
            <select
              value={selectedTeacherId}
              onChange={e => {
                setSelectedTeacherId(e.target.value);
                setErrorMsg(null);
              }}
              className="w-full text-sm font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-800"
            >
              {teachersList.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} (HBS)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-school-primary" />
                4-stellige persönliche PIN:
              </span>
              <span className="text-[10px] text-slate-400">Aus dem Appportal</span>
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={15}
              placeholder="••••"
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="w-full text-center text-xl tracking-widest font-mono py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-900"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-school-primary text-white rounded-xl font-bold text-sm hover:bg-school-primaryDark transition shadow-float flex items-center justify-center gap-2"
          >
            <span>Anmelden</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleGuest}
              className="text-slate-500 hover:text-slate-800 font-semibold"
            >
              Als Gast fortfahren
            </button>

            <span className="text-[11px] text-slate-400">
              PIN vergessen? Schulleitung fragen
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
