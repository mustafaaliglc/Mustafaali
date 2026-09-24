import React, { useEffect, useState } from 'react';

interface OpeningAnimationProps {
  ownerName?: string;
  onComplete: () => void;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({
  ownerName = 'Mustafa Ali Güleç',
  onComplete,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mount trigger for smooth entry transition
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    // Smooth fade out timer
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2200);

    // Complete and unmount timer
    const finishTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#03050c] overflow-hidden cursor-pointer select-none transition-all duration-800 ease-out ${
        isFadingOut
          ? 'opacity-0 scale-105 pointer-events-none blur-md'
          : isMounted
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95'
      }`}
    >
      {/* Ambient Neon Atmosphere Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none animate-pulse-neon" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />

      {/* Subtle Background Radial Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />

      {/* Center Iconic Minimalist Branding */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        
        {/* Custom Bespoke Geometric Vector Logo */}
        <div className="relative mb-6 group">
          {/* Pulsing Neon Backlight Aura */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 opacity-60 blur-2xl animate-pulse-neon" />

          {/* SVG Futuristic Emblem */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            <svg
              viewBox="0 0 120 120"
              className="w-full h-full drop-shadow-[0_0_30px_rgba(0,240,255,0.7)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="magGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="magGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="60%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              {/* Outer Hexagon Orbit Path */}
              <polygon
                points="60,6 106,32 106,88 60,114 14,88 14,32"
                stroke="url(#neonGlow)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-40"
              />

              {/* Inner Diamond / Core Shield Frame */}
              <polygon
                points="60,14 100,36 100,84 60,106 20,84 20,36"
                stroke="url(#magGrad1)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                fill="#050a17"
                fillOpacity="0.85"
              />

              {/* Stylized Geometric 'M' Monogram Structure */}
              <path
                d="M34 76 L34 44 L60 66 L86 44 L86 76"
                stroke="url(#magGrad1)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Central Energy Apex (Letter A / Compass Peak) */}
              <path
                d="M48 68 L60 38 L72 68"
                stroke="url(#magGrad2)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Central Glowing Core Orb */}
              <circle
                cx="60"
                cy="58"
                r="3.5"
                fill="#00f0ff"
                className="animate-ping duration-1000"
              />
              <circle
                cx="60"
                cy="58"
                r="3"
                fill="#ffffff"
              />
            </svg>
          </div>
        </div>

        {/* MAG Bold Modern Typography with Neon Glow */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-400 pl-[0.35em] drop-shadow-[0_0_25px_rgba(0,240,255,0.7)] transition-all">
            MAG
          </h1>

          {/* Prompt Style Modern Typography - Name & Title */}
          <div className="flex flex-col items-center gap-1.5 pt-1">
            <p className="text-base sm:text-lg font-bold tracking-[0.2em] text-slate-100 uppercase pl-[0.2em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {ownerName}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-medium tracking-[0.15em] text-cyan-300/90 uppercase pl-[0.15em]">
                Kişisel Gelişim Portalı
              </span>
            </div>
          </div>
        </div>

        {/* Minimalist touch hint at the bottom */}
        <p className="mt-12 text-[11px] font-mono tracking-widest text-sky-400/40 uppercase animate-pulse">
          [ Başlamak için tıkla ]
        </p>

      </div>
    </div>
  );
};
