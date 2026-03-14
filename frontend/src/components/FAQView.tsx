import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, Shield, Zap, Sparkles } from 'lucide-react';

const faqs = [
  {
    q: "How does the Multi-Agent system work?",
    a: "ClariWeave uses a team of specialized agents: the Linguist for language, the Weaver for empathy, the Archivist for history, and the Analyst for data. They coordinate under one 'Coordinator' mind.",
    icon: Sparkles
  },
  {
    q: "Is my data secure?",
    a: "Yes. The 'Guardian' agent scans every session for PII Leakage and ensures compliance with strict privacy and safety guardrails.",
    icon: Shield
  },
  {
    q: "What is RAG-based context?",
    a: "Retrieval-Augmented Generation allows the app to search through your past sessions to find patterns in your stress levels and remind you of what has worked before.",
    icon: Zap
  },
  {
    q: "How can I start a live session?",
    a: "Simply go to the 'Live' category in the sidebar and select Microphone, Camera, or Screen. The Multimodal Engine will follow your lead.",
    icon: MessageSquare
  }
];

export function FAQView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
          <HelpCircle size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Support center</h2>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Mastering the Chaos with ClariWeave</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 group hover:border-emerald-500/20 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">{item.q}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.a}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card p-10 bg-emerald-500/5 border-emerald-500/20 flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
           <MessageSquare size={24} />
        </div>
        <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase">Still have questions?</h4>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Our agents are here to help 24/7</p>
        <button className="px-8 py-3 bg-slate-800 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-black transition-all">Open Contact Session</button>
      </div>
    </motion.div>
  );
}
