import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'mai' | 'dao' | 'single_mai' | 'single_dao';
  rotation: number;
  rotSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  opacity: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

interface TetBlossomCanvasProps {
  variant?: 'hero' | 'subtle';
  className?: string;
}

export const TetBlossomCanvas: React.FC<TetBlossomCanvasProps> = ({
  variant = 'hero',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isSubtle = variant === 'subtle';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isSubtle = variant === 'subtle';
    const petalCount = isSubtle ? 16 : 40;

    // Initialize festive petals
    const petals: Petal[] = Array.from({ length: petalCount }, () => {
      const types: Petal['type'][] = ['mai', 'dao', 'single_mai', 'single_dao'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: -0.3 + Math.random() * 0.6,
        vy: isSubtle ? 0.4 + Math.random() * 0.6 : 0.7 + Math.random() * 1.2,
        size: isSubtle ? 8 + Math.random() * 9 : 10 + Math.random() * 14,
        type: chosenType,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.015 + Math.random() * 0.025,
        opacity: isSubtle ? 0.35 + Math.random() * 0.35 : 0.75 + Math.random() * 0.25,
      };
    });

    // Fireworks sparks burst array
    let sparks: Spark[] = [];
    let fireworkTimer = 0;

    const createFirework = (bx: number, by: number) => {
      const colors = ['#f59e0b', '#ef4444', '#fbbf24', '#f43f5e', '#fef08a'];
      for (let i = 0; i < 28; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 3.2;
        sparks.push({
          x: bx,
          y: by,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 1.5 + Math.random() * 2,
        });
      }
    };

    // Draw single 5-petal Hoa Mai (Yellow Apricot)
    const drawHoaMai = (x: number, y: number, size: number, rot: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;

      // 5 Rounded Golden Petals
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.5, size * 0.35, size * 0.55, 0, 0, Math.PI * 2);
        const petalGrad = ctx.createRadialGradient(0, -size * 0.5, 1, 0, -size * 0.5, size * 0.55);
        petalGrad.addColorStop(0, '#fef08a');
        petalGrad.addColorStop(0.65, '#facc15');
        petalGrad.addColorStop(1, '#eab308');
        ctx.fillStyle = petalGrad;
        ctx.shadowColor = 'rgba(234, 179, 8, 0.4)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      }

      // Red-orange pistil center with stamens
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = '#ea580c';
      ctx.fill();

      // Gold stamen dots
      for (let j = 0; j < 5; j++) {
        const a = (j * Math.PI * 2) / 5;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * (size * 0.2), Math.sin(a) * (size * 0.2), size * 0.06, 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.fill();
      }

      ctx.restore();
    };

    // Draw 5-petal Hoa Đào (Pink Peach Blossom)
    const drawHoaDao = (x: number, y: number, size: number, rot: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;

      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.5, size * 0.34, size * 0.56, 0, 0, Math.PI * 2);
        const petalGrad = ctx.createRadialGradient(0, -size * 0.5, 1, 0, -size * 0.5, size * 0.56);
        petalGrad.addColorStop(0, '#fce7f3');
        petalGrad.addColorStop(0.6, '#f472b6');
        petalGrad.addColorStop(1, '#db2777');
        ctx.fillStyle = petalGrad;
        ctx.shadowColor = 'rgba(219, 39, 119, 0.35)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      }

      // Center crimson pistil
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#be123c';
      ctx.fill();

      // Delicate yellow stamen dots
      for (let j = 0; j < 5; j++) {
        const a = (j * Math.PI * 2) / 5;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * (size * 0.18), Math.sin(a) * (size * 0.18), size * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.fill();
      }

      ctx.restore();
    };

    // Draw single petal fluttering in 3D
    const drawSinglePetal = (x: number, y: number, size: number, rot: number, alpha: number, isMai: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;

      // 3D tilt perspective squash
      const tiltScaleY = Math.abs(Math.sin(rot * 2)) * 0.6 + 0.4;
      ctx.scale(1, tiltScaleY);

      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.bezierCurveTo(size * 0.4, -size * 0.4, size * 0.5, size * 0.3, 0, size * 0.6);
      ctx.bezierCurveTo(-size * 0.5, size * 0.3, -size * 0.4, -size * 0.4, 0, -size * 0.7);
      ctx.closePath();

      if (isMai) {
        const grad = ctx.createLinearGradient(0, -size * 0.7, 0, size * 0.6);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.5, '#facc15');
        grad.addColorStop(1, '#ca8a04');
        ctx.fillStyle = grad;
      } else {
        const grad = ctx.createLinearGradient(0, -size * 0.7, 0, size * 0.6);
        grad.addColorStop(0, '#fce7f3');
        grad.addColorStop(0.5, '#f472b6');
        grad.addColorStop(1, '#e11d48');
        ctx.fillStyle = grad;
      }
      ctx.fill();
      ctx.restore();
    };

    let step = 0;

    const render = () => {
      step++;
      ctx.clearRect(0, 0, width, height);

      // Random gentle firework burst (only in hero mode)
      if (!isSubtle) {
        fireworkTimer++;
        if (fireworkTimer > 180) {
          fireworkTimer = 0;
          const fx = width * 0.3 + Math.random() * (width * 0.6);
          const fy = height * 0.15 + Math.random() * (height * 0.35);
          createFirework(fx, fy);
        }
      }

      // Update & render fireworks sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.04; // subtle gravity
        s.alpha -= 0.016;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // Update and render petals
      petals.forEach((p) => {
        p.swayPhase += p.swaySpeed;
        p.rotation += p.rotSpeed;
        p.x += p.vx + Math.sin(p.swayPhase) * 0.8;
        p.y += p.vy;

        // Wrap around smoothly
        if (p.y > height + 40) {
          p.y = -30;
          p.x = Math.random() * width;
        }
        if (p.x < -40) p.x = width + 30;
        if (p.x > width + 40) p.x = -30;

        if (p.type === 'mai') {
          drawHoaMai(p.x, p.y, p.size, p.rotation, p.opacity);
        } else if (p.type === 'dao') {
          drawHoaDao(p.x, p.y, p.size, p.rotation, p.opacity);
        } else if (p.type === 'single_mai') {
          drawSinglePetal(p.x, p.y, p.size, p.rotation, p.opacity, true);
        } else {
          drawSinglePetal(p.x, p.y, p.size, p.rotation, p.opacity, false);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${isSubtle ? 'z-0' : 'z-10'} ${className}`}
      style={{ mixBlendMode: 'normal' }}
    />
  );
};
