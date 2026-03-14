import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic2, Camera, MonitorUp, Zap } from 'lucide-react';
import { MicrophoneControl } from '../MicrophoneControl';
import { TranscriptView } from '../TranscriptView';
import { ProcessingIndicator } from '../ProcessingIndicator';
import { cn } from '../../lib/utils';

interface Props {
  type: 'mic' | 'camera' | 'screen';
  isConnected: boolean;
  audioLevel: number;
  transcript: string[];
  ragStatus: string | null;
  stream: MediaStream | null;
  permissionError?: boolean;
  onConnect: (type: 'mic' | 'camera' | 'screen') => void;
  onDisconnect: () => void;
  onFinish: () => void;
}

export function LiveTabs({ type, isConnected, audioLevel, transcript, ragStatus, stream, permissionError, onConnect, onDisconnect, onFinish }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream && (type === 'camera' || type === 'screen')) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, type]);

  const configs = {
    mic: {
      title: 'Clara Voice',
      desc: 'Real-time empathic guidance for immediate mental clarity.',
      icon: Mic2,
      control: <MicrophoneControl isConnected={isConnected} audioLevel={audioLevel} onConnect={() => onConnect('mic')} onDisconnect={onDisconnect} />
    },
    camera: {
      title: 'Vision Sensemaking',
      desc: 'Live camera feed for immediate environmental grounding.',
      icon: Camera,
      control: (
        <div className="h-64 glass rounded-3xl flex items-center justify-center group overflow-hidden relative border-2 border-emerald-500/20">
           {permissionError ? (
             <div className="absolute inset-0 bg-red-500/10 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
                <Zap size={32} className="text-red-500 mb-4" />
                <h3 className="text-sm font-black text-red-600 uppercase tracking-widest mb-2 font-['Inter']">Permission Denied</h3>
                <p className="text-[10px] text-red-500/80 font-bold max-w-[200px]">We need camera and microphone access. Please enable them in your browser settings and try again.</p>
                <button onClick={() => onConnect('camera')} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Retry Policy</button>
             </div>
           ) : null}
           {isConnected && stream?.getVideoTracks().length ? (
             <div className="relative w-full h-full">
               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
             </div>
           ) : isConnected ? (
             <div className="w-full h-full bg-black flex items-center justify-center relative">
                <Camera size={32} className="text-emerald-500 animate-pulse" />
                <span className="ml-2 text-[10px] font-bold text-emerald-500 uppercase">Connecting...</span>
             </div>
           ) : (
             <>
               <Camera size={48} className="text-slate-300 dark:text-slate-700" />
               <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => onConnect('camera')} className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 text-center">Enable Camera</button>
               </div>
             </>
           )}
        </div>
      )
    },
    screen: {
      title: 'Screen Orchestration',
      desc: 'Share your workspace for deep collaborative assistance.',
      icon: MonitorUp,
      control: (
        <div className="h-64 glass rounded-3xl flex items-center justify-center group overflow-hidden relative border-2 border-blue-500/20">
           {isConnected && stream?.getVideoTracks().length ? (
             <div className="relative w-full h-full">
               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
             </div>
           ) : isConnected ? (
             <div className="w-full h-full bg-black flex items-center justify-center relative">
                <MonitorUp size={32} className="text-blue-500 animate-pulse" />
                <span className="ml-2 text-[10px] font-bold text-blue-500 uppercase">Connecting...</span>
             </div>
           ) : (
             <>
               <MonitorUp size={48} className="text-slate-300 dark:text-slate-700" />
               <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => onConnect('screen')} className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 whitespace-nowrap">Start Share</button>
               </div>
             </>
           )}
        </div>
      )
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
            <Icon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{config.title}</h2>
            <p className="text-xs font-medium text-slate-400">{config.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence>
            {ragStatus && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="px-4 py-2 glass bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20 flex items-center gap-2"
              >
                <Zap size={14} className="animate-pulse" />
                {ragStatus}
              </motion.div>
            )}
          </AnimatePresence>
          
          {isConnected && (
            <button 
              onClick={onFinish}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-emerald-500/20 transition-all"
            >
              Complete Session
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[500px]">
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-8 h-full flex flex-col">
            <div className="flex-1 flex flex-col justify-center">
              {isConnected && transcript.length === 0 && (
                 <div className="mb-4">
                    <ProcessingIndicator />
                 </div>
              )}
              <div className={cn("transition-opacity", isConnected && transcript.length === 0 ? "opacity-50" : "opacity-100")}>
                {config.control}
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-white/5 pb-2">Clara Support Modules</h4>
               <div className="flex gap-2">
                 {['Vision', 'Voice', 'Safety'].map(agent => (
                   <span key={agent} className="px-2 py-1 bg-slate-100 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest rounded-md text-slate-500">{agent}</span>
                 ))}
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
           <TranscriptView transcript={transcript} />
        </div>
      </div>
    </motion.div>
  );
}
