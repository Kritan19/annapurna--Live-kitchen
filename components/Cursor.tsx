
import React, { useEffect, useRef } from 'react';

const Cursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<any[]>([]);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      // Add ember particles
      for (let i = 0; i < 3; i++) {
        particles.current.push({
          x: mouse.current.x,
          y: mouse.current.y,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: Math.random() * -1.5 - 0.5, // Float up like fire
          life: 1,
          decay: Math.random() * 0.03 + 0.01,
          color: Math.random() > 0.5 ? '255, 215, 0' : '245, 127, 23' // Gold and Orange
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw core cursor (Butter Lamp Flame)
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#FFD700';
      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF'; // White hot center
      ctx.fill();
      ctx.shadowBlur = 0;

      particles.current.forEach((p, index) => {
        p.life -= p.decay;
        p.x += p.speedX;
        p.y += p.speedY;
        p.size *= 0.95; // Shrink

        if (p.life <= 0) {
          particles.current.splice(index, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.life})`;
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[9999] mix-blend-screen"
    />
  );
};

export default Cursor;
