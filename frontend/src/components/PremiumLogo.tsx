import { motion } from 'framer-motion';

export function PremiumLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <div className="relative w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black shadow-2xl">
           <motion.svg 
             viewBox="0 0 24 24" 
             className="w-6 h-6 fill-none stroke-current stroke-[2.5]"
             initial={{ strokeDasharray: "0 100" }}
             animate={{ strokeDasharray: "100 0" }}
             transition={{ duration: 1.5, ease: "easeInOut" }}
           >
             <path d="M12 3L4 9v6l8 6 8-6V9l-8-6z" />
             <path d="M12 3v18" />
             <path d="M4 9l16 6" />
             <path d="M4 15l16-6" />
           </motion.svg>
        </div>
      </div>
      <div>
        <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none text-slate-800 dark:text-white transition-colors">
          Clari<span className="text-emerald-500">Weave</span>
        </h1>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1 transition-colors">
          Multimodal Intelligence
        </p>
      </div>
    </div>
  );
}
