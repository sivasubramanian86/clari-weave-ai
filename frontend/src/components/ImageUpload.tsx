import { useState } from 'react';
import { ImagePlus, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ImageUpload() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setIsUploading(true);
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        try {
          await fetch('http://localhost:8080/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 })
          });
        } catch (err) {
          console.error("Failed to upload image", err);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
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
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        )}
      </div>
      
      <div className="p-6">
        <AnimatePresence mode="wait">
          {!imagePreview ? (
            <motion.label
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-2xl cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all group/label"
            >
              <div className="flex flex-col items-center justify-center p-5 text-slate-400 group-hover/label:text-emerald-500 dark:group-hover/label:text-emerald-400 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover/label:scale-110 transition-transform">
                  <ImagePlus className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold">Drop photo here</p>
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
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
