import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, Clock } from 'lucide-react';

export function LogsView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const baseUrl = isDev ? `http://${window.location.hostname}:8082` : '';

  useEffect(() => {
    fetch(`${baseUrl}/logs`)
      .then(res => {
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          // SPA fallback returned HTML — backend /logs endpoint not reachable
          throw new Error('Non-JSON response from /logs — backend may not be running');
        }
        return res.json();
      })
      .then(data => {
        // Always ensure we store an array even if backend returns an object/error
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.warn('LogsView fetch failed:', err.message);
        setLogs([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
          <Database size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">System Logs</h2>
          <p className="text-xs font-medium text-slate-400">Historical clarity maps and agent orchestration trails.</p>
        </div>
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-400">
            <Terminal size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold uppercase tracking-widest text-xs">No logs found</p>
          </div>
        ) : (
          logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 border-l-4 border-l-emerald-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Clock size={12} />
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase rounded">
                  {log.emotional_tone || 'Neutral'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-black text-slate-700 dark:text-slate-300 uppercase mb-2 text-[9px]">Topics</h4>
                  <div className="flex flex-wrap gap-1">
                    {log.main_topics.map((t: string) => (
                      <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded text-slate-500">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-slate-700 dark:text-slate-300 uppercase mb-2 text-[9px]">Actions</h4>
                  <ul className="list-disc list-inside text-slate-500 space-y-1">
                    {log.suggested_actions.map((a: string, j: number) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
