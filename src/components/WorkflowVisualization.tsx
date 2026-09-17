import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Database,
  FileCode,
  BarChart3,
  Brain,
  Globe,
  Server,
  Workflow,
  ChevronRight,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  step: string;
  icon: React.ElementType;
  label: string;
  category: string;
  description: string;
  color: string;
  glowColor: string;
  isTerminal?: boolean;
}

const pipelineSequence: WorkflowNode[] = [
  {
    id: '1',
    step: '01',
    icon: Globe,
    label: 'Web Scraping',
    category: 'Ingestion',
    description: 'Selenium, BeautifulSoup',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)'
  },
  {
    id: '2',
    step: '02',
    icon: Database,
    label: 'Data Storage',
    category: 'Persistence',
    description: 'PostgreSQL, Pandas',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.4)'
  },
  {
    id: '3',
    step: '03',
    icon: FileCode,
    label: 'Processing',
    category: 'Automation',
    description: 'Python, n8n, Make',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)'
  },
  {
    id: '4',
    step: '04',
    icon: Brain,
    label: 'ML Models',
    category: 'Intelligence',
    description: 'Scikit-Learn, PyTorch',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)'
  },
  {
    id: '5',
    step: '05',
    icon: BarChart3,
    label: 'Visualization',
    category: 'Analytics',
    description: 'Power BI, Tableau',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)'
  },
  {
    id: '6',
    step: '06',
    icon: Server,
    label: 'Deployment',
    category: 'DevOps',
    description: 'Docker, Cloud Pipelines',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)'
  },
  {
    id: '7',
    step: '07',
    icon: CheckCircle2,
    label: 'Production Live',
    category: 'Output',
    description: 'Real-time API & Monitoring',
    color: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.45)',
    isTerminal: true
  },
];

// Replicate sequence across batches
const infiniteNodes = [
  ...pipelineSequence,
  ...pipelineSequence,
  ...pipelineSequence,
  ...pipelineSequence
];

