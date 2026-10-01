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
        
        {/* Circular School Logo */}
        <div className="relative mb-6">
          {/* Subtle Ambient Backlight */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-blue-600/40 via-cyan-400/35 to-sky-500/40 blur-2xl opacity-75 animate-pulse-neon pointer-events-none" />

          {/* Clean Round Logo */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-[0_0_35px_rgba(0,210,255,0.5)] border-2 border-cyan-400/50 bg-[#070b16] flex items-center justify-center transition-transform duration-300 hover:scale-105">
            <img
              src="/okul-logo.png"
              alt="Okul Logosu"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Title Typography */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-400 pl-[0.15em] drop-shadow-[0_0_30px_rgba(0,220,255,0.7)]">
            {ownerName}
          </h1>

          {/* Minimalist Subtitle */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-cyan-400/50" />
            <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-cyan-300 uppercase pl-[0.25em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              30 Haftalık Web Tasarımı Programı
            </p>
            <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-cyan-400/50" />
          </div>
        </div>

      </div>
    </div>
  );
};
