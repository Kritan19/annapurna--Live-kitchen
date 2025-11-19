import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { LampStat } from '../types';
import { Flame } from 'lucide-react';

const DATA: LampStat[] = [
  { time: '18:00', lamps: 12 },
  { time: '19:00', lamps: 45 },
  { time: '20:00', lamps: 82 },
  { time: '21:00', lamps: 65 },
  { time: '22:00', lamps: 30 },
];

const COLORS = ['#800000', '#C41E3A', '#F57F17', '#FFD700', '#F5F6F5']; // Maroon to White hot

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-monasteryMaroon border border-gheeGold/30 p-3 text-xs shadow-xl">
        <p className="text-gheeGold font-serif mb-1">{payload[0].payload.time}</p>
        <p className="text-white">{`${payload[0].value} Lamps`}</p>
      </div>
    );
  }
  return null;
};

const LampWall: React.FC = () => {
  return (
    <section className="py-16 bg-black border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
        
        <div className="md:w-1/3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4 text-saffronOrange">
            <Flame className="fill-current animate-flicker" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-gheeGold">Community</span>
          </div>
          <h3 className="text-4xl font-serif text-white mb-6 leading-tight">
            Every meal lights a lamp.
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed font-serif border-l-2 border-rhododendron pl-4">
            234 prayers have been lit in our digital monastery tonight. Join the circle of light and keep the fire burning.
          </p>
        </div>

        <div className="md:w-2/3 w-full h-64">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={DATA}>
               <XAxis 
                dataKey="time" 
                stroke="#333" 
                tick={{fill: '#666', fontSize: 10, fontFamily: 'Satoshi'}} 
                tickLine={false}
                axisLine={false}
                dy={10}
               />
               <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255, 255, 255, 0.05)'}} />
               <Bar dataKey="lamps" radius={[2, 2, 0, 0]} barSize={50} animationDuration={1500}>
                 {DATA.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={`url(#colorGradient-${index})`} />
                 ))}
               </Bar>
                <defs>
                  {DATA.map((entry, index) => (
                    <linearGradient key={`colorGradient-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1}/>
                      <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.3}/>
                    </linearGradient>
                  ))}
                </defs>
             </BarChart>
           </ResponsiveContainer>
        </div>

      </div>
    </section>
  );
};

export default LampWall;