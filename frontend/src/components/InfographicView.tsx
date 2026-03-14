import { motion } from 'framer-motion';
import { TrendingUp, Target, Brain, Shield } from 'lucide-react';

interface Props {
  metrics: {
    clarity_score: number;
    stress_level: number;
    topic_affinity: Record<string, number>;
    action_readiness: string;
  } | null;
}

export function InfographicView({ metrics }: Props) {
  if (!metrics) return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-slate-400 glass-card">
       <div className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-emerald-500 animate-spin mb-6" />
       <p className="font-bold uppercase tracking-widest text-xs">Generating Multimodal Insights...</p>
       <p className="text-[10px] mt-2 opacity-60 italic mb-8">Ensure your upload/stream is active and Clara is thinking.</p>
       
       <button 
         onClick={() => {
           // Direct UI force for the hackathon demo if live data is hanging
           window.dispatchEvent(new CustomEvent('force-mock-data'));
         }}
         className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all border border-white/10"
       >
         Test Nano Banana Mode (Mock)
       </button>
    </div>
  );

  return (
    <div className="h-full p-8 glass-card overflow-hidden relative">
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <Brain size={120} className="text-emerald-500" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
             <TrendingUp size={24} />
           </div>
           <div>
             <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Session Synthesis</h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nano Banana 2 Data Intelligence</p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-6 flex-1">
          {/* Clarity Score Wheel */}
          <div className="flex flex-col items-center justify-center p-6 glass rounded-3xl border-white/20 dark:border-white/5 shadow-inner">
             <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                  <motion.circle 
                    initial={{ strokeDasharray: "0 314" }}
                    animate={{ strokeDasharray: `${metrics.clarity_score * 3.14} 314` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-emerald-500" strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-800 dark:text-white">{metrics.clarity_score}%</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Clarity</span>
                </div>
             </div>
          </div>

          {/* Stress Meter */}
          <div className="flex flex-col justify-center p-6 glass rounded-3xl border-white/20 dark:border-white/5">
             <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chaos Reduction</span>
               <span className="text-xs font-black text-emerald-500">{100 - metrics.stress_level}%</span>
             </div>
             <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - metrics.stress_level}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                />
             </div>
             <div className="mt-6 flex items-center gap-2">
                <Shield size={14} className="text-sky-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Emotional Safety: Verified</span>
             </div>
          </div>

          {/* Topic Distribution */}
          <div className="col-span-2 p-6 glass rounded-3xl border-white/20 dark:border-white/5">
             <div className="flex items-center gap-2 mb-4">
               <Target size={16} className="text-amber-500" />
               <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest">Context Affinity</span>
             </div>
             <div className="space-y-3">
                {Object.entries(metrics.topic_affinity).map(([topic, val]) => (
                  <div key={topic} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                      <span>{topic}</span>
                      <span>{val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        className="h-full bg-slate-400 dark:bg-slate-600"
                      />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Readiness Index</span>
              <span className="text-sm font-black text-emerald-500 uppercase italic">/// {metrics.action_readiness}</span>
           </div>
           <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20">
             Export Clarity Map
           </button>
        </div>
      </div>
    </div>
  );
}
