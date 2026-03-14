import { Mic, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface Props {
  isConnected: boolean;
  audioLevel: number;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function MicrophoneControl({ isConnected, audioLevel, onConnect, onDisconnect }: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-8 glass-card">
      <div className="relative">
        <AnimatePresence>
          {isConnected && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1 + (audioLevel / 50), 
                opacity: 0.1 + (audioLevel / 100) 
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute inset-0 rounded-full bg-emerald-500"
            />
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isConnected ? onDisconnect : onConnect}
          className={cn(
            "relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-colors duration-500 shadow-2xl",
            isConnected 
              ? "bg-red-500/90 text-white shadow-red-500/20" 
              : "bg-emerald-500/90 text-white shadow-emerald-500/20"
          )}
        >
          {isConnected ? (
            <Square size={32} fill="white" />
          ) : (
            <Mic size={38} />
          )}
        </motion.button>
      </div>

      <motion.div 
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-center"
      >
        <h3 className="text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          {isConnected ? 'ClariWeave Listening...' : 'Start Conversation'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isConnected ? 'Tap to finish reflection' : 'Voice-only / Multimodal reflection'}
        </p>
      </motion.div>
    </div>
  );
}
