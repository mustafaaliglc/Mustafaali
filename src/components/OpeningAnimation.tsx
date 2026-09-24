import React, { useEffect, useState } from 'react';
import { Sparkles, Code2 } from 'lucide-react';

interface OpeningAnimationProps {
  ownerName: string;
  onComplete: () => void;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({
  ownerName,
  onComplete,
}) => {
  const [progress, setProgress] = useState(18);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Elegant fast progress ramp
    const p1 = setTimeout(() => setProgress(65), 200);
    const p2 = setTimeout(() => setProgress(95), 550);
    const p3 = setTimeout(() => setProgress(100), 850);

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1100);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 1450);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#04060c] transition-all duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* Ambient electric blue background bloom */}
      <div className="absolute w-[550px] h-[550px] rounded-full blur-[140px] bg-sky-500/20 animate-pulse-neon pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full blur-[120px] bg-blue-600/20 animate-float-slow pointer-events-none" />

      {/* Modern Center Card */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
        
        {/* Animated MAG Monogram */}
        <div className="relative mb-6 group">
          {/* Rotating neon aura */}
          <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-r from-sky-400 via-blue-600 to-cyan-400 opacity-80 blur-md animate-spin duration-[8000ms]" />
          
          <div className="relative w-20 h-20 rounded-2xl bg-[#080d1a] border border-cyan-400/40 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,210,255,0.4)]">
            <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-white via-sky-200 to-cyan-400">
              MAG
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 mt-0.5">
              STUDIO
            </span>
          </div>
        </div>

        {/* Name & Title */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-600/40 text-xs font-semibold text-sky-200 backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>Web Tasarımı ve Geliştirme</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {ownerName}
          </h1>

          <p className="text-xs sm:text-sm font-medium text-sky-300/80">
            30 Haftalık Müfredat & Google Drive Portalı
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-64 space-y-2">
          <div className="w-full h-1.5 bg-sky-950 rounded-full overflow-hidden p-0.5 border border-sky-800/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-300 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(0,210,255,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-sky-400 font-mono">
            <span className="flex items-center gap-1">
              <Code2 className="w-3 h-3 text-cyan-400" />
              <span>Sistem hazırlanıyor</span>
            </span>
            <span className="font-semibold text-cyan-300">{progress}%</span>
          </div>
        </div>

        {/* Skip button in corner */}
        <button
          onClick={onComplete}
          className="mt-6 text-xs text-sky-400/80 hover:text-cyan-200 transition-colors underline underline-offset-4 cursor-pointer"
        >
          Hızlıca Geç →
        </button>

      </div>
    </div>
  );
};
