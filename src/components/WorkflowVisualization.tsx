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
  Layers
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  glowColor: string;
  x: number; // percentage or SVG coordinate
  y: number; // percentage or SVG coordinate
}

const workflowNodes: WorkflowNode[] = [
  {
    id: '1',
    icon: Globe,
    label: 'Web Scraping',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    x: 80,
    y: 165
  },
  {
    id: '2',
    icon: Database,
    label: 'Data Storage',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    x: 195,
    y: 95
  },
  {
    id: '3',
    icon: FileCode,
    label: 'Processing',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    x: 310,
    y: 175
  },
  {
    id: '4',
    icon: Brain,
    label: 'ML Models',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    x: 425,
    y: 95
  },
  {
    id: '5',
    icon: BarChart3,
    label: 'Visualization',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.5)',
    x: 540,
    y: 175
  },
  {
    id: '6',
    icon: Server,
    label: 'Deployment',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    x: 655,
    y: 95
  }
];

// Smooth cubic bezier wave path connecting nodes (0 to 5)
const wavePath = `
  M 80 165
  C 135 165, 140 95, 195 95
  C 250 95, 255 175, 310 175
  C 365 175, 370 95, 425 95
  C 480 95, 485 175, 540 175
  C 595 175, 600 95, 655 95
`;

export default function WorkflowVisualization() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-2xl mx-auto py-2 select-none">
      {/* Background Blueprint Grid of square boxes */}
      <div className="relative w-full rounded-2xl overflow-hidden py-4 sm:py-6">
        
        {/* The Grid Boxes */}
        <div className="absolute inset-0 opacity-20 dark:opacity-25 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="wf-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wf-grid-pattern)" />
          </svg>
        </div>

        {/* Floating Particle Dots */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { x: '18%', y: '24%', delay: 0 },
            { x: '38%', y: '28%', delay: 1.2 },
            { x: '58%', y: '22%', delay: 0.6 },
            { x: '28%', y: '72%', delay: 1.8 },
            { x: '48%', y: '74%', delay: 0.4 },
            { x: '78%', y: '72%', delay: 1.5 },
          ].map((pt, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-violet-400/30"
              style={{ left: pt.x, top: pt.y }}
              animate={{
                y: [0, -6, 0],
                opacity: [0.25, 0.6, 0.25],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                delay: pt.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Interactive Responsive SVG Canvas */}
        <div className="relative w-full aspect-[735/270] max-h-[300px]">
          <svg
            viewBox="0 0 735 270"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Neon Wave Gradient */}
              <linearGradient id="wf-wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="20%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="80%" stopColor="#ec4899" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>

              {/* Glowing Blur Filter */}
              <filter id="wf-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Glowing Backdrop Wave */}
            <path
              d={wavePath}
              fill="none"
              stroke="url(#wf-wave-gradient)"
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity="0.35"
              filter="url(#wf-glow)"
            />

            {/* Crisp Foreground Wave Line */}
            <path
              d={wavePath}
              fill="none"
              stroke="url(#wf-wave-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* Animated Laser Light Pulses traveling across the wave */}
            {[0, 2.2].map((delay, idx) => (
              <motion.circle
                key={idx}
                r="4.5"
                fill="#ffffff"
                filter="drop-shadow(0 0 6px #ec4899)"
                initial={{ offsetDistance: '0%' }}
                animate={{ offsetDistance: '100%' }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay,
                }}
                style={{
                  offsetPath: `path('${wavePath.replace(/\s+/g, ' ').trim()}')`,
                }}
              />
            ))}
          </svg>

          {/* HTML Overlay Nodes perfectly positioned over the SVG wave */}
          <div className="absolute inset-0 pointer-events-none">
            {workflowNodes.map((node) => {
              const Icon = node.icon;
              const isHovered = hoveredNode === node.id;
              // Convert SVG coords (735 x 270) to percentages
              const leftPercent = (node.x / 735) * 100;
              const topPercent = (node.y / 270) * 100;

              return (
                <div
                  key={node.id}
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="relative flex flex-col items-center justify-center cursor-pointer group"
                  >
                    {/* Node Card Box */}
                    <div
                      className="w-[52px] h-[52px] sm:w-[68px] sm:h-[68px] md:w-[76px] md:h-[76px] rounded-xl sm:rounded-2xl p-2 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-md"
                      style={{
                        background: `linear-gradient(135deg, ${node.color}15, rgba(15, 15, 25, 0.85))`,
                        border: `1.5px solid ${isHovered ? node.color : `${node.color}40`}`,
                        boxShadow: isHovered
                          ? `0 0 20px ${node.glowColor}, inset 0 0 10px ${node.color}20`
                          : `0 4px 12px rgba(0, 0, 0, 0.4)`,
                      }}
                    >
                      {/* Icon */}
                      <div className="relative">
                        <Icon
                          className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110"
                          style={{ color: node.color }}
                        />
                      </div>

                      {/* Node Label */}
                      <span
                        className="text-[8px] sm:text-[9.5px] md:text-[10px] font-semibold text-center mt-1 leading-tight tracking-tight whitespace-nowrap transition-colors"
                        style={{ color: isHovered ? node.color : 'rgba(240, 240, 255, 0.9)' }}
                      >
                        {node.label}
                      </span>
                    </div>

                    {/* Subtle outer pulse dot under node */}
                    <div
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full opacity-60 transition-opacity"
                      style={{ background: node.color }}
                    />
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Caption matching original */}
        <div className="mt-3 sm:mt-5 flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground/80 font-medium">
          <Workflow className="w-3.5 h-3.5 text-violet-400" />
          <span>Data Engineering Workflow</span>
          <Layers className="w-3.5 h-3.5 text-violet-400" />
        </div>
      </div>
    </div>
  );
}
