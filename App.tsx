
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import MenuExperience from './components/MenuExperience';
import MandalaBooking from './components/MandalaBooking';
import LampWall from './components/LampWall';
import Cursor from './components/Cursor';
import LiveKitchenStatus from './components/LiveKitchenStatus';
import PrayerFlags from './components/PrayerFlags';
import PasswordGate from './components/PasswordGate';
import { HashRouter } from 'react-router-dom';
import { Volume2, VolumeX, MountainSnow } from 'lucide-react';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const App: React.FC = () => {
  const [monasteryMode, setMonasteryMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Konami Code Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        if (nextIndex === KONAMI_CODE.length) {
          setMonasteryMode(prev => !prev);
          setKonamiIndex(0);
          // Visual feedback for activation
          document.body.style.animation = 'flicker 0.5s';
          setTimeout(() => document.body.style.animation = '', 500);
        } else {
          setKonamiIndex(nextIndex);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);

  if (!isAuthenticated) {
      return <PasswordGate onEnter={() => setIsAuthenticated(true)} />;
  }

  return (
    <HashRouter>
      <main className={`w-full min-h-screen transition-colors duration-1000 relative ${monasteryMode ? 'bg-[#2b0a0d] selection:bg-gheeGold' : 'bg-[#05070a] selection:bg-gheeGold text-everestSnow'}`}>
        
        <Cursor />
        <LiveKitchenStatus />

        {/* Monastery Overlay Effect */}
        {monasteryMode && (
            <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-30 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        )}

        {/* Top Prayer Flag Border */}
        <div className="fixed top-0 left-0 right-0 h-1 z-[60] flex">
            <div className="flex-1 bg-prayerBlue"></div>
            <div className="flex-1 bg-prayerWhite"></div>
            <div className="flex-1 bg-prayerRed"></div>
            <div className="flex-1 bg-prayerGreen"></div>
            <div className="flex-1 bg-prayerYellow"></div>
        </div>

        {/* Navigation (Simple Sticky) */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <div className="pointer-events-auto cursor-pointer group flex items-center gap-3">
             {monasteryMode && <MountainSnow className="w-6 h-6 text-gheeGold animate-pulse" />}
             <div className="text-xl font-serif text-gheeGold tracking-widest group-hover:text-white transition-colors">
                {monasteryMode ? 'MONASTERY' : 'ANNAPURNA'}
             </div>
          </div>
          
          <div className="pointer-events-auto flex items-center gap-8 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
            <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="hover:text-gheeGold transition-colors text-gray-300 hidden md:block">Home</button>
            <button onClick={() => document.getElementById('menu-section')?.scrollIntoView({behavior:'smooth'})} className="hover:text-gheeGold transition-colors text-gray-300 hidden md:block">Menu</button>
            <button onClick={() => document.getElementById('booking-section')?.scrollIntoView({behavior:'smooth'})} className="text-saffronOrange hover:text-white transition-colors hidden md:block">Reserve</button>
            
            {/* Sound Toggle */}
            <button 
                onClick={() => setSoundEnabled(!soundEnabled)} 
                className={`flex items-center gap-2 px-3 py-1 border rounded-full transition-all ${soundEnabled ? 'border-gheeGold text-gheeGold' : 'border-white/10 text-gray-500'}`}
            >
                {soundEnabled ? <Volume2 size={14} className="animate-pulse" /> : <VolumeX size={14} />}
                <span className="hidden md:inline">Ambiance</span>
                {soundEnabled && <div className="w-1 h-4 bg-gheeGold animate-pulse ml-1"></div>}
            </button>
          </div>
        </nav>

        <Hero />
        
        <div id="menu-section">
          <MenuExperience />
        </div>

        <MandalaBooking />
        
        <PrayerFlags />

        <LampWall />

        <footer className="py-12 text-center border-t border-white/5 bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-dhaka-pattern opacity-5 pointer-events-none" />
          <div className="relative z-10">
             <h2 className="font-serif text-2xl text-gray-700 mb-4">ANNAPURNA</h2>
             <p className="text-gray-600 text-[10px] uppercase tracking-[0.3em]">© {new Date().getFullYear()} Himalayan Hospitality Group</p>
             {monasteryMode && <p className="text-gheeGold text-xs mt-4 animate-pulse">Om Mani Padme Hum</p>}
          </div>
        </footer>
      </main>
    </HashRouter>
  );
};

export default App;
