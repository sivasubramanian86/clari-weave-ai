import { motion } from 'framer-motion';
import { 
  Mic2, 
  Camera, 
  MonitorUp, 
  ImageIcon, 
  Music, 
  Video, 
  History, 
  Settings, 
  HelpCircle,
  LayoutDashboard,
  Database,
  LogOut,
  Share2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PremiumLogo } from './PremiumLogo';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onDemoStart?: () => void;
}

const navItems = [
  { id: 'live-mic', label: 'Live Microphone', icon: Mic2, category: 'Live' },
  { id: 'live-camera', label: 'Live Camera', icon: Camera, category: 'Live' },
  { id: 'live-screen', label: 'Live Sharing', icon: MonitorUp, category: 'Live' },
  { id: 'upload-image', label: 'Upload Image', icon: ImageIcon, category: 'Upload' },
  { id: 'upload-audio', label: 'Upload Audio', icon: Music, category: 'Upload' },
  { id: 'upload-video', label: 'Upload Video', icon: Video, category: 'Upload' },
  { id: 'live-insights', label: 'Live Insights', icon: LayoutDashboard, category: 'System' },
  { id: 'past-insights', label: 'Past Insights', icon: Database, category: 'System' },
  { id: 'mind-mesh', label: 'Mind Mesh', icon: Share2, category: 'System' },
  { id: 'logs', label: 'Logs', icon: Database, category: 'System' },
  { id: 'history', label: 'Archive', icon: History, category: 'System' },
  { id: 'settings', label: 'Settings', icon: Settings, category: 'System' },
  { id: 'faq', label: 'Help & FAQ', icon: HelpCircle, category: 'System' },
];

export function Sidebar({ activeTab, onTabChange, onDemoStart }: SidebarProps) {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 z-50 flex flex-col border-r border-slate-200 dark:border-white/5 bg-white/70 dark:bg-black/20 backdrop-blur-3xl overflow-y-auto custom-scrollbar">
      <div className="p-8">
        <PremiumLogo />
      </div>

      <nav className="flex-1 px-4 space-y-8 pb-8">
        {['Live', 'Upload', 'System'].map((cat) => (
          <div key={cat} className="space-y-1">
            <h3 className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">{cat}</h3>
            {navItems.filter(i => i.category === cat).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group relative",
                    isActive 
                      ? "bg-emerald-500/10 text-emerald-500 shadow-sm" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                  )}
                >
                  <Icon size={18} className={cn("transition-transform duration-300", isActive && "scale-110")} />
                  <span className="text-xs font-bold tracking-tight">{item.label}</span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-6 space-y-4 border-t border-slate-200 dark:border-white/5">
        <button 
          onClick={onDemoStart}
          className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 group"
        >
          <div className="relative">
            <Mic2 size={18} />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
          </div>
          <span className="text-xs font-black tracking-widest uppercase">Start Demo</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 transition-colors">
          <LogOut size={18} />
          <span className="text-xs font-bold tracking-tight">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
