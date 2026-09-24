import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Code2, 
  Layers, 
  FolderCheck, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Zap,
  Globe
} from 'lucide-react';
import { LaserBorderCard } from './LaserBorderCard';

interface OpeningAnimationProps {
  ownerName: string;
  onComplete: () => void;
}

const BOOT_STEPS = [
  { id: 1, text: 'Sistem Çekirdeği Başlatılıyor...', icon: Cpu, progress: 25 },
  { id: 2, text: '30 Haftalık Web Tasarımı Müfredatı Yükleniyor...', icon: Layers, progress: 55 },
  { id: 3, text: 'Google Drive Bulut Bağlantıları Doğrulanıyor...', icon: FolderCheck, progress: 85 },
  { id: 4, text: 'Siber Arayüz ve Çalışma Alanı Hazır!', icon: Zap, progress: 100 },
];

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({
  ownerName,
  onComplete,
}) => {
  const [progress, setProgress] = useState(10);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Dynamic progressive boot sequence
    const t1 = setTimeout(() => {
      setProgress(35);
      setActiveStepIndex(1);
    }, 300);

    const t2 = setTimeout(() => {
      setProgress(70);
      setActiveStepIndex(2);
    }, 700);

    const t3 = setTimeout(() => {
      setProgress(95);
      setActiveStepIndex(3);
    }, 1100);

    const t4 = setTimeout(() => {
      setProgress(100);
    }, 1400);

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1750);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 2150);

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
    setTimeout(onComplete, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#040711] overflow-hidden transition-all duration-500 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none blur-sm' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* Futuristic Radial Glow Blooms */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/15 blur-[160px] pointer-events-none animate-pulse-neon" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none animate-float-slow" />

      {/* Cyber Scanline Effect */}
      <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none scanline-effect" />

      {/* Ambient Cyber Rings in Background */}
      <div className="absolute w-[500px] h-[500px] rounded-full border border-cyan-500/10 animate-spin duration-[25000ms] pointer-events-none hidden sm:block" />
      <div className="absolute w-[650px] h-[650px] rounded-full border border-dashed border-sky-400/10 animate-spin duration-[40000ms] pointer-events-none hidden sm:block" />

      {/* Center Interactive Futuristic HUD Container */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <LaserBorderCard
          neonColorMode="blue"
          speed="fast"
          active={true}
          className="shadow-[0_0_80px_rgba(0,210,255,0.25)]"
          innerClassName="p-6 sm:p-8 bg-[#070c1a]/95 backdrop-blur-2xl border border-cyan-500/30 text-center flex flex-col items-center"
        >
          {/* Top Status Header */}
          <div className="w-full flex items-center justify-between pb-4 border-b border-sky-900/40 text-[10px] font-mono text-sky-400/80 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">ONLINE</span>
              <span className="text-sky-700">|</span>
              <span>VERSIYON 3.0</span>
            </div>

            <div className="flex items-center gap-1 text-cyan-300">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>WEB TASARIMI</span>
            </div>
          </div>

          {/* Glowing MAG Holographic Monogram */}
          <div className="relative my-6 group">
            {/* Pulsing Neon Halo */}
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-300 opacity-75 blur-lg animate-pulse-neon group-hover:opacity-100 transition-opacity" />
            
            <div className="relative w-24 h-24 rounded-2xl bg-[#050914] border-2 border-cyan-400/80 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(0,210,255,0.5)] transform transition-transform group-hover:scale-105">
              <span className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-white via-sky-100 to-cyan-400 drop-shadow-[0_2px_10px_rgba(0,210,255,0.8)]">
                MAG
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 mt-1">
                STUDIO
              </span>
            </div>
          </div>

          {/* Instructor & Curriculum Title */}
          <div className="space-y-1.5 mb-5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-[11px] font-bold text-cyan-300 shadow-[0_0_15px_rgba(0,210,255,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin duration-3000" />
              <span>30 Haftalık İnteraktif Web Tasarım Müfredatı</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white pt-1">
              {ownerName}
            </h1>

            <p className="text-xs font-medium text-sky-300/80 max-w-sm mx-auto">
              Google Drive Cloud Entegrasyonu & Dinamik Ders Planı Portalı
            </p>
          </div>

          {/* Interactive Technology Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="text-[10px] font-semibold text-sky-200 bg-sky-950/60 border border-sky-800/60 px-2.5 py-1 rounded-lg">
              HTML5 / CSS3
            </span>
            <span className="text-[10px] font-semibold text-cyan-200 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-lg">
              JavaScript & DOM
            </span>
            <span className="text-[10px] font-semibold text-emerald-200 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
              Drive Senkronu
            </span>
            <span className="text-[10px] font-semibold text-blue-200 bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-lg">
              30 Hafta Planı
            </span>
          </div>

          {/* Futuristic Live Boot Sequence Progress HUD */}
          <div className="w-full bg-[#050914]/80 border border-sky-900/60 rounded-xl p-3.5 mb-5 text-left space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-sky-300 truncate">
                {React.createElement(BOOT_STEPS[activeStepIndex].icon, {
                  className: 'w-4 h-4 text-cyan-400 animate-pulse shrink-0',
                })}
                <span className="truncate font-medium">
                  {BOOT_STEPS[activeStepIndex].text}
                </span>
              </div>
              <span className="font-bold text-cyan-300 text-sm pl-2 shrink-0">
                {progress}%
              </span>
            </div>

            {/* Glowing Cyber Progress Bar */}
            <div className="relative w-full h-2 bg-black/70 rounded-full overflow-hidden p-0.5 border border-sky-800/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-300 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(0,210,255,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Micro Diagnostic Status */}
            <div className="flex items-center justify-between text-[10px] font-mono text-sky-400/70 pt-0.5">
              <span>PING: 12ms</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>SSL Güvenli Bağlantı</span>
              </span>
            </div>
          </div>

          {/* Quick Enter Action Button */}
          <button
            onClick={handleInstantEnter}
            className="w-full group btn-electric text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer"
          >
            <span>Portala Giriş Yap</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
          </button>
        </LaserBorderCard>
      </div>
    </div>
  );
};
