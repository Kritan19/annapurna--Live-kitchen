
import React, { useState, useEffect } from 'react';
import { Flame, ChevronRight } from 'lucide-react';

const PasswordGate: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toLowerCase().trim() === 'namaste') {
      setIsUnlocked(true);
      setTimeout(onEnter, 1000); // Allow animation to play
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#05070a] flex flex-col items-center justify-center transition-opacity duration-1000 ${isUnlocked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-dhaka-pattern opacity-5 pointer-events-none" />
      
      <div className="relative z-10 text-center space-y-8 max-w-md w-full px-4">
        <div className="flex justify-center">
             <div className={`p-4 rounded-full border border-gheeGold/30 bg-gradient-to-b from-black to-monasteryMaroon/20 ${isUnlocked ? 'animate-ping' : 'animate-pulse'}`}>
                <Flame className="w-8 h-8 text-gheeGold" />
             </div>
        </div>
        
        <div>
            <h1 className="font-serif text-3xl text-everestSnow mb-2 tracking-widest">ANNAPURNA</h1>
            <p className="text-gheeGold text-[10px] uppercase tracking-[0.4em]">Private Kitchen</p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter the secret word..."
                className={`w-full bg-transparent border-b ${error ? 'border-red-500 text-red-500' : 'border-white/20 text-white'} py-3 text-center font-serif text-xl focus:outline-none focus:border-gheeGold transition-all placeholder:text-white/20`}
                autoFocus
            />
            <button 
                type="submit"
                className="absolute right-0 bottom-3 text-gheeGold hover:text-white transition-colors"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </form>

        {error && <p className="text-red-500 text-xs tracking-widest uppercase animate-bounce">Incorrect</p>}
        <p className="text-gray-600 text-xs italic">Hint: The traditional Nepali greeting.</p>
      </div>
    </div>
  );
};

export default PasswordGate;
