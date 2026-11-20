import React, { useEffect, useRef } from 'react';

interface RealisticPetal {
  x: number;
  y: number;
  z: number; // 0 (far background) to 1 (close foreground)
  size: number;
  vx: number;
  vy: number;
  type: 'dao' | 'mai' | 'dao_flower' | 'mai_flower';
  // 3D rotation angles
  pitch: number;      // tip forward/backward (squash Y)
  pitchSpeed: number;
  yaw: number;        // rotate along surface
  yawSpeed: number;
  roll: number;       // tumble angle
  rollSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmp: number;
  opacity: number;
}

interface TetBlossomCanvasProps {
  variant?: 'hero' | 'subtle';
  className?: string;
  enableInteractiveWind?: boolean;
}

export const TetBlossomCanvas: React.FC<TetBlossomCanvasProps> = ({
  variant = 'subtle',
  className = '',
  enableInteractiveWind = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    // Realistic density: rich yet not distracting
    const petalCount = isSubtle ? 32 : 55;

    // Mouse / Cursor wind interaction
    let mouseX = -1000;
    let mouseY = -1000;
    let mouseVx = 0;
    let mouseVy = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;
      mouseVx = curX - lastMouseX;
      mouseVy = curY - lastMouseY;
      lastMouseX = mouseX = curX;
      lastMouseY = mouseY = curY;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      // Spawn a gentle swirl of 6 fresh petals near the click
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 10 + Math.random() * 40;
        petals.push(createPetal(clickX + Math.cos(angle) * dist, clickY + Math.sin(angle) * dist, false));
      }
    };

    if (enableInteractiveWind) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('click', handleClick, { passive: true });
    }

    const createPetal = (startX?: number, startY?: number, randomizeY = true): RealisticPetal => {
      const z = Math.random(); // depth: 0 = far, 1 = near
      const isMai = Math.random() > 0.65; // 65% Hoa Đào (Pink), 35% Hoa Mai (Gold)
      const isWholeFlower = Math.random() < 0.12; // 12% chance for full 5-petal flower

      let type: RealisticPetal['type'] = isMai ? 'mai' : 'dao';
      if (isWholeFlower) {
        type = isMai ? 'mai_flower' : 'dao_flower';
      }

      const baseSize = isSubtle ? 9 + z * 10 : 12 + z * 14;

      return {
        x: startX !== undefined ? startX : Math.random() * width,
        y: startY !== undefined ? startY : (randomizeY ? Math.random() * height : -30 - Math.random() * 40),
        z,
        size: baseSize,
        vx: (-0.3 + Math.random() * 0.6) * (0.8 + z * 0.6),
        vy: (0.45 + Math.random() * 0.75) * (0.7 + z * 0.7),
        type,
        pitch: Math.random() * Math.PI * 2,
        pitchSpeed: 0.015 + Math.random() * 0.03,
        yaw: Math.random() * Math.PI * 2,
        yawSpeed: (Math.random() - 0.5) * 0.025,
        roll: Math.random() * Math.PI * 2,
        rollSpeed: 0.01 + Math.random() * 0.02,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.018 + Math.random() * 0.025,
        swayAmp: 0.8 + z * 1.4,
        opacity: isSubtle ? 0.35 + z * 0.45 : 0.6 + z * 0.38,
      };
    };

    const petals: RealisticPetal[] = Array.from({ length: petalCount }, () => createPetal());

    // Draw Realistic Single Petal with True 3D Tumbling & Shading
    const drawPetal = (p: RealisticPetal) => {
      ctx.save();
      ctx.translate(p.x, p.y);

      // 3D Pitch (tumbling over on horizontal axis)
      const cosPitch = Math.cos(p.pitch);
      const sinPitch = Math.sin(p.pitch);
      const isFrontFace = cosPitch >= 0;
      const squashY = Math.max(0.08, Math.abs(cosPitch)); // edge-on perspective squash

      ctx.rotate(p.yaw);
      ctx.scale(1, squashY);
      ctx.rotate(p.roll * 0.3);

      ctx.globalAlpha = p.opacity;

      const s = p.size;
      const isMai = p.type === 'mai';

      // Authentic Curved Petal Path with Notch at Crown
      ctx.beginPath();
      ctx.moveTo(0, s * 0.65); // base / stem point
      // Left contour with natural bulge
      ctx.bezierCurveTo(-s * 0.45, s * 0.25, -s * 0.52, -s * 0.2, -s * 0.28, -s * 0.6);
      // Gentle notch at petal apex
      ctx.bezierCurveTo(-s * 0.1, -s * 0.68, 0, -s * 0.55, 0, -s * 0.55);
      ctx.bezierCurveTo(0, -s * 0.55, s * 0.1, -s * 0.68, s * 0.28, -s * 0.6);
      // Right contour
      ctx.bezierCurveTo(s * 0.52, -s * 0.2, s * 0.45, s * 0.25, 0, s * 0.65);
      ctx.closePath();

      // Shading based on Front vs Back face of petal
      if (isMai) {
        // Vietnamese Hoa Mai (Golden Apricot)
        const grad = ctx.createLinearGradient(0, -s * 0.65, 0, s * 0.65);
        if (isFrontFace) {
          grad.addColorStop(0, '#fef08a');   // Soft luminous yellow tip
          grad.addColorStop(0.45, '#facc15'); // Rich golden yellow
          grad.addColorStop(0.85, '#eab308'); // Amber gold
          grad.addColorStop(1, '#ca8a04');   // Warm orange base
        } else {
          // Back face slightly paler
          grad.addColorStop(0, '#fef9c3');
          grad.addColorStop(0.5, '#fde047');
          grad.addColorStop(1, '#d97706');
        }
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(234, 179, 8, 0.25)';
        ctx.shadowBlur = 3;
      } else {
        // Vietnamese Hoa Đào (Pink Peach Blossom)
        const grad = ctx.createLinearGradient(0, -s * 0.65, 0, s * 0.65);
        if (isFrontFace) {
          grad.addColorStop(0, '#fff1f2');   // Translucent white-pink apex
          grad.addColorStop(0.35, '#fbcfe8'); // Delicate peach pink
          grad.addColorStop(0.75, '#f43f5e'); // Rich vivid rose
          grad.addColorStop(1, '#be123c');   // Crimson stem attachment
        } else {
          // Back face softer pastel
          grad.addColorStop(0, '#fff5f7');
          grad.addColorStop(0.4, '#f9a8d4');
          grad.addColorStop(1, '#e11d48');
        }
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(244, 63, 94, 0.25)';
        ctx.shadowBlur = 3;
      }

      ctx.fill();

      // Delicate Central Vein highlight
      ctx.beginPath();
      ctx.moveTo(0, s * 0.5);
      ctx.quadraticCurveTo(s * 0.05, 0, 0, -s * 0.35);
      ctx.strokeStyle = isMai ? 'rgba(254, 240, 138, 0.45)' : 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = Math.max(0.6, s * 0.05);
      ctx.stroke();

      ctx.restore();
    };

    // Draw Realistic 5-Petal Whole Blossom
    const drawWholeFlower = (p: RealisticPetal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.yaw);
      ctx.globalAlpha = p.opacity;

      const s = p.size * 0.9;
      const isMai = p.type === 'mai_flower';

      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 5);

        ctx.beginPath();
        ctx.ellipse(0, -s * 0.5, s * 0.32, s * 0.52, 0, 0, Math.PI * 2);

        if (isMai) {
          const grad = ctx.createRadialGradient(0, -s * 0.5, 1, 0, -s * 0.5, s * 0.52);
          grad.addColorStop(0, '#fef08a');
          grad.addColorStop(0.6, '#facc15');
          grad.addColorStop(1, '#ca8a04');
          ctx.fillStyle = grad;
        } else {
          const grad = ctx.createRadialGradient(0, -s * 0.5, 1, 0, -s * 0.5, s * 0.52);
          grad.addColorStop(0, '#fce7f3');
          grad.addColorStop(0.55, '#f472b6');
          grad.addColorStop(1, '#db2777');
          ctx.fillStyle = grad;
        }
        ctx.fill();
        ctx.restore();
      }

      // Center Pistil and Stamens
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = isMai ? '#ea580c' : '#9f1239';
      ctx.fill();

      // 5 Gold Stamen tips
      for (let j = 0; j < 5; j++) {
        const a = (j * Math.PI * 2) / 5;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * (s * 0.18), Math.sin(a) * (s * 0.18), s * 0.045, 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.fill();
      }

      ctx.restore();
    };

    let globalWindTime = 0;

    const render = () => {
      globalWindTime += 0.008;
      // Gentle natural breeze vector oscillating smoothly
      const globalWind = Math.sin(globalWindTime) * 0.5 + Math.cos(globalWindTime * 0.5) * 0.3;

      ctx.clearRect(0, 0, width, height);

      // Sort by depth (Z) so background petals render behind foreground petals
      petals.sort((a, b) => a.z - b.z);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // 3D physics updates
        p.pitch += p.pitchSpeed;
        p.yaw += p.yawSpeed;
        p.roll += p.rollSpeed;
        p.swayPhase += p.swaySpeed;

        // Aerodynamic sway + global wind
        const sway = Math.sin(p.swayPhase) * p.swayAmp;
        p.x += p.vx + sway + globalWind * (0.6 + p.z * 0.6);
        p.y += p.vy;

        // Interactive mouse wind repulsion
        if (enableInteractiveWind && mouseX > 0 && mouseY > 0) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const distSq = dx * dx + dy * dy;
          if (distSq < 16000 && distSq > 1) { // 125px radius
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 125) * 2.2;
            p.x += (dx / dist) * force * (1 + p.z);
            p.y += (dy / dist) * force * 0.5;
            p.pitchSpeed += 0.01;
          }
        }

        // Screen boundary recycling
        if (p.y > height + 40) {
          Object.assign(p, createPetal(undefined, undefined, false));
        }
        if (p.x < -40) p.x = width + 30;
        if (p.x > width + 40) p.x = -30;

        // Render appropriate form
        if (p.type === 'mai_flower' || p.type === 'dao_flower') {
          drawWholeFlower(p);
        } else {
          drawPetal(p);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (enableInteractiveWind) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('click', handleClick);
      }
    };
  }, [variant, enableInteractiveWind]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${variant === 'subtle' ? 'z-0' : 'z-10'} ${className}`}
      style={{ mixBlendMode: 'normal' }}
    />
  );
};
