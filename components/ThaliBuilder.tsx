
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Float, Text } from '@react-three/drei';
import { THALI_ITEMS } from '../constants';
import { ThaliItem } from '../types';
import { predictThaliProfile } from '../services/geminiService';
import { Sparkles, ChefHat, RotateCcw } from 'lucide-react';

const Bowl = ({ position, color, label }: { position: [number, number, number], color: string, label: string }) => {
  return (
    <group position={position}>
      {/* Bowl */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.6, 0.4, 0.6, 32]} />
        <meshStandardMaterial color="#B87333" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Food */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.38, 32, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Label */}
      <Text position={[0, 1.2, 0]} fontSize={0.2} color="white" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000">
        {label}
      </Text>
    </group>
  );
};

const CopperPlate = ({ items }: { items: ThaliItem[] }) => {
  return (
    <group>
      {/* Main Plate */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[4, 4, 0.1, 64]} />
        <meshStandardMaterial color="#B87333" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Central Rice Mound (if rice selected) */}
      {items.find(i => i.type === 'rice') && (
        <mesh position={[0, 0.5, 0]}>
           <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
           <meshStandardMaterial color="#F5F6F5" roughness={0.9} />
        </mesh>
      )}

      {/* Bowls distributed around */}
      {items.filter(i => i.type !== 'rice').map((item, index, arr) => {
        const angle = (index / arr.length) * Math.PI * 2;
        const radius = 2.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return <Bowl key={item.id + index} position={[x, 0, z]} color={item.color} label={item.name} />;
      })}
    </group>
  );
};

const ThaliBuilder: React.FC = () => {
  const [myThali, setMyThali] = useState<ThaliItem[]>([]);
  const [prediction, setPrediction] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const addToThali = (item: ThaliItem) => {
    if (myThali.length >= 6) return;
    setMyThali([...myThali, item]);
    setPrediction(""); 
  };

  const resetThali = () => {
    setMyThali([]);
    setPrediction("");
  };

  const handlePredict = async () => {
    if (myThali.length === 0) return;
    setLoading(true);
    const result = await predictThaliProfile(myThali);
    setPrediction(result);
    setLoading(false);
  };

  return (
    <section className="py-24 bg-[#0B0F1A] relative border-t border-white/5">
      <div className="absolute inset-0 bg-dhaka-pattern opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Selection */}
        <div className="lg:col-span-1 space-y-6 z-10">
          <div>
             <div className="flex items-center gap-2 mb-2">
                <RotateCcw className="w-4 h-4 text-gheeGold animate-spin-slow" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Interactive Chef's Table</span>
             </div>
             <h2 className="text-4xl font-serif text-everestSnow mb-2">Craft Your Thali</h2>
             <p className="text-gray-400 text-sm">Select up to 6 items. Balance the 6 rasas (tastes).</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {THALI_ITEMS.map(item => (
              <button 
                key={item.id}
                onClick={() => addToThali(item)}
                disabled={myThali.length >= 6}
                className="p-3 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:border-gheeGold transition-all text-left group"
              >
                <div className="text-gheeGold font-serif text-sm group-hover:text-white">{item.name}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{item.type}</div>
              </button>
            ))}
          </div>

          <button onClick={resetThali} className="text-xs text-red-400 underline hover:text-red-300">Reset Plate</button>

          {myThali.length > 0 && (
             <div className="mt-8 p-6 bg-gradient-to-br from-monasteryMaroon/50 to-transparent border border-gheeGold/30 rounded">
                {loading ? (
                    <div className="flex items-center gap-2 text-gheeGold">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span className="text-sm italic">Chef is tasting...</span>
                    </div>
                ) : prediction ? (
                    <div>
                        <div className="flex items-center gap-2 text-gheeGold mb-2">
                            <ChefHat className="w-5 h-5" />
                            <span className="font-serif font-bold">Chef's Verdict</span>
                        </div>
                        <p className="text-gray-200 text-sm italic leading-relaxed">"{prediction}"</p>
                    </div>
                ) : (
                    <button 
                        onClick={handlePredict}
                        className="w-full py-3 bg-gheeGold text-himalayanNight font-bold uppercase tracking-widest hover:bg-white transition-colors"
                    >
                        Analyze Flavors
                    </button>
                )}
             </div>
          )}
        </div>

        {/* Right: 3D Builder */}
        <div className="lg:col-span-2 h-[500px] bg-gradient-to-b from-black to-[#1a0505] rounded-lg border border-white/5 relative overflow-hidden">
            <div className="absolute top-4 right-4 z-10 text-right">
                 <div className="text-4xl font-serif text-white/10">{myThali.length} / 6</div>
            </div>
            
            <Canvas shadows camera={{ position: [0, 5, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
                <Suspense fallback={null}>
                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                        <CopperPlate items={myThali} />
                    </Float>
                </Suspense>
                <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} enableZoom={false} />
            </Canvas>
            
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Drag to rotate • Copper Plate</span>
            </div>
        </div>

      </div>
    </section>
  );
};

export default ThaliBuilder;
