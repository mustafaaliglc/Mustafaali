import React from 'react';

interface LaserBorderCardProps {
  children: React.ReactNode;
  neonColorMode?: 'blue' | 'green' | 'off';
  className?: string;
  innerClassName?: string;
  size?: 'normal' | 'sm';
  speed?: 'normal' | 'fast' | 'slow';
  onClick?: () => void;
  active?: boolean;
}

/**
 * LaserBorderCard: Kartın etrafını 360 derece kesintisiz çevreleyen,
 * dönen tam şeritli (multi-stripe laser ring) lazer akış çerçevesi.
 */
export const LaserBorderCard: React.FC<LaserBorderCardProps> = ({
  children,
  neonColorMode = 'blue',
  className = '',
  innerClassName = '',
  size = 'normal',
  speed = 'normal',
  onClick,
  active = true,
}) => {
  if (neonColorMode === 'off') {
    return (
      <div
        onClick={onClick}
        className={`rounded-2xl border border-sky-900/50 bg-[#080d1a] shadow-xl ${className}`}
      >
        <div className={`p-4 sm:p-5 ${innerClassName}`}>
          {children}
        </div>
      </div>
    );
  }

  // Dönen 4'lü / çoklu tam şerit lazer deseni (sürekli parlayan neon çizgileri)
  const laserGradient =
    neonColorMode === 'green'
      ? `conic-gradient(
          from 0deg,
          #00ff9d 0deg,
          #ffffff 18deg,
          rgba(0, 255, 157, 0.4) 38deg,
          rgba(0, 255, 157, 0.08) 60deg,
          rgba(0, 255, 157, 0.7) 90deg,
          #ffffff 108deg,
          rgba(0, 255, 157, 0.3) 128deg,
          rgba(0, 255, 157, 0.08) 150deg,
          #00ff9d 180deg,
          #ffffff 198deg,
          rgba(0, 255, 157, 0.4) 218deg,
          rgba(0, 255, 157, 0.08) 240deg,
          rgba(0, 255, 157, 0.7) 270deg,
          #ffffff 288deg,
          rgba(0, 255, 157, 0.3) 308deg,
          rgba(0, 255, 157, 0.08) 330deg,
          #00ff9d 360deg
        )`
      : `conic-gradient(
          from 0deg,
          #00f0ff 0deg,
          #ffffff 18deg,
          rgba(0, 240, 255, 0.4) 38deg,
          rgba(0, 240, 255, 0.08) 60deg,
          rgba(0, 240, 255, 0.7) 90deg,
          #ffffff 108deg,
          rgba(0, 240, 255, 0.3) 128deg,
          rgba(0, 240, 255, 0.08) 150deg,
          #00f0ff 180deg,
          #ffffff 198deg,
          rgba(0, 240, 255, 0.4) 218deg,
          rgba(0, 240, 255, 0.08) 240deg,
          rgba(0, 240, 255, 0.7) 270deg,
          #ffffff 288deg,
          rgba(0, 240, 255, 0.3) 308deg,
          rgba(0, 240, 255, 0.08) 330deg,
          #00f0ff 360deg
        )`;

  const speedClass =
    speed === 'fast'
      ? 'laser-beam-spin-fast'
      : speed === 'slow'
      ? 'laser-beam-spin-slow'
      : 'laser-beam-spin';

  const wrapperClass = size === 'sm' ? 'laser-card-wrapper-sm' : 'laser-card-wrapper';
  const contentClass = size === 'sm' ? 'laser-card-content-sm' : 'laser-card-content';

  return (
    <div
      onClick={onClick}
      className={`group ${wrapperClass} ${className}`}
    >
      {/* 360 Derece Sürekli Dönen Çoklu Şerit Lazer */}
      <div
        className={`absolute -inset-[300%] ${speedClass} pointer-events-none transition-opacity duration-300 ${
          active ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'
        }`}
        style={{
          background: laserGradient,
        }}
      />

      {/* Kart İçerik Kapsayıcısı */}
      <div className={`${contentClass} ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
};
