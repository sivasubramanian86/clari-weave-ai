import { motion } from 'framer-motion';
import { Share2, Zap, Shield, Database, MessageSquare, Brain } from 'lucide-react';

const agents = [
  { id: 'coordinator', name: 'Coordinator', icon: Brain, color: 'text-emerald-500', pos: { x: 50, y: 50 } },
  { id: 'weaver', name: 'Weaver', icon: MessageSquare, color: 'text-blue-500', pos: { x: 20, y: 30 } },
  { id: 'analyst', name: 'Analyst', icon: Zap, color: 'text-amber-500', pos: { x: 80, y: 30 } },
  { id: 'archivist', name: 'Archivist', icon: Database, color: 'text-purple-500', pos: { x: 20, y: 70 } },
  { id: 'guardian', name: 'Guardian', icon: Shield, color: 'text-rose-500', pos: { x: 80, y: 70 } },
  { id: 'linguist', name: 'Linguist', icon: Share2, color: 'text-cyan-500', pos: { x: 50, y: 15 } },
];

export function MindMeshView() {
  return (
    <div className="space-y-8 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Agentic Mind Mesh</h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Real-time visualization of Clara's decentralized neural reasoning.</p>
        </div>
        <div className="px-4 py-2 glass rounded-2xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Orchestration Active</span>
        </div>
      </div>

      <div className="glass-card aspect-video relative overflow-hidden bg-slate-900/50 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-[40px] flex items-center justify-center p-12">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b98110_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        
        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {agents.map((agent) => (
            agent.id !== 'coordinator' && (
              <motion.line
                key={`line-${agent.id}`}
                x1={`${agents[0].pos.x}%`}
                y1={`${agents[0].pos.y}%`}
                x2={`${agent.pos.x}%`}
                y2={`${agent.pos.y}%`}
                stroke="currentColor"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.2 }}
                className={agent.color}
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            )
          ))}
        </svg>

        {/* Agent Nodes */}
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <motion.div
              key={agent.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: agents.indexOf(agent) * 0.1 }}
              style={{ left: `${agent.pos.x}%`, top: `${agent.pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10"
            >
              <div className={`p-4 rounded-3xl bg-slate-800/80 backdrop-blur-xl border border-white/10 shadow-xl group hover:scale-110 transition-transform duration-300 cursor-pointer ${agent.id === 'coordinator' ? 'scale-125 border-emerald-500/30' : ''}`}>
                <Icon className={agent.color} size={agent.id === 'coordinator' ? 32 : 24} />
                
                {/* Active Pulse */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-current ${agent.color} animate-ping opacity-20`} />
              </div>
              <div className="text-center">
                <p className={`text-[10px] font-black uppercase tracking-widest ${agent.id === 'coordinator' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {agent.name}
                </p>
                {agent.id === 'coordinator' && (
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Primary Mind</p>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Neural Pulse Circles */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute w-96 h-96 rounded-full border border-emerald-500/20"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          className="absolute w-[600px] h-[600px] rounded-full border border-emerald-500/10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-emerald-500">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Orchestration Phase</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Clara is currently synchronizing inputs from the Linguist and Weaver to formulate an empathic response.</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-blue-500">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Visual Ground Truth</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">The Analyst is processing your environment cues to provide context-aware suggestions.</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-purple-500">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-2">Memory Retrieval</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">The Archivist is scanning past interaction patterns to personalize this session's advice.</p>
        </div>
      </div>
    </div>
  );
}
