import { motion } from 'framer-motion';
import { History, Search, Calendar, ChevronRight, Filter } from 'lucide-react';

const mockSessions = [
  { id: 1, date: '2026-03-12', title: 'Work-Life Rebalance', clarity: 82, tags: ['Stress', 'Work'] },
  { id: 2, date: '2026-03-10', title: 'Home Project Panic', clarity: 95, tags: ['Organization'] },
  { id: 3, date: '2026-03-08', title: 'Late Night Reflection', clarity: 70, tags: ['Rest'] },
];

export function HistoryView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-10"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Wisdom Archive</h2>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Retrieved via RAG Indexing</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search past wisdom..." 
              className="bg-slate-100 dark:bg-white/5 border border-transparent focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all outline-none" 
            />
          </div>
          <button className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400 hover:text-emerald-500 transition-all">
             <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {mockSessions.map((session, idx) => (
          <motion.div 
            key={session.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 flex items-center justify-between group hover:bg-emerald-500/5 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 min-w-[70px]">
                 <Calendar size={18} className="text-emerald-500 mb-1" />
                 <span className="text-[10px] font-black text-slate-400">MAR 12</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-emerald-500 transition-colors">{session.title}</h3>
                <div className="flex gap-2 mt-2">
                   {session.tags.map(tag => (
                     <span key={tag} className="text-[8px] font-black px-2 py-0.5 bg-slate-100 dark:bg-white/10 text-slate-400 rounded-full tracking-widest uppercase">{tag}</span>
                   ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
               <div className="text-right">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Clarity</p>
                  <p className="text-lg font-black text-emerald-500">{session.clarity}%</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <ChevronRight size={20} />
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