export default function WorkflowVisualization() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-full sm:max-w-xl mx-auto overflow-hidden">
      {/* Decorative Outer Glow & Frame */}
      <div className="relative rounded-2xl sm:rounded-3xl p-[1px] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-cyan-500/30 shadow-2xl backdrop-blur-xl">
        <div className="relative bg-background/85 dark:bg-zinc-950/85 rounded-2xl sm:rounded-3xl p-3 sm:p-5 overflow-hidden border border-white/10 dark:border-zinc-800/60 shadow-inner">

          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Panel */}
          <div className="flex items-center justify-between mb-3 sm:mb-5 pb-2.5 sm:pb-3 border-b border-border/40">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Workflow className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-1 sm:gap-1.5 text-foreground">
                  Data Pipeline Architecture
                  {/* <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 animate-pulse" /> */}
                </h3>
                <p className="text-[9px] sm:text-xs text-muted-foreground truncate max-w-[130px] sm:max-w-none">
                  Sequential ETL to Production
                </p>
              </div>
            </div>

            {/* Live indicator badge */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-400 text-[9px] sm:text-[10px] font-medium tracking-wide">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
              </span>
              {/* <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" /> */}
              <span>Pipeline Active</span>
            </div>
          </div>

          {/* Continuous Flow Stage showing 2 items at a time */}
          <div className="relative w-full overflow-hidden py-1 select-none">
            {/* Left & Right Smooth Fade Gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-r from-background/90 dark:from-zinc-950/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-l from-background/90 dark:from-zinc-950/90 to-transparent z-10 pointer-events-none" />

            {/* Infinite Continuous Sliding Track - NEVER STOPS */}
            <motion.div
              className="flex items-center"
              animate={{
                x: ['0%', '-50%'],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 22,
                  ease: 'linear',
                },
              }}
              style={{
                willChange: 'transform',
                width: 'max-content',
              }}
            >
              {infiniteNodes.map((node, index) => {
                const Icon = node.icon;
                const isHovered = hoveredNode === `${node.id}-${index}`;
                const isFinalNode = node.isTerminal;

                return (
                  <div key={`${node.id}-${index}`} className="flex items-center flex-shrink-0">

                    {/* Node Card (Responsive sizing so exactly 2 cards + arrows are framed cleanly on mobile & desktop) */}
                    <motion.div
                      onMouseEnter={() => setHoveredNode(`${node.id}-${index}`)}
                      onMouseLeave={() => setHoveredNode(null)}
                      whileHover={{ scale: 1.03, y: -2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={`relative w-[118px] sm:w-[155px] md:w-[185px] h-[142px] sm:h-[165px] md:h-[175px] rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-300 ${isFinalNode ? 'ring-1 ring-emerald-500/40' : ''
                        }`}
                      style={{
                        background: `linear-gradient(135deg, ${node.color}15, rgba(15, 15, 20, 0.6))`,
                        border: `1.5px solid ${isHovered ? node.color : `${node.color}35`}`,
                        boxShadow: isHovered
                          ? `0 0 25px ${node.glowColor}, inset 0 0 15px ${node.color}15`
                          : `0 4px 15px rgba(0, 0, 0, 0.25)`,
                      }}
                    >
                      {/* Top Bar inside Card: Step & Category */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[9px] sm:text-[10px] font-mono font-bold px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded bg-white/5 border"
                          style={{ borderColor: `${node.color}40`, color: node.color }}
                        >
                          {node.step}
                        </span>
                        <span className={`text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold truncate max-w-[65px] sm:max-w-none ${isFinalNode ? 'text-emerald-400' : 'text-muted-foreground/80'
                          }`}>
                          {node.category}
                        </span>
                      </div>

                      {/* Icon with glowing aura */}
                      <div className="my-auto flex flex-col items-center justify-center text-center">
                        <div
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center mb-1.5 relative transition-transform duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${node.color}30, ${node.color}10)`,
                            border: `1px solid ${node.color}60`,
                          }}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: node.color }} />
                          {/* Inner pulse */}
                          <div
                            className="absolute inset-0 rounded-lg sm:rounded-xl opacity-30 animate-pulse"
                            style={{ background: node.color }}
                          />
                        </div>

                        {/* Node Label */}
                        <div
                          className="font-bold text-[11px] sm:text-xs md:text-sm tracking-tight line-clamp-1"
                          style={{ color: isHovered ? node.color : 'inherit' }}
                        >
                          {node.label}
                        </div>
                      </div>

                      {/* Description / Tech Badges */}
                      <div
                        className={`text-[8.5px] sm:text-[10px] text-center font-medium truncate px-1 py-0.5 rounded border border-white/5 ${isFinalNode
                          ? 'text-emerald-300 bg-emerald-950/40 border-emerald-500/30 font-semibold'
                          : 'text-muted-foreground/90 bg-black/25'
                          }`}
                        title={node.description}
                      >
                        {node.description}
                      </div>

                      {/* Card Bottom Glow Accent */}
                      <div
                        className="absolute bottom-0 left-3 right-3 h-[1.5px] rounded-full opacity-60"
                        style={{ background: `linear-gradient(90deg, transparent, ${node.color}, transparent)` }}
                      />
                    </motion.div>

                    {/* Between Steps: Moving Forward Arrow vs. Next Batch Trigger Separator */}
                    {!isFinalNode ? (
                      /* Standard Forward Moving-Type Arrow */
                      <div className="relative w-[24px] sm:w-[36px] md:w-[46px] flex flex-col items-center justify-center px-0.5">
                        {/* Flowing Laser Beam Line */}
                        <div className="relative w-full h-[2px] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/40 to-cyan-500/30 overflow-hidden rounded-full">
                          {/* High-speed moving light pulse */}
                          <motion.div
                            className="absolute top-0 bottom-0 w-3 sm:w-4 rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-white"
                            animate={{ left: ['-100%', '100%'] }}
                            transition={{
                              duration: 1.1,
                              repeat: Infinity,
                              ease: 'linear',
                              delay: (index % 3) * 0.25,
                            }}
                          />
                        </div>

                        {/* Dynamic Cascading Chevron Arrows */}
                        <div className="flex items-center justify-center -space-x-1 mt-0.5 text-violet-400/80">
                          <motion.div
                            animate={{ opacity: [0.3, 1, 0.3], x: [0, 1.5, 0] }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
                          >
                            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-400" />
                          </motion.div>
                          <motion.div
                            animate={{ opacity: [0.3, 1, 0.3], x: [0, 1.5, 0] }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                          >
                            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-fuchsia-400" />
                          </motion.div>
                          <motion.div
                            className="hidden sm:block"
                            animate={{ opacity: [0.3, 1, 0.3], x: [0, 1.5, 0] }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      /* Distinct Pipeline Batch Delimiter (NO ARROW connecting 07 to 01) */
                      <div className="relative w-[48px] sm:w-[64px] md:w-[76px] flex flex-col items-center justify-center px-1">
                        <div className="w-full flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-violet-500/10 border border-dashed border-violet-500/30 text-center">
                          <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-400 animate-spin-slow mb-0.5" />
                          <span className="text-[7px] sm:text-[8px] font-mono text-violet-300 font-semibold uppercase tracking-wider leading-tight">
                            Next Job
                          </span>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Footer Pipeline Info */}
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-border/30 flex items-center justify-between text-[10px] sm:text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="truncate max-w-[160px] sm:max-w-none">Linear ETL Pipeline Execution</span>
            </div>
            {/* <span className="font-mono text-[9px] sm:text-[10px] text-emerald-400 font-semibold">Stage 01 → 07 (Live)</span> */}
          </div>

        </div>
      </div>
    </div>
  );
}


