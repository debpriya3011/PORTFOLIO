import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
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
    color: '#0284c7', // Sky
    glowColor: 'rgba(2, 132, 199, 0.4)',
    x: 80,
    y: 165
  },
  {
    id: '2',
    icon: Database,
    label: 'Data Storage',
    color: '#2563eb', // Blue
    glowColor: 'rgba(37, 99, 235, 0.4)',
    x: 195,
    y: 95
  },
  {
    id: '3',
    icon: FileCode,
    label: 'ETL Pipeline',
    color: '#059669', // Emerald
    glowColor: 'rgba(5, 150, 105, 0.4)',
    x: 310,
    y: 175
  },
  {
    id: '4',
    icon: Brain,
    label: 'ML Workflows',
    color: '#d97706', // Amber
    glowColor: 'rgba(217, 119, 6, 0.4)',
    x: 425,
    y: 95
  },
  {
    id: '5',
    icon: BarChart3,
    label: 'Analytics',
    color: '#4f46e5', // Indigo
    glowColor: 'rgba(79, 70, 229, 0.4)',
    x: 540,
    y: 175
  },
  {
    id: '6',
    icon: Server,
    label: 'Automation',
    color: '#0d9488', // Teal
    glowColor: 'rgba(13, 148, 136, 0.4)',
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative w-full max-w-2xl mx-auto py-2 select-none">
      {/* Blueprint Grid Container */}
      <div className="relative w-full rounded-2xl overflow-hidden py-4 sm:py-6 border border-border/50 bg-card/30 backdrop-blur-sm">

        {/* The Grid Boxes */}
        <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="wf-grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
                <path
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke={isDark ? "rgba(148, 163, 184, 0.4)" : "rgba(100, 116, 139, 0.3)"}
                  strokeWidth="0.75"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wf-grid-pattern)" />
          </svg>
        </div>

        {/* Interactive Responsive SVG Canvas */}
        <div className="relative w-full aspect-[735/270] max-h-[300px]">
          <svg
            viewBox="0 0 735 270"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Technical Precision Gradient */}
              <linearGradient id="wf-wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                <stop offset="25%" stopColor="#2563eb" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#d97706" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Subtle Backdrop Line */}
            <path
              d={wavePath}
              fill="none"
              stroke="url(#wf-wave-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity={isDark ? "0.2" : "0.25"}
            />

            {/* Crisp Foreground Line */}
            <path
              d={wavePath}
              fill="none"
              stroke="url(#wf-wave-gradient)"
              strokeWidth="1.75"
              strokeLinecap="round"
              opacity={isDark ? "0.85" : "0.95"}
            />

            {/* Animated Laser Light Pulses */}
            {[0, 2.2].map((delay, idx) => (
              <motion.circle
                key={idx}
                r="3.5"
                fill={isDark ? "#38bdf8" : "#0284c7"}
                filter="drop-shadow(0 0 4px #38bdf8)"
                initial={{ offsetDistance: '0%' }}
                animate={{ offsetDistance: '100%' }}
                transition={{
                  duration: 5,
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

          {/* HTML Overlay Nodes */}
          <div className="absolute inset-0 pointer-events-none">
            {workflowNodes.map((node) => {
              const Icon = node.icon;
              const isHovered = hoveredNode === node.id;
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
                    whileHover={{ scale: 1.06, y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="relative flex flex-col items-center justify-center cursor-pointer group"
                  >
                    {/* Node Card Box */}
                    <div
                      className="w-[52px] h-[52px] sm:w-[68px] sm:h-[68px] md:w-[76px] md:h-[76px] rounded-xl p-2 flex flex-col items-center justify-center transition-all duration-200 backdrop-blur-md"
                      style={{
                        background: isDark
                          ? 'rgba(15, 23, 42, 0.85)'
                          : 'rgba(255, 255, 255, 0.9)',
                        border: `1px solid ${
                          isHovered
                            ? node.color
                            : isDark
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(0, 0, 0, 0.08)'
                        }`,
                        boxShadow: isHovered
                          ? isDark
                            ? `0 4px 16px ${node.glowColor}`
                            : `0 4px 12px ${node.glowColor.replace('0.4', '0.2')}`
                          : 'none',
                      }}
                    >
                      {/* Icon */}
                      <div className="relative">
                        <Icon
                          className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110"
                          style={{ color: node.color }}
                        />
                      </div>

                      {/* Node Label */}
                      <span
                        className="text-[8px] sm:text-[9.5px] md:text-[10px] font-medium font-mono text-center mt-1 leading-tight tracking-tight whitespace-nowrap transition-colors text-foreground"
                      >
                        {node.label}
                      </span>
                    </div>

                    {/* Subtle status dot under node */}
                    <div
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full opacity-80"
                      style={{ background: node.color }}
                    />
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Caption */}
        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground font-mono">
          <Workflow className="w-3.5 h-3.5 text-sky-500" />
          <span>Data Engineering & Automation Pipeline</span>
          <Layers className="w-3.5 h-3.5 text-emerald-500" />
        </div>
      </div>
    </div>
  );
}

