import { motion } from 'framer-motion';
import { FileText, FileAudio, FileVideo } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';

export function UploadTabs({ type }: { type: 'image' | 'audio' | 'video' }) {
  const configs = {
    image: {
      title: 'Image Cognition',
      desc: 'Upload images for instant analysis and visual grounding.',
      icon: FileText,
      component: <ImageUpload />
    },
    audio: {
      title: 'Audio Synthesis',
      desc: 'Process recorded memos or audio files for retrospective clarity.',
      icon: FileAudio,
      component: (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl group hover:border-emerald-500/50 transition-colors">
          <FileAudio size={48} className="text-slate-300 dark:text-slate-700 group-hover:text-emerald-500 transition-colors mb-4" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drop Audio File Here</p>
        </div>
      )
    },
    video: {
      title: 'Video Multi-Agent extraction',
      desc: 'Extract deepest insights from video clips across multiple agents.',
      icon: FileVideo,
      component: (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl group hover:border-emerald-500/50 transition-colors">
          <FileVideo size={48} className="text-slate-300 dark:text-slate-700 group-hover:text-emerald-500 transition-colors mb-4" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drop Video File Here</p>
        </div>
      )
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-inner">
          <Icon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{config.title}</h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{config.desc}</p>
        </div>
      </div>
      
      <div className="glass-card p-10">
        {config.component}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Format Support', 'Encryption', 'Privacy'].map(label => (
          <div key={label} className="p-4 glass rounded-2xl border-white/20 dark:border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
