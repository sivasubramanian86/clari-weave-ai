import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Clock, Zap, Shield, CheckCircle } from 'lucide-react';

interface LogsViewProps {
  liveLogs?: any[];
}

const MOCK_LOGS = [
  {
    timestamp: new Date().toISOString(),
    main_topics: ["Digital Wellness", "Clutter Mitigation"],
    suggested_actions: ["Cleaned workspace", "Organized desktop"],
    emotional_tone: "Focused",
    status: "completed",
    step: "save_clarity_map_and_shard"
  },
  {
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    main_topics: ["Anxiety Management", "Focus Blocks"],
    suggested_actions: ["Breathwork session", "Screen time audit"],
    emotional_tone: "Calm",
    status: "completed",
    step: "extract_session_metrics"
  }
];

export function LogsView({ liveLogs = [] }: LogsViewProps) {
  const [historicalLogs, setHistoricalLogs] = useState<any[]>([]);

  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const baseUrl = isDev ? `http://${window.location.hostname}:8082` : '';

  useEffect(() => {
    fetch(`${baseUrl}/logs`)
      .then(res => {
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) throw new Error('Non-JSON response');
        return res.json();
      })
      .then(data => {
        setHistoricalLogs(Array.isArray(data) && data.length > 0 ? data : MOCK_LOGS);
      })
      .catch(() => {
        setHistoricalLogs(MOCK_LOGS);
      });
  }, [baseUrl]);

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20">
      {/* Live Orchestration Trails Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
            <Zap size={24} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Real-time Orchestration</h2>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Live agent action trails and tool executions.</p>
          </div>
        </div>

        <div className="glass-card overflow-hidden bg-slate-900/50 dark:bg-black/40 border border-white/5">
          <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Active Trail Monitor</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-500/50">V1.0.4-LATEST</span>
          </div>
          
          <div className="p-6 max-h-[300px] overflow-y-auto space-y-3 font-mono text-[11px]">
            <AnimatePresence>
              {liveLogs.length === 0 ? (
                <p className="text-slate-500 italic opacity-50">Waiting for agent orchestration events...</p>
              ) : (
                liveLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 border-l border-white/10 pl-4 py-1"
                  >
                    <span className="text-slate-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-blue-400 shrink-0 uppercase font-black">{log.agent || 'System'}</span>
                    <span className="text-slate-300">
                      {log.status === 'started' ? '>' : '✓'} {log.step} 
                      {log.status === 'completed' && <span className="text-emerald-500 ml-2">[SUCCESS]</span>}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

      {/* Historical Logs Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">System Logs</h2>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Historical clarity maps retrieved from node storage.</p>
          </div>
        </div>

        <div className="space-y-4">
          {historicalLogs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 border-l-4 border-l-blue-500 hover:border-l-emerald-500 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Clock size={12} />
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase rounded">
                    {log.emotional_tone || 'Neutral'}
                  </span>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase rounded flex items-center gap-1">
                    <Shield size={10} /> Verified
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                <div>
                  <h4 className="font-black text-slate-700 dark:text-slate-300 uppercase mb-3 text-[9px] tracking-widest flex items-center gap-2">
                    <CheckCircle size={12} className="text-emerald-500" />
                    Insight Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(log.main_topics) && log.main_topics.map((t: string) => (
                      <span key={t} className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-500 font-medium border border-slate-200/50 dark:border-white/5">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-slate-700 dark:text-slate-300 uppercase mb-3 text-[9px] tracking-widest flex items-center gap-2">
                    <Database size={12} className="text-blue-500" />
                    Suggested Actions
                  </h4>
                  <ul className="space-y-2">
                    {Array.isArray(log.suggested_actions) && log.suggested_actions.map((a: string, j: number) => (
                      <li key={j} className="flex gap-2 text-slate-500 leading-tight">
                        <span className="text-emerald-500 font-bold">↳</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
