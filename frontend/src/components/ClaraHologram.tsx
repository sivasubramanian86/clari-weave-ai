import { motion, AnimatePresence } from 'framer-motion';

interface ClaraHologramProps {
  isConnected: boolean;
  isSpeaking?: boolean;
  metrics?: any;
}

export function ClaraHologram({ isConnected, isSpeaking = false, metrics }: ClaraHologramProps) {
  const stress = metrics?.stress_level || 0;
  
  // Dynamic color logic based on stress
  const getGlowColor = () => {
    if (stress > 70) return 'bg-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.4)]';
    if (stress > 40) return 'bg-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.3)]';
    return 'bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.3)]';
  };

  const statusAgents = [
    { name: 'Weaver', active: isSpeaking && stress > 30 },
    { name: 'Analyst', active: metrics !== null },
    { name: 'Archivist', active: isConnected && !isSpeaking },
    { name: 'Guardian', active: isConnected }
  ];

  return (
    <div className="fixed bottom-8 left-8 z-[100] pointer-events-none select-none">
      <AnimatePresence mode="wait">
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="relative"
          >
            {/* Thinking Bubbles (Agent Mesh) */}
            <div className="absolute -top-16 left-0 flex flex-col gap-1">
              {statusAgents.filter(a => a.active).map((agent, i) => (
                <motion.div
                  key={agent.name}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-2 py-0.5 glass rounded-full flex items-center gap-2 border border-emerald-500/20"
                >
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">{agent.name} Active</span>
                </motion.div>
              ))}
            </div>

            {/* Holographic Projection Base */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[40px] rounded-full animate-pulse transition-colors duration-1000 ${getGlowColor()}`} />
            
            {/* 3D Projection Effect Layers */}
            <div className={`relative w-28 h-28 rounded-3xl overflow-hidden border transition-colors duration-1000 ${stress > 70 ? 'border-rose-500/30' : 'border-emerald-500/30'} bg-slate-900/40 backdrop-blur-md`}>
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-30" />
              
              {/* Clara Avatar */}
              <motion.img 
                src="/clara.png" 
                alt="Clara Hologram" 
                className={`w-full h-full object-cover transition-all duration-1000 ${stress > 70 ? 'sepia-[0.5] hue-rotate-[320deg]' : 'grayscale-[0.2] sepia-[0.2]'}`}
                animate={isSpeaking ? { 
                    filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
                    scale: [1, 1.02, 1]
                } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />

              {/* Holographic Glitch Overlay */}
              <div className={`absolute inset-0 mix-blend-overlay animate-pulse ${stress > 70 ? 'bg-rose-500/10' : 'bg-emerald-500/5'}`} />
            </div>

            {/* Projection Beam/Base */}
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-[2px] blur-[2px] animate-pulse ${stress > 70 ? 'bg-rose-500/30' : 'bg-emerald-500/30'}`} />
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[1px] ${stress > 70 ? 'bg-rose-500/50' : 'bg-emerald-500/50'}`} />

            {/* Speaking/Status Indicator */}
            <div className="absolute -top-2 -right-2 flex items-center justify-center">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${isSpeaking ? 'bg-emerald-500 animate-ping' : 'bg-emerald-500/50'}`} />
                <div className={`absolute inset-0 w-4 h-4 rounded-full ${isSpeaking ? 'bg-emerald-500' : 'bg-emerald-400 opacity-50'}`} />
              </div>
            </div>

            {/* Label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] drop-shadow-lg">
                Hologram: Clara
              </p>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mt-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
