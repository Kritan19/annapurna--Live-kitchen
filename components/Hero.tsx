import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleSystem = ({ color, count, speed, size }: { color: string; count: number; speed: number; size: number }) => {
  const ref = useRef<THREE.Points>(null);
  const [sphere] = useState(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = 15 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        coords[3 * i] = r * Math.sin(phi) * Math.cos(theta);
        coords[3 * i + 1] = r * Math.sin(phi) * Math.sin(theta);
        coords[3 * i + 2] = r * Math.cos(phi);
    }
    return coords;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / (10 * speed);
      ref.current.rotation.y -= delta / (15 * speed);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={size}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

const Hero: React.FC = () => {
  const [showEnglish, setShowEnglish] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowEnglish(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-himalayanNight overflow-hidden">
      {/* 3D Embers Layer - Multi-colored for richness */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ParticleSystem color="#FFD700" count={1500} speed={1} size={0.03} /> {/* Gold */}
          <ParticleSystem color="#E31D2B" count={1000} speed={0.8} size={0.04} /> {/* Prayer Red */}
          <ParticleSystem color="#F57F17" count={800} speed={1.2} size={0.05} /> {/* Saffron */}
        </Canvas>
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-himalayanNight/30 to-himalayanNight z-10 pointer-events-none" />
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-dhaka-pattern opacity-10 z-10 pointer-events-none mix-blend-overlay" />

      {/* Text Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl md:text-9xl font-serif text-everestSnow tracking-wider mb-4 relative drop-shadow-2xl">
          <span className={`transition-opacity duration-1000 ${showEnglish ? 'opacity-30 blur-sm absolute' : 'opacity-100'}`}>
            अन्नपूर्णा
          </span>
          <span className={`transition-all duration-1000 bg-clip-text text-transparent bg-gradient-to-b from-white to-gheeGold ${showEnglish ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            Annapurna
          </span>
        </h1>
        
        {/* Decorative Line with Nepal Flag Shape hint */}
        <div className="flex items-center gap-4 mb-6">
             <div className="h-px w-12 bg-gradient-to-r from-transparent to-rhododendron" />
             <div className="w-3 h-3 rotate-45 bg-rhododendron border border-gheeGold animate-pulse" />
             <div className="h-px w-12 bg-gradient-to-l from-transparent to-rhododendron" />
        </div>

        <p className="text-gheeGold font-sans text-lg md:text-xl tracking-[0.3em] uppercase text-glow">
          Fire from the roof of the world
        </p>
        
        <button 
            onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-12 px-10 py-4 relative group overflow-hidden border border-gheeGold text-gheeGold transition-all duration-300 font-serif uppercase tracking-widest text-sm"
        >
            <div className="absolute inset-0 w-0 bg-gheeGold transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
            <span className="relative">Reserve Your Fire</span>
        </button>
      </div>
      
      {/* Bottom Prayer Flag Border */}
      <div className="absolute bottom-0 left-0 right-0 z-20 prayer-border-bottom opacity-50" />
    </div>
  );
};

export default Hero;