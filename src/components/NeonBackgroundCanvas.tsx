import React, { useEffect, useRef } from 'react';

export type NeonColorMode = 'blue' | 'green';

interface NeonBackgroundCanvasProps {
  colorMode?: NeonColorMode;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  glowColor: string;
}

export const NeonBackgroundCanvas: React.FC<NeonBackgroundCanvasProps> = ({
  colorMode = 'blue',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovered: false,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Color Palettes based on selected colorMode
    const palettes: Record<
      NeonColorMode,
      {
        particles: { fill: string; glow: string }[];
        wave1Crest: string;
        wave1Glow: string;
        wave1Fill1: string;
        wave1Fill2: string;
        wave2Crest: string;
        wave2Glow: string;
        wave2Fill1: string;
        wave2Fill2: string;
        mouseGlow1: string;
        mouseGlow2: string;
        laserLines: string;
      }
    > = {
      blue: {
        particles: [
          { fill: 'rgba(0, 240, 255, ', glow: '#00f0ff' },   // Electric Cyan
          { fill: 'rgba(56, 189, 248, ', glow: '#38bdf8' },  // Sky 400
          { fill: 'rgba(0, 112, 243, ', glow: '#0070f3' },   // Electric Blue
          { fill: 'rgba(186, 230, 253, ', glow: '#bae6fd' }, // Ice Blue
        ],
        wave1Crest: 'rgba(0, 240, 255, 0.75)',
        wave1Glow: '#00f0ff',
        wave1Fill1: 'rgba(0, 210, 255, 0.16)',
        wave1Fill2: 'rgba(0, 112, 243, 0.08)',
        wave2Crest: 'rgba(56, 189, 248, 0.65)',
        wave2Glow: '#38bdf8',
        wave2Fill1: 'rgba(56, 189, 248, 0.12)',
        wave2Fill2: 'rgba(2, 132, 199, 0.05)',
        mouseGlow1: 'rgba(0, 220, 255, 0.22)',
        mouseGlow2: 'rgba(0, 112, 243, 0.10)',
        laserLines: 'rgba(0, 240, 255, ',
      },
      green: {
        particles: [
          { fill: 'rgba(0, 255, 157, ', glow: '#00ff9d' },   // Matrix Mint
          { fill: 'rgba(16, 185, 129, ', glow: '#10b981' },  // Emerald 500
          { fill: 'rgba(52, 211, 153, ', glow: '#34d399' },  // Emerald 400
          { fill: 'rgba(167, 243, 208, ', glow: '#a7f3d0' }, // Mint Light
        ],
        wave1Crest: 'rgba(0, 255, 157, 0.75)',
        wave1Glow: '#00ff9d',
        wave1Fill1: 'rgba(0, 255, 157, 0.16)',
        wave1Fill2: 'rgba(16, 185, 129, 0.08)',
        wave2Crest: 'rgba(52, 211, 153, 0.65)',
        wave2Glow: '#34d399',
        wave2Fill1: 'rgba(52, 211, 153, 0.12)',
        wave2Fill2: 'rgba(5, 150, 105, 0.05)',
        mouseGlow1: 'rgba(0, 255, 157, 0.22)',
        mouseGlow2: 'rgba(16, 185, 129, 0.10)',
        laserLines: 'rgba(0, 255, 157, ',
      },
    };

    const activeTheme = palettes[colorMode] || palettes.blue;

    let particles: Particle[] = [];

    const initParticles = () => {
      const count = Math.min(70, Math.floor((width * height) / 14000));
      particles = [];

      for (let i = 0; i < count; i++) {
        const pChoice = activeTheme.particles[Math.floor(Math.random() * activeTheme.particles.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.4 + 1.2,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -Math.random() * 0.7 - 0.25, // Float upwards
          alpha: Math.random() * 0.45 + 0.5,
          color: pChoice.fill,
          glowColor: pChoice.glow,
        });
      }
    };

    initParticles();

    let waveTick = 0;

    const render = () => {
      waveTick += 0.016;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // --- 1. MOUSE AURA SPOTLIGHT ---
      if (mouse.isHovered) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          280
        );
        mouseGlow.addColorStop(0, activeTheme.mouseGlow1);
        mouseGlow.addColorStop(0.5, activeTheme.mouseGlow2);
        mouseGlow.addColorStop(1, 'rgba(4, 6, 12, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // --- 2. VIBRANT SINE WAVES WITH NEON GLOW ---
      // Wave 1: Lower High-Amplitude Wave
      ctx.save();
      ctx.beginPath();
      const waveHeight1 = 55;
      const waveY1 = height * 0.70 + Math.sin(waveTick * 0.8) * 25;

      ctx.moveTo(0, waveY1);
      for (let x = 0; x <= width; x += 18) {
        const distFromMouse = Math.abs(x - mouse.x);
        const mousePull = Math.max(0, 1 - distFromMouse / 380) * 40;
        const y = waveY1 + Math.sin(x * 0.0035 + waveTick) * waveHeight1 - mousePull;
        ctx.lineTo(x, y);
      }

      ctx.shadowBlur = 20;
      ctx.shadowColor = activeTheme.wave1Glow;
      ctx.strokeStyle = activeTheme.wave1Crest;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const grad1 = ctx.createLinearGradient(0, waveY1 - waveHeight1, 0, height);
      grad1.addColorStop(0, activeTheme.wave1Fill1);
      grad1.addColorStop(0.6, activeTheme.wave1Fill2);
      grad1.addColorStop(1, 'rgba(4, 6, 12, 0)');
      ctx.fillStyle = grad1;
      ctx.fill();
      ctx.restore();

      // Wave 2: Mid-Depth Wave
      ctx.save();
      ctx.beginPath();
      const waveHeight2 = 65;
      const waveY2 = height * 0.38 + Math.cos(waveTick * 0.6) * 30;

      ctx.moveTo(0, waveY2);
      for (let x = 0; x <= width; x += 18) {
        const y = waveY2 + Math.cos(x * 0.003 - waveTick * 0.9) * waveHeight2;
        ctx.lineTo(x, y);
      }

      ctx.shadowBlur = 18;
      ctx.shadowColor = activeTheme.wave2Glow;
      ctx.strokeStyle = activeTheme.wave2Crest;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const grad2 = ctx.createLinearGradient(0, waveY2 - waveHeight2, 0, height);
      grad2.addColorStop(0, activeTheme.wave2Fill1);
      grad2.addColorStop(0.7, activeTheme.wave2Fill2);
      grad2.addColorStop(1, 'rgba(4, 6, 12, 0)');
      ctx.fillStyle = grad2;
      ctx.fill();
      ctx.restore();

      // --- 3. CONSTELLATION LASER CONNECTIONS ---
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.55;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${activeTheme.laserLines}${lineAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // --- 4. GLOWING NEON PARTICLES ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (mouse.isHovered) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < 170) {
            const force = (1 - mDist / 170) * 1.8;
            p.x += (mdx / mDist) * force;
            p.y += (mdy / mDist) * force;
          }
        }

        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        ctx.save();
        ctx.shadowBlur = 16;
        ctx.shadowColor = p.glowColor;

        // Outer halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3.0, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha * 0.55})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [colorMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none w-full h-full z-0"
    />
  );
};
