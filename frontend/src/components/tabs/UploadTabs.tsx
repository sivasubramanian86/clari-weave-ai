import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, FileAudio, FileVideo, CheckCircle2 } from 'lucide-react';
import { ImageUpload } from '../ImageUpload';

interface Props {
  type: 'image' | 'audio' | 'video';
  onUpload: (base64: string, mimeType: string) => void;
  onTabChange: (tab: string) => void;
}

export function UploadTabs({ type, onUpload, onTabChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      onUpload(base64, file.type);
      setSuccess(true);
      setIsUploading(false);
      setTimeout(() => setSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const renderGenericDropzone = (icon: React.ReactNode, text: string, accept: string) => (
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-3xl group transition-all cursor-pointer overflow-hidden ${isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-300 dark:border-white/10 hover:border-emerald-500/50'}`}
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex flex-col items-center">
            <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Upload Complete! Clara is analyzing...</p>
          </motion.div>
        ) : isUploading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4" />
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest animate-pulse">Processing Stream...</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-slate-400 group-hover:text-emerald-500 transition-colors">
            {icon}
            <p className="text-sm font-semibold mt-4">{text}</p>
            <p className="text-[10px] opacity-70 mt-1">Drag and drop or click to browse</p>
          </motion.div>
        )}
      </AnimatePresence>
      <input type="file" className="hidden" accept={accept} onChange={handleFileChange} />
    </label>
  );

  const configs = {
    image: {
      title: 'Image Cognition',
      desc: 'Upload images for instant analysis and visual grounding.',
      icon: FileText,
      component: <ImageUpload onUpload={onUpload} />
    },
    audio: {
      title: 'Audio Synthesis',
      desc: 'Process recorded memos or audio files for retrospective clarity.',
      icon: FileAudio,
      component: renderGenericDropzone(<FileAudio size={48} />, "Drop Audio File Here", "audio/*")
    },
    video: {
      title: 'Video Multi-Agent extraction',
      desc: 'Extract deepest insights from video clips across multiple agents.',
      icon: FileVideo,
      component: renderGenericDropzone(<FileVideo size={48} />, "Drop Video File Here", "video/*")
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-inner">
            <Icon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{config.title}</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{config.desc}</p>
          </div>
        </div>
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => onTabChange('live-insights')}
          className="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.05] whitespace-nowrap"
        >
          <CheckCircle2 size={16} />
          View Analysis Results
        </motion.button>
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
