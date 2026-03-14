import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function ProcessingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <div className="relative w-24 h-24">
        {/* Orbiting Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-emerald-500/20 rounded-full border-t-emerald-500"
        />
        
        {/* Glow Pulser */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-4 bg-emerald-500/20 blur-xl rounded-full"
        />

        {/* Center Aura */}
        <div className="absolute inset-0 flex items-center justify-center">
           <motion.div
             animate={{ rotate: [-10, 10, -10] }}
             transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
             className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 text-white"
           >
             <Sparkles size={20} />
           </motion.div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Orchestrating Agents</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">
           Linguist [Active] • Weaver [Syncing] • Guardian [Monitoring]
        </p>
      </div>

      <div className="flex gap-1">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.div 
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"
          />
        ))}
      </div>
    </div>
  );
}
