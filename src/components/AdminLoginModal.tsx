import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentPin: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentPin,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === currentPin) {
      setError('');
      setPin('');
      onSuccess();
      onClose();
    } else {
      setError('Hatalı yönetici şifresi / PIN! Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#080d1a] rounded-3xl shadow-2xl shadow-black w-full max-w-sm border border-sky-600/50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-sky-900/50 flex items-center justify-between bg-sky-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl btn-electric text-white flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Yönetici (Admin) Girişi</h3>
              <p className="text-[11px] text-sky-300/80">Drive linkleri ve program düzenleme</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sky-400 hover:text-white p-1 rounded-lg hover:bg-sky-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-sky-200 mb-1.5 flex items-center justify-between">
              <span>Yönetici PIN / Şifre</span>
              <span className="text-[10px] text-cyan-400/80">(Varsayılan: 1234)</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                placeholder="PIN veya şifrenizi girin..."
                autoFocus
                className="w-full text-sm bg-black/60 border border-sky-700/60 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-sky-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all font-mono"
              />
            </div>

            {error && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400 bg-red-950/40 border border-red-900/50 p-2 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-[#060b16] border border-sky-900/50 rounded-xl text-[11px] text-sky-300/80 leading-relaxed">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
            Admin paneline giriş yaptıktan sonra tüm 30 haftanın Google Drive klasör linklerini ekleyebilir, güncelleyebilir ve şifrenizi değiştirebilirsiniz.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-sky-300 hover:text-white bg-black/40 hover:bg-sky-950/60 border border-sky-800/40 rounded-xl transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={!pin.trim()}
              className="btn-electric px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-md disabled:opacity-50"
            >
              Giriş Yap
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
