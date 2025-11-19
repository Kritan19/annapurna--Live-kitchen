
import React, { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stage, Float, MeshDistortMaterial, Sparkles as ThreeSparkles } from '@react-three/drei';
import { MENU_ITEMS, CATEGORIES } from '../constants';
import { Dish } from '../types';
import { generateDishStory } from '../services/geminiService';
import { Loader2, Sparkles, Volume2, Mountain } from 'lucide-react';
import Steam from './Steam';

// Abstract 3D Representations with richer materials
const DishModel = ({ type, active, id }: { type: string; active: boolean; id: string }) => {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current && active) {
       // Basic rotation
       meshRef.current.rotation.y += 0.005;
       
       // Wobble for Juju Dhau
       if (id.includes('Dhau')) {
           meshRef.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.05;
           meshRef.current.scale.x = 1 - Math.sin(state.clock.getElapsedTime() * 3) * 0.02;
       }
    }
  });

  const isSelRoti = id.includes('Sel Roti');
  const isMomo = id.includes('Momo');
  const isJhol = id.includes('Jhol');
  const isChyang = id.includes('Chyang');
  const isThali = id.includes('Thali');

  if (type === 'torus') { // Sel Roti
    return (
      <group>
        <mesh ref={meshRef} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[1, 0.25, 32, 100]} />
            <meshPhysicalMaterial 
                color="#D4AF37" 
                roughness={0.4} 
                metalness={0.2} 
                clearcoat={0.5} 
            />
        </mesh>
        <ThreeSparkles count={30} scale={2} size={1.5} speed={0.2} opacity={0.8} color="#FFD700" />
      </group>
    );
  }

  if (isThali) { // Dal Bhat Thali
      return (
        <group rotation={[0, 0, 0]}>
            {/* Large Plate */}
            <mesh position={[0, -0.2, 0]}>
                <cylinderGeometry args={[2, 1.8, 0.1, 64]} />
                <meshStandardMaterial color="#B87333" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Rice Mound */}
            <mesh position={[0, 0.3, 0]}>
                <sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI/2]} />
                <meshStandardMaterial color="#F5F6F5" roughness={0.9} />
            </mesh>
            {/* Small Bowls */}
            {[0, 1, 2, 3].map((i) => (
                <mesh key={i} position={[Math.cos(i * 1.5) * 1.4, 0, Math.sin(i * 1.5) * 1.4]}>
                    <cylinderGeometry args={[0.4, 0.3, 0.3, 32]} />
                    <meshStandardMaterial color="#8D6E63" />
                </mesh>
            ))}
            <Steam position={[0, 0.5, 0]} intensity={0.5} />
        </group>
      )
  }

  if (type === 'cylinder') { // Sekuwa, Chyang
      return (
        <group>
            <mesh ref={meshRef} rotation={[isChyang ? 0 : Math.PI/2, 0, isChyang ? 0 : Math.PI/4]}>
                <cylinderGeometry args={[isChyang ? 0.6 : 0.1, isChyang ? 0.5 : 0.1, 2.5, 32]} />
                <meshPhysicalMaterial 
                    color={isChyang ? "#F5F5DC" : "#5D4037"} 
                    roughness={0.6} 
                    metalness={0.1} 
                    transparent={isChyang}
                    opacity={isChyang ? 0.9 : 1}
                />
            </mesh>
            {!isChyang && ( // Sekuwa Meat Chunks
                <group>
                    <mesh position={[0, 0.5, 0]}>
                        <boxGeometry args={[0.5, 0.5, 0.5]} />
                        <meshStandardMaterial color="#800000" />
                    </mesh>
                    <mesh position={[0, -0.5, 0]}>
                        <boxGeometry args={[0.6, 0.4, 0.5]} />
                        <meshStandardMaterial color="#800000" />
                    </mesh>
                     <Steam position={[0, 0, 0]} intensity={2} />
                </group>
            )}
            {isChyang && <Steam position={[0, 1.2, 0]} intensity={0.2} />} {/* Bubbles */}
        </group>
      )
  }

  // Default Sphere (Momo, Jhol, Sweets)
  return (
    <group>
        <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshPhysicalMaterial 
            color={isJhol ? '#FF5722' : (id.includes('Dhau') ? '#FFF8E1' : '#F5F6F5')} 
            roughness={0.2} 
            metalness={0.1} 
            transmission={isJhol ? 0.4 : 0}
            thickness={2}
        />
        </mesh>
        {isJhol && (
             <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.1, 0]}>
                <circleGeometry args={[1.3, 32]} />
                <meshStandardMaterial color="#FF5722" transparent opacity={0.5} />
             </mesh>
        )}
        {/* Steam for Momos and hot items */}
        {(isMomo || isJhol || id.includes('Yomari')) && <Steam position={[0, 1.3, 0]} intensity={1} />}
    </group>
  );
};

