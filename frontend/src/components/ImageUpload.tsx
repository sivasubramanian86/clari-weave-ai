import { useState } from 'react';
import { ImagePlus, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onUpload: (base64: string, mimeType: string) => void;
}

export function ImageUpload({ onUpload }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64Full = reader.result as string;
      setImagePreview(base64Full);
      const base64Data = base64Full.split(',')[1];
      onUpload(base64Data, file.type);
      setTimeout(() => setIsUploading(false), 2000); // Simulate processing time for UX
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        processFile(file);
      }
    }
  };

  return (
    <div className="w-full glass-card group">
      <div className="px-6 py-4 border-b border-white/10 dark:border-white/5 bg-white/30 dark:bg-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Visual Context</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">Show ClariWeave what matters</p>
        </div>
        {imagePreview && !isUploading && (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-pulse" />
        )}
      </div>
      
      <div className="p-6">
        <AnimatePresence mode="wait">
          {!imagePreview ? (
            <motion.label
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all group/label ${isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-300 dark:border-slate-700/50 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-emerald-50/10'}`}
            >
              <div className={`flex flex-col items-center justify-center p-5 transition-colors ${isDragging ? 'text-emerald-500' : 'text-slate-400 group-hover/label:text-emerald-500 dark:group-hover/label:text-emerald-400'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform ${isDragging ? 'bg-emerald-500/20 scale-110' : 'bg-slate-100 dark:bg-slate-800 group-hover/label:scale-110'}`}>
                  <ImagePlus className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold">{isDragging ? 'Drop it to analyze' : 'Drop photo here'}</p>
                <p className="text-[10px] opacity-70 mt-1">Bills, forms, or chaotic desks</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </motion.label>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="relative w-full h-56 rounded-2xl overflow-hidden shadow-inner group/img"
            >
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-4">
                 <button 
                   onClick={() => setImagePreview(null)}
                   className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition-all"
                 >
                   <X size={14} /> Remove Image
                 </button>
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3" />
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest animate-pulse">Analyzing Space...</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
