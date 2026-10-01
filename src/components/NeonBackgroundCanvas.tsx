import React, { useEffect, useRef } from 'react';

export type NeonColorMode = 'blue';

interface NeonBackgroundCanvasProps {
  colorMode?: NeonColorMode;
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
      isHovered: true,
      hasMoved: false,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovered = true;
      mouse.hasMoved = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.isHovered = true;
        mouse.hasMoved = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // Color Palettes for the mouse spotlight (Electric Blue only)
    const activeTheme = {
      core: 'rgba(0, 240, 255, 0.28)',     // Electric Cyan Core
      mid: 'rgba(0, 120, 255, 0.14)',      // Electric Blue Mid
      outer: 'rgba(2, 6, 23, 0)',          // Fade out to transparent
      accentCore: 'rgba(255, 255, 255, 0.4)', // Bright micro center
    };

    const render = () => {
      // Smooth interpolation for liquid mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // Only draw the mouse tracking spotlight (pure, clean cursor light without background clutter)
      if (mouse.isHovered || !mouse.hasMoved) {
        // 1. Broad Ambient Spotlight
        const radius = Math.min(380, Math.max(260, width * 0.28));
        const mouseGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          radius
        );
        mouseGlow.addColorStop(0, activeTheme.core);
        mouseGlow.addColorStop(0.45, activeTheme.mid);
        mouseGlow.addColorStop(1, activeTheme.outer);

        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, width, height);

        // 2. Focused Subtle Cursor Core Aura
        const coreGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          70
        );
        coreGlow.addColorStop(0, activeTheme.accentCore);
        coreGlow.addColorStop(0.35, activeTheme.core);
        coreGlow.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 70, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
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
