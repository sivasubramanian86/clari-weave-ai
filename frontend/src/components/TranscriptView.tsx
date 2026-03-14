import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface Props {
  transcript: string[];
}

export function TranscriptView({ transcript }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="flex flex-col h-[500px] glass-card">
      <div className="px-6 py-4 border-b border-white/10 dark:border-white/5 bg-white/30 dark:bg-white/5 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <MessageCircle size={18} />
        </div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Live Stream</h3>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {transcript.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm"
            >
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-800 mb-4 animate-pulse-slow" />
              <p className="italic">Awaiting reflection...</p>
            </motion.div>
          ) : (
            transcript.map((text, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                className="group relative"
              >
                <div className="bg-white/50 dark:bg-slate-800/40 rounded-2xl rounded-tl-none p-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed border border-white/40 dark:border-white/5 shadow-sm transition-all hover:shadow-md">
                  {text}
                </div>
                <div className="absolute top-0 -left-2 w-2 h-2 bg-white/50 dark:bg-slate-800/40" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
