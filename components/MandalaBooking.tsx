import React, { useState, useEffect } from 'react';
import { TABLES_DATA, VIBE_DESCRIPTIONS } from '../constants';
import { BookingVibe, Table } from '../types';
import { Flame, MapPin, Users, Info, ChevronRight } from 'lucide-react';
import { getConciergeRecommendation } from '../services/geminiService';

const MandalaBooking: React.FC = () => {
  const [selectedVibe, setSelectedVibe] = useState<BookingVibe>(BookingVibe.DASHAIN);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tables, setTables] = useState<Table[]>(TABLES_DATA);
  const [conciergeTip, setConciergeTip] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTables(prev => prev.map(t => ({
        ...t,
        status: Math.random() > 0.9 ? (t.status === 'available' ? 'occupied' : 'available') : t.status
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      getConciergeRecommendation(selectedVibe).then(setConciergeTip);
  }, [selectedVibe]);

  // Helper to get vibe color styles
  const getVibeStyle = (vibe: BookingVibe) => {
      switch(vibe) {
          case BookingVibe.DASHAIN: return { bg: 'bg-nepaliRed', border: 'border-nepaliRed', text: 'text-nepaliRed', glow: 'shadow-nepaliRed/50' };
          case BookingVibe.TIHAR: return { bg: 'bg-saffronOrange', border: 'border-saffronOrange', text: 'text-saffronOrange', glow: 'shadow-saffronOrange/50' };
          case BookingVibe.LOSAR: return { bg: 'bg-prayerBlue', border: 'border-prayerBlue', text: 'text-prayerBlue', glow: 'shadow-prayerBlue/50' };
          default: return { bg: 'bg-gheeGold', border: 'border-gheeGold', text: 'text-gheeGold', glow: 'shadow-gheeGold/50' };
      }
  };

  const activeStyle = getVibeStyle(selectedVibe);

  return (
    <section id="booking-section" className="py-24 bg-[#0B0F1A] relative overflow-hidden">
       {/* Colored texture background */}
       <div className="absolute inset-0 bg-dhaka-pattern opacity-[0.03]" />

       {/* Animated Rotating Mandala SVG Background (Multicolor) */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] opacity-10 pointer-events-none">
           <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
               <circle cx="50" cy="50" r="48" stroke="#0078BF" strokeWidth="0.2" fill="none" />
               <circle cx="50" cy="50" r="40" stroke="#F5F6F5" strokeWidth="0.2" fill="none" />
               <circle cx="50" cy="50" r="32" stroke="#E31D2B" strokeWidth="0.2" fill="none" />
               <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="none" stroke="#FFD700" strokeWidth="0.2" />
               <rect x="25" y="25" width="50" height="50" stroke="#009B4C" strokeWidth="0.2" fill="none" transform="rotate(45 50 50)" />
           </svg>
       </div>

       <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* Controls & Info */}
           <div className="lg:col-span-4 space-y-8 z-10 order-2 lg:order-1">
               <div>
                   <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-1 bg-gradient-to-r from-prayerBlue via-prayerRed to-prayerYellow"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Real-time Availability</span>
                   </div>
                   <h2 className="text-4xl font-serif text-everestSnow mb-2">Find Your Seat</h2>
                   <p className="text-gray-400 text-sm font-sans">The table is a mandala. Where you sit shapes your journey.</p>
               </div>

               <div className="space-y-3">
                   {Object.values(BookingVibe).map((vibe) => {
                       const style = getVibeStyle(vibe);
                       const isSelected = selectedVibe === vibe;
                       return (
                           <button
                               key={vibe}
                               onClick={() => setSelectedVibe(vibe)}
                               className={`w-full p-5 text-left rounded border relative overflow-hidden transition-all duration-300 group ${
                                   isSelected 
                                   ? `bg-himalayanNight ${style.border} shadow-lg ${style.glow}` 
                                   : 'bg-himalayanNight/50 border-gray-800 hover:border-gray-600'
                               }`}
                           >
                               {/* Color tab on left */}
                               <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.bg} transition-all ${isSelected ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`} />
                               
                               <div className="pl-4 flex justify-between items-center">
                                   <div>
                                       <div className={`font-serif text-lg ${isSelected ? style.text : 'text-gray-300'}`}>{vibe}</div>
                                       <div className="text-xs text-gray-500 mt-1">{VIBE_DESCRIPTIONS[vibe]}</div>
                                   </div>
                                   {isSelected && <ChevronRight className={`w-5 h-5 ${style.text}`} />}
                               </div>
                           </button>
                       )
                   })}
               </div>
               
               <div className={`p-6 border-l-2 bg-gradient-to-r from-himalayanNight to-transparent rounded-r-lg backdrop-blur-sm ${activeStyle.border}`}>
                   <div className="flex items-start gap-3">
                        <Info className={`w-5 h-5 shrink-0 mt-1 ${activeStyle.text}`} />
                        <div>
                            <h4 className={`${activeStyle.text} font-serif text-sm mb-2`}>The Concierge Whispers</h4>
                            <p className="text-gray-300 text-sm leading-relaxed italic font-serif">"{conciergeTip || "Consulting the stars..."}"</p>
                        </div>
                   </div>
               </div>
           </div>

           {/* Mandala Floor Plan */}
           <div className="lg:col-span-8 flex flex-col items-center justify-center min-h-[500px] relative order-1 lg:order-2">
               
               {/* The "Fire/Chulo" Center */}
               <div className={`absolute w-48 h-48 rounded-full blur-[80px] opacity-40 transition-colors duration-1000 ${activeStyle.bg}`} />
               
               <div className="w-28 h-28 rounded-full border-4 border-himalayanNight bg-[#1a0505] flex items-center justify-center z-10 shadow-2xl relative ring-1 ring-white/10">
                    <Flame className={`w-12 h-12 ${activeStyle.text} animate-pulse`} />
                    <div className={`absolute -bottom-10 text-[10px] ${activeStyle.text} font-bold tracking-[0.2em] uppercase text-center`}>
                        The Holy<br/>Kitchen
                    </div>
               </div>

               {/* Decorative Rings */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="w-[550px] h-[550px] border border-prayerBlue/10 rounded-full" />
                   <div className="w-[450px] h-[450px] border border-prayerRed/10 rounded-full" />
                   <div className="w-[350px] h-[350px] border border-gheeGold/10 rounded-full" />
               </div>

               {/* Tables */}
               {tables.map((table) => (
                   <button
                       key={table.id}
                       onClick={() => table.status === 'available' && setSelectedTable(table)}
                       disabled={table.status !== 'available'}
                       className={`absolute w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 group ${
                           selectedTable?.id === table.id ? 'scale-125 z-20' : 'hover:scale-110'
                       }`}
                       style={{
                           left: `${table.x}%`,
                           top: `${table.y}%`,
                           transform: 'translate(-50%, -50%)'
                       }}
                   >
                       {/* Selected Indicator Ring */}
                       {selectedTable?.id === table.id && (
                           <div className={`absolute -inset-2 rounded-full border border-dashed animate-spin-slow ${activeStyle.border} opacity-50`} />
                       )}

                       {/* Table Icon */}
                       <div className={`relative w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-md shadow-lg transition-colors duration-300 ${
                           table.status === 'available' 
                           ? `bg-himalayanNight/90 ${selectedTable?.id === table.id ? activeStyle.border : 'border-gray-700 group-hover:border-white/30'}` 
                           : 'bg-red-950/30 border-red-900/50 cursor-not-allowed grayscale'
                       }`}>
                            {table.status === 'available' ? (
                                <div className={`w-2 h-2 rounded-full animate-pulse ${activeStyle.bg}`} />
                            ) : (
                                <div className="w-2 h-2 bg-red-900/50 rounded-full" />
                            )}
                       </div>

                       {/* Hover Tooltip */}
                       <div className="absolute bottom-full mb-3 bg-monasteryMaroon border border-white/10 p-3 rounded-sm shadow-xl w-36 text-left hidden group-hover:block z-50 pointer-events-none">
                           <div className="text-gheeGold font-serif mb-1 border-b border-white/10 pb-1">Table {table.id}</div>
                           <div className="text-[10px] text-gray-300 uppercase tracking-wider mb-1">{table.zone}</div>
                           <div className="flex items-center gap-1 text-xs text-white"><Users size={10} /> {table.seats} Guests</div>
                       </div>
                   </button>
               ))}

               {/* Selected Booking Details Modal Overlay */}
               {selectedTable && (
                   <div className="absolute bottom-0 bg-monasteryMaroon border-t-4 border-gheeGold p-6 w-full md:w-auto md:min-w-[300px] md:rounded-t-lg shadow-2xl z-50 animate-float">
                       <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-gheeGold font-serif text-xl">Table {selectedTable.id}</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">{selectedTable.zone} Zone</div>
                            </div>
                            <div className="bg-black/30 px-2 py-1 rounded text-xs text-white border border-white/10">
                                {selectedTable.seats} Seats
                            </div>
                       </div>
                       <button 
                        className={`w-full py-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeStyle.bg} text-himalayanNight hover:bg-white`}
                        onClick={() => alert(`Booking confirmed for Table ${selectedTable.id}!`)}
                       >
                           Confirm Reservation
                       </button>
                   </div>
               )}

           </div>
       </div>
    </section>
  );
};

export default MandalaBooking;