const MenuExperience: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [activeDish, setActiveDish] = useState<Dish>(MENU_ITEMS[0]);
  const [aiStory, setAiStory] = useState<string>("");
  const [loadingStory, setLoadingStory] = useState(false);

  const filteredItems = useMemo(() => 
    MENU_ITEMS.filter(item => item.category === activeCategory), 
  [activeCategory]);

  // Ensure activeDish updates when category changes
  React.useEffect(() => {
      const firstInCat = MENU_ITEMS.find(i => i.category === activeCategory);
      if (firstInCat) setActiveDish(firstInCat);
  }, [activeCategory]);

  const handleAskChef = async () => {
    setLoadingStory(true);
    setAiStory("");
    const story = await generateDishStory(activeDish);
    setAiStory(story);
    setLoadingStory(false);
  };

  return (
    <div className="min-h-screen bg-[#0F0505] text-everestSnow py-24 px-4 md:px-12 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-monasteryMaroon/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 border-b border-gheeGold/30 pb-4">
                <Mountain className="w-6 h-6 text-gheeGold" />
                <h2 className="text-4xl font-serif tracking-wider text-white">THE 8 WONDERS</h2>
                <Mountain className="w-6 h-6 text-gheeGold" />
            </div>
            <p className="mt-4 text-gray-400 text-sm tracking-[0.2em] uppercase">3D Interactive Menu</p>
        </div>

        {/* Simplified Category Tabs */}
        <div className="flex justify-center mb-12">
            <div className="flex flex-wrap justify-center gap-6">
                {CATEGORIES.map((cat) => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`pb-2 text-sm uppercase tracking-widest transition-all ${
                            activeCategory === cat 
                            ? 'text-gheeGold border-b-2 border-gheeGold' 
                            : 'text-gray-500 border-b-2 border-transparent hover:text-white'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <div className="space-y-8">
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-700">
                <h2 className="text-5xl md:text-6xl font-serif text-white drop-shadow-lg leading-tight">{activeDish.name}</h2>
                <h3 className="text-2xl font-serif text-rhododendron italic">{activeDish.nepaliName}</h3>
            </div>

            <div className="bg-monasteryMaroon/30 backdrop-blur-md border-l-4 border-gheeGold p-8 rounded-r-xl transition-all duration-500">
                <p className="text-lg leading-relaxed font-serif text-gray-200">
                    {activeDish.description}
                </p>
            </div>

            {/* Selection Grid for Current Category */}
            <div className="pt-4">
                <strong className="text-gray-500 uppercase tracking-widest text-[10px] block mb-3">Select Item</strong>
                <div className="flex flex-wrap gap-2">
                {filteredItems.map((dish) => (
                    <button
                        key={dish.id}
                        onClick={() => { setActiveDish(dish); setAiStory(""); }}
                        className={`px-4 py-2 rounded-sm text-xs uppercase tracking-widest transition-all duration-300 border ${
                            activeDish.id === dish.id 
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                            : 'bg-transparent border-white/10 text-gray-400 hover:border-white/40 hover:text-white'
                        }`}
                    >
                        {dish.name}
                    </button>
                ))}
                </div>
            </div>

            {/* AI Feature */}
            <div className="mt-8 border-t border-white/10 pt-8">
                {loadingStory ? (
                    <div className="flex items-center gap-3 text-gheeGold animate-pulse">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-serif italic">Summoning the chef's memories...</span>
                    </div>
                ) : aiStory ? (
                    <div className="relative p-6 bg-gradient-to-br from-black/40 to-transparent border border-white/5 rounded-lg animate-in fade-in zoom-in-95">
                        <Sparkles className="absolute top-4 left-4 w-4 h-4 text-gheeGold opacity-50" />
                        <p className="text-gray-300 italic font-serif leading-loose pl-6 border-l border-gheeGold/30">"{aiStory}"</p>
                    </div>
                ) : (
                    <button 
                        onClick={handleAskChef}
                        className="group flex items-center gap-3 text-sm text-gray-400 hover:text-gheeGold transition-colors"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-gheeGold/10 transition-colors">
                            <Volume2 className="w-4 h-4" />
                        </div>
                        <span className="uppercase tracking-widest text-xs">Hear the story of this dish</span>
                    </button>
                )}
            </div>
            </div>

            {/* Right: 3D Canvas */}
            <div className="h-[500px] w-full relative cursor-move">
                {/* Holy Halo Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-saffronOrange/20 via-rhododendron/10 to-transparent rounded-full blur-3xl opacity-60 animate-pulse-slow pointer-events-none" />
                
                <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={0.5} color="#ffd7a8" />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ffaa00" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#c41e3a" />
                    
                    <Suspense fallback={null}>
                        <Stage environment="city" intensity={0.5} adjustCamera={false}>
                            <Float rotationIntensity={0.8} floatIntensity={1.5} floatingRange={[-0.1, 0.1]}>
                                <DishModel type={activeDish.shapeType} active={true} id={activeDish.name} />
                            </Float>
                        </Stage>
                        {/* Conditional Sparkles for Sel Roti or "Golden" items */}
                        {activeDish.name.includes('Gold') || activeDish.name.includes('24k') ? (
                            <ThreeSparkles count={50} scale={3} size={2} speed={0.4} opacity={0.5} color="#FFD700" />
                        ) : null}
                    </Suspense>
                </Canvas>
                
                <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
                    <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full bg-black/40 backdrop-blur-sm">
                        <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">{activeDish.price} USD</span>
                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Interactive 3D</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default MenuExperience;
