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

  useEffect(() => {
    // Start fade-out after 2.2 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2200);

    // Completely unmount after fade-out transition finishes
    const finishTimer = setTimeout(() => {
      onComplete();
    }, 2900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 350);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#020716] overflow-hidden cursor-pointer select-none transition-all duration-700 ease-out ${
        isFadingOut
          ? 'opacity-0 scale-105 pointer-events-none blur-md'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Deep Dark Navy Blue Gradient Radial Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0a1a38_0%,_#040c1e_45%,_#020612_100%)] pointer-events-none" />

      {/* Atmospheric Neon Sapphire & Electric Cyan Glow Auroras */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-cyan-500/12 blur-[140px] pointer-events-none animate-pulse-neon" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />

      {/* Center Iconic Minimalist Branding */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        
        {/* Custom Refined Geometric Vector Emblem */}
        <div className="relative mb-6">
          {/* Subtle Ambient Backlight */}
          <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-blue-600/40 via-cyan-400/40 to-sky-500/40 blur-2xl opacity-70 animate-pulse-neon" />

          {/* SVG Futuristic Shield / Monogram Emblem */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
            <svg
              viewBox="0 0 140 140"
              className="w-full h-full drop-shadow-[0_0_25px_rgba(0,220,255,0.65)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#38bdf8" />
                  <stop offset="75%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>

                <linearGradient id="accentCyan" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>

                <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                </linearGradient>

                <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0b1e3d" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#030b18" stopOpacity="0.98" />
                </linearGradient>
              </defs>

              {/* Outer Precision Hexagon Orbit */}
              <polygon
                points="70,10 122,40 122,100 70,130 18,100 18,40"
                stroke="url(#accentCyan)"
                strokeWidth="1.2"
                strokeDasharray="5 4"
                className="opacity-40"
              />

              {/* Outer Shield Chamfered Polygon Base */}
              <polygon
                points="70,18 114,43 114,97 70,122 26,97 26,43"
                stroke="url(#shieldGrad)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                fill="url(#shieldBg)"
              />

              {/* Geometric 'M' - Sleek Angled Pillars */}
              <path
                d="M42 90 L42 50 L70 75 L98 50 L98 90"
                stroke="url(#shieldGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Apex Triangle / Letter 'A' Form */}
              <path
                d="M55 80 L70 45 L85 80"
                stroke="url(#accentCyan)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 'G' Dynamic Energy Lower Arc */}
              <path
                d="M58 80 L82 80 L82 66 L70 66"
                stroke="url(#goldGlow)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Central Glowing Core Spark */}
              <circle
                cx="70"
                cy="60"
                r="3.5"
                fill="#00f0ff"
                className="animate-ping duration-1000"
              />
              <circle
                cx="70"
                cy="60"
                r="2.5"
                fill="#ffffff"
              />

              {/* Micro Corner Accent Dots */}
              <circle cx="70" cy="24" r="1.5" fill="#38bdf8" />
              <circle cx="108" cy="46" r="1.5" fill="#38bdf8" />
              <circle cx="108" cy="94" r="1.5" fill="#38bdf8" />
              <circle cx="70" cy="116" r="1.5" fill="#38bdf8" />
              <circle cx="32" cy="94" r="1.5" fill="#38bdf8" />
              <circle cx="32" cy="46" r="1.5" fill="#38bdf8" />
            </svg>
          </div>
        </div>

        {/* MAG Bold Monogram Typography */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-400 pl-[0.35em] drop-shadow-[0_0_30px_rgba(0,220,255,0.7)]">
            MAG
          </h1>

          {/* Minimalist Subtitle Name */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-cyan-400/50" />
            <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-slate-300 uppercase pl-[0.25em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {ownerName}
            </p>
            <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-cyan-400/50" />
          </div>
        </div>

      </div>
    </div>
  );
};
