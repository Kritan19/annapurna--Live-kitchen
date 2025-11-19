
import React, { useEffect, useRef } from 'react';

const SmokeCursor: React.FC = () => {
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
      // Add particles on move
      for (let i = 0; i < 2; i++) {
        particles.current.push({
          x: mouse.current.x + (Math.random() - 0.5) * 10,
          y: mouse.current.y + (Math.random() - 0.5) * 10,
          size: Math.random() * 15 + 5,
          speedX: (Math.random() - 0.5) * 1,
          speedY: Math.random() * -2 - 0.5, // Float up
          life: 1,
          decay: Math.random() * 0.02 + 0.01,
          color: Math.random() > 0.5 ? '150, 150, 150' : '100, 120, 140' // Grey/Blueish smoke
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach((p, index) => {
        p.life -= p.decay;
        p.x += p.speedX;
        p.y += p.speedY;
        p.size += 0.2; // Expand as it rises

        if (p.life <= 0) {
          particles.current.splice(index, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.3})`;
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

export default SmokeCursor;
