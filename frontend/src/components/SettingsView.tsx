import { motion } from 'framer-motion';
import { Settings, Shield, Globe, Fingerprint } from 'lucide-react';

export function SettingsView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">System Configuration</h2>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Manage your Multi-Agent Environment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-emerald-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">Preferences</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 glass rounded-2xl">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Main Language</span>
               <span className="text-xs font-black text-emerald-500 uppercase">English</span>
            </div>
            <div className="flex justify-between items-center p-4 glass rounded-2xl">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Fallback LLM</span>
               <span className="text-xs font-black text-slate-400 uppercase">Gemini 1.5 Flash</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-emerald-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">Guardrails</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 glass rounded-2xl">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">PII Masking</span>
               <div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center justify-end px-1"><div className="w-3 h-3 bg-white rounded-full" /></div>
            </div>
            <div className="flex justify-between items-center p-4 glass rounded-2xl">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Governance Logging</span>
               <div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center justify-end px-1"><div className="w-3 h-3 bg-white rounded-full" /></div>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 glass-card p-8 flex items-center justify-between border-emerald-500/20">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl">
                 <Fingerprint className="text-emerald-500" />
              </div>
              <div>
                 <p className="text-xs font-black uppercase tracking-tight">Infrastructure Identity</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">ADK-ORCHESTRATOR-NODE-042</p>
              </div>
           </div>
           <button className="px-6 py-2 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-colors">Regenerate Key</button>
        </div>
      </div>
    </motion.div>
  );
}
