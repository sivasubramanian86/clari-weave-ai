import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { LiveTabs } from './components/tabs/LiveTabs';
import { UploadTabs } from './components/tabs/UploadTabs';
import { InfographicView } from './components/InfographicView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { FAQView } from './components/FAQView';
import { LogsView } from './components/LogsView';
import { MindMeshView } from './components/MindMeshView';
import { useAudioStream } from './hooks/useAudioStream';
import { useWakeWord } from './hooks/useWakeWord';
import { ClaraHologram } from './components/ClaraHologram';
import { Sun, Moon, Mic } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('live-mic');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const { 
    isConnected, 
    transcript, 
    metrics, 
    ragStatus, 
    permissionError,
    audioLevel,
    stream,
    connect, 
    disconnect,
    finishSession,
    sendMedia: baseSendMedia
  } = useAudioStream();

  const [uploadHistory, setUploadHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('uploadHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSendMedia = useCallback(async (base64: string, mimeType: string) => {
    // Call the base sendMedia from hook
    await baseSendMedia(base64, mimeType);
    
    // Create a history entry
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: mimeType.split('/')[0],
      mimeType,
      preview: `data:${mimeType};base64,${base64}`
    };

    setUploadHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 10); // Keep last 10
      localStorage.setItem('uploadHistory', JSON.stringify(updated));
      return updated;
    });
  }, [baseSendMedia]);

  const handleWakeStart = useCallback(() => {
    if (!isConnected) connect('mic');
  }, [isConnected, connect]);

  const handleWakeStop = useCallback(() => {
    if (isConnected) disconnect();
  }, [isConnected, disconnect]);

  useWakeWord({ onStart: handleWakeStart, onStop: handleWakeStop });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const renderContent = () => {
    switch (activeTab) {
      case 'live-mic':
        return <LiveTabs type="mic" isConnected={isConnected} audioLevel={audioLevel} transcript={transcript} ragStatus={ragStatus} stream={stream} permissionError={permissionError} onConnect={() => connect('mic')} onDisconnect={disconnect} onFinish={finishSession} onTabChange={(tab) => setActiveTab(tab === 'analytics' ? 'live-insights' : tab)} />;
      case 'live-camera':
        return <LiveTabs type="camera" isConnected={isConnected} audioLevel={audioLevel} transcript={transcript} ragStatus={ragStatus} stream={stream} permissionError={permissionError} onConnect={() => connect('camera')} onDisconnect={disconnect} onFinish={finishSession} onTabChange={(tab) => setActiveTab(tab === 'analytics' ? 'live-insights' : tab)} />;
      case 'live-screen':
        return <LiveTabs type="screen" isConnected={isConnected} audioLevel={audioLevel} transcript={transcript} ragStatus={ragStatus} stream={stream} permissionError={permissionError} onConnect={() => connect('screen')} onDisconnect={disconnect} onFinish={finishSession} onTabChange={(tab) => setActiveTab(tab === 'analytics' ? 'live-insights' : tab)} />;
      case 'upload-image':
        return <UploadTabs type="image" history={uploadHistory} onUpload={handleSendMedia} onTabChange={(tab) => setActiveTab(tab === 'analytics' ? 'live-insights' : tab)} />;
      case 'upload-audio':
        return <UploadTabs type="audio" history={uploadHistory} onUpload={handleSendMedia} onTabChange={(tab) => setActiveTab(tab === 'analytics' ? 'live-insights' : tab)} />;
      case 'upload-video':
        return <UploadTabs type="video" history={uploadHistory} onUpload={handleSendMedia} onTabChange={(tab) => setActiveTab(tab === 'analytics' ? 'live-insights' : tab)} />;
      case 'live-insights':
        return <InfographicView metrics={metrics} />;
      case 'past-insights':
        return <InfographicView metrics={{
          clarity_score: 85,
          stress_level: 15,
          topic_affinity: { "Productivity": 90, "Focus": 80, "Chaos": 10 },
          action_readiness: "Optimized"
        }} />;
      case 'mind-mesh':
        return <MindMeshView />;
      case 'logs':
        return <LogsView />;
      case 'history':
        return <HistoryView />;
      case 'settings':
        return <SettingsView />;
      case 'faq':
        return <FAQView />;
      default:
        return <LiveTabs type="mic" isConnected={isConnected} audioLevel={audioLevel} transcript={transcript} ragStatus={ragStatus} stream={stream} permissionError={permissionError} onConnect={() => connect('mic')} onDisconnect={disconnect} onFinish={finishSession} onTabChange={(tab) => setActiveTab(tab === 'analytics' ? 'live-insights' : tab)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <ClaraHologram isConnected={isConnected} isSpeaking={transcript.length > 0} metrics={metrics} />

      <main className="flex-1 ml-64 p-8 relative z-10 overflow-x-hidden">
        <header className="flex justify-between items-center mb-12">
           <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">Infrastructure Status</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{isConnected ? 'Uplink Active' : 'Offline'}</span>
                </div>
                <div className="w-px h-3 bg-slate-200 dark:bg-white/10" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latency: 12ms</span>
                <div className="w-px h-3 bg-slate-200 dark:bg-white/10" />
                <div className="flex items-center gap-1.5" title="Say Hey Clara to start, Stop Clara to end">
                  <Mic size={10} className="text-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">Wake Word Active</span>
                </div>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2.5 glass rounded-xl text-slate-500 hover:text-emerald-500 transition-all"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/5">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-800 dark:text-white leading-none">Clara</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase leading-none mt-1">Clarity Tier: Alpha</p>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 dark:from-white/10 dark:to-white/5 flex items-center justify-center border border-white/20">
                    <span className="text-[10px] font-black text-emerald-500">CL</span>
                 </div>
              </div>
           </div>
        </header>

        <section className="relative min-h-[calc(100vh-200px)]">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.99, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.01, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                {renderContent()}
              </motion.div>
           </AnimatePresence>
        </section>

        {/* Global Debug Overlay removed as requested - functionality migrated to Logs tab */}
      </main>

      <footer className="fixed bottom-0 right-0 p-4 z-40">
         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.5em] opacity-50">
           ADK PROTOTYPE // MULTIMODAL MESH V1.0
         </p>
      </footer>
    </div>
  );
}

export default App;

