import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  FolderCheck, 
  CheckCircle2, 
  ArrowRight,
  Cpu,
  Zap,
  Globe,
  Compass,
  Award
} from 'lucide-react';
import { LaserBorderCard } from './LaserBorderCard';

interface OpeningAnimationProps {
  ownerName?: string;
  onComplete: () => void;
}

const BOOT_STEPS = [
  { id: 1, text: 'Kişisel Gelişim Modülleri Başlatılıyor...', icon: Cpu, progress: 25 },
  { id: 2, text: '30 Haftalık Yol Haritası ve Ders Planı Yükleniyor...', icon: Layers, progress: 55 },
  { id: 3, text: 'Google Drive & Çalışma Kaynakları Senkronize Ediliyor...', icon: FolderCheck, progress: 85 },
  { id: 4, text: 'Kişisel Gelişim Portalı Hazır!', icon: Zap, progress: 100 },
];

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({
  ownerName = 'Mustafa Ali Güleç',
  onComplete,
}) => {
  const [progress, setProgress] = useState(15);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Dynamic progressive boot sequence with smooth easing
    const t1 = setTimeout(() => {
      setProgress(40);
      setActiveStepIndex(1);
    }, 400);

    const t2 = setTimeout(() => {
      setProgress(75);
      setActiveStepIndex(2);
    }, 850);

    const t3 = setTimeout(() => {
      setProgress(95);
      setActiveStepIndex(3);
    }, 1300);

    const t4 = setTimeout(() => {
      setProgress(100);
    }, 1650);

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2100);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  const handleInstantEnter = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 350);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#030611]/95 backdrop-blur-2xl overflow-hidden transition-all duration-700 ease-in-out ${
        isFadingOut 
          ? 'opacity-0 scale-105 pointer-events-none blur-md transition-opacity duration-700' 
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-35 pointer-events-none" />

      {/* Atmospheric Neon Blooms */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full bg-cyan-500/15 blur-[170px] pointer-events-none animate-pulse-neon" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-blue-600/20 blur-[140px] pointer-events-none animate-float-slow" />

      {/* Cyber Scanline Effect */}
      <div className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent pointer-events-none scanline-effect" />

      {/* Rotating Cyber Neon Rings in Background */}
      <div className="absolute w-[520px] h-[520px] rounded-full border border-cyan-500/15 animate-spin duration-[25000ms] pointer-events-none hidden sm:block" />
      <div className="absolute w-[680px] h-[680px] rounded-full border border-dashed border-sky-400/15 animate-spin duration-[40000ms] pointer-events-none hidden sm:block" />

      {/* Central Futuristic Hologram Glass Card */}
      <div className="relative z-10 w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-700">
        <LaserBorderCard
          neonColorMode="blue"
          speed="fast"
          active={true}
          className="shadow-[0_0_90px_rgba(0,210,255,0.3)]"
          innerClassName="p-6 sm:p-8 bg-[#060b18]/95 backdrop-blur-3xl border border-cyan-400/40 text-center flex flex-col items-center"
        >
          {/* Top Status Header */}
          <div className="w-full flex items-center justify-between pb-3.5 border-b border-sky-900/50 text-[10px] font-mono text-sky-400/80 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">ONLINE</span>
              <span className="text-sky-700">|</span>
              <span>MAG PLATFORM 3.0</span>
            </div>

            <div className="flex items-center gap-1 text-cyan-300">
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin duration-3000" />
              <span>YOL HARİTASI</span>
            </div>
          </div>

          {/* Glowing MAG Holographic Monogram */}
          <div className="relative my-5 group">
            {/* Pulsing Neon Halo */}
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-300 opacity-80 blur-xl animate-pulse-neon group-hover:opacity-100 transition-opacity" />
            
            <div className="relative w-22 h-22 rounded-2xl bg-[#050914] border-2 border-cyan-400/90 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,210,255,0.6)] transform transition-transform group-hover:scale-105">
              <span className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-white via-sky-100 to-cyan-400 drop-shadow-[0_0_15px_rgba(0,210,255,0.9)]">
                MAG
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-cyan-300 bg-cyan-950/90 px-2 py-0.5 rounded border border-cyan-400/50 mt-1 shadow-[0_0_8px_rgba(0,210,255,0.4)]">
                STUDIO
              </span>
            </div>
          </div>

          {/* Neon Hero Title: Mustafa Ali Güleç - Kişisel Gelişim Portalı */}
          <div className="space-y-2 mb-5 text-center">
            {/* Neon Glowing Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/60 text-xs font-bold text-cyan-300 shadow-[0_0_20px_rgba(0,210,255,0.35)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span className="tracking-wide">Kişisel Gelişim Portalı</span>
            </div>

            {/* Neon Glowing Name */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_0_25px_rgba(0,210,255,0.6)]">
              {ownerName}
            </h1>

            {/* Combined Neon Banner */}
            <p className="text-xs sm:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyan-300 to-blue-200 drop-shadow-[0_0_12px_rgba(0,210,255,0.4)]">
              Mustafa Ali Güleç - Kişisel Gelişim Portalı
            </p>

            <p className="text-[11px] text-sky-300/70 max-w-sm mx-auto pt-0.5">
              30 Haftalık Web Tasarımı, Yazılım Müfredatı & Google Drive Bulut Alanı
            </p>
          </div>

          {/* Technology Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5">
            <span className="text-[10px] font-semibold text-sky-200 bg-sky-950/70 border border-sky-800/60 px-2.5 py-0.5 rounded-lg shadow-[0_0_10px_rgba(56,189,248,0.15)]">
              HTML5 & CSS3
            </span>
            <span className="text-[10px] font-semibold text-cyan-200 bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-0.5 rounded-lg shadow-[0_0_10px_rgba(0,210,255,0.15)]">
              JavaScript & React
            </span>
            <span className="text-[10px] font-semibold text-emerald-200 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 rounded-lg shadow-[0_0_10px_rgba(52,211,153,0.15)]">
              Drive Bulut
            </span>
            <span className="text-[10px] font-semibold text-blue-200 bg-blue-950/70 border border-blue-800/60 px-2.5 py-0.5 rounded-lg shadow-[0_0_10px_rgba(96,165,250,0.15)]">
              30 Hafta Planı
            </span>
          </div>

          {/* Futuristic Live Boot Sequence Progress HUD */}
          <div className="w-full bg-[#040814]/90 border border-cyan-500/30 rounded-xl p-3.5 mb-5 text-left space-y-2.5 shadow-[inset_0_0_20px_rgba(0,210,255,0.05)]">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-sky-200 truncate">
                {React.createElement(BOOT_STEPS[activeStepIndex].icon, {
                  className: 'w-4 h-4 text-cyan-400 animate-pulse shrink-0',
                })}
                <span className="truncate font-medium">
                  {BOOT_STEPS[activeStepIndex].text}
                </span>
              </div>
              <span className="font-bold text-cyan-300 text-sm pl-2 shrink-0 drop-shadow-[0_0_8px_rgba(0,210,255,0.6)]">
                {progress}%
              </span>
            </div>

            {/* Glowing Cyber Progress Bar */}
            <div className="relative w-full h-2 bg-black/80 rounded-full overflow-hidden p-0.5 border border-cyan-800/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-300 transition-all duration-300 ease-out shadow-[0_0_14px_rgba(0,210,255,0.9)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Micro Diagnostic Status */}
            <div className="flex items-center justify-between text-[10px] font-mono text-sky-400/80 pt-0.5">
              <span>GECİKME: 12ms</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Güvenli Bağlantı Doğrulandı</span>
              </span>
            </div>
          </div>

          {/* Quick Enter Action Button */}
          <button
            onClick={handleInstantEnter}
            className="w-full group btn-electric text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all duration-200 cursor-pointer"
          >
            <span>Portala Giriş Yap</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
          </button>
        </LaserBorderCard>
      </div>
    </div>
  );
};
