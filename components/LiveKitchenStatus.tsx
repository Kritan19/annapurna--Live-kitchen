
import React, { useState, useEffect } from 'react';
import { KitchenStatus } from '../types';
import { Activity, Thermometer, Wind, ChefHat } from 'lucide-react';

const LiveKitchenStatus: React.FC = () => {
    const [status, setStatus] = useState<KitchenStatus>({
        smokeLevel: 45,
        temperature: 320,
        activeChefs: 8,
        lastOrderTime: 'Just now'
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStatus(prev => ({
                smokeLevel: Math.min(100, Math.max(20, prev.smokeLevel + (Math.random() - 0.5) * 10)),
                temperature: 300 + Math.floor(Math.random() * 50),
                activeChefs: 8,
                lastOrderTime: 'Just now'
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-40 hidden md:block">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-lg shadow-2xl w-64 transform transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gheeGold flex items-center gap-2">
                        <Activity className="w-3 h-3 animate-pulse" /> Live Kitchen
                    </span>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                         <div className="flex items-center gap-1 text-gray-400 text-xs">
                            <Wind className="w-3 h-3" /> Jimbu Smoke
                         </div>
                         <div className="h-1 w-full bg-gray-800 rounded overflow-hidden">
                             <div 
                                className="h-full bg-gradient-to-r from-gray-500 to-white transition-all duration-1000" 
                                style={{ width: `${status.smokeLevel}%` }}
                             />
                         </div>
                    </div>

                    <div className="flex flex-col gap-1">
                         <div className="flex items-center gap-1 text-gray-400 text-xs">
                            <Thermometer className="w-3 h-3" /> Tandoor
                         </div>
                         <div className="text-xs font-mono text-orange-500">{status.temperature}°C</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveKitchenStatus;
