import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
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
  description: string;
  color: string;
  x: number;
  y: number;
}

const nodes: WorkflowNode[] = [
  { id: '1', icon: Globe, label: 'Web Scraping', description: 'Selenium, BeautifulSoup', color: '#8b5cf6', x: 10, y: 250 },
  { id: '2', icon: Database, label: 'Data Storage', description: 'PostgreSQL, Pandas', color: '#3b82f6', x: 100, y: 200 },
  { id: '3', icon: FileCode, label: 'Processing', description: 'Python, n8n', color: '#10b981', x: 190, y: 250 },
  { id: '4', icon: Brain, label: 'ML Models', description: 'Scikit-learn, TensorFlow', color: '#f59e0b', x: 280, y: 200 },
  { id: '5', icon: BarChart3, label: 'Visualization', description: 'Power BI, Tableau', color: '#ec4899', x: 370, y: 250 },
  { id: '6', icon: Server, label: 'Deployment', description: 'Cloud, Automation', color: '#06b6d4', x: 460, y: 200 },
];

const connections = [
  { from: '1', to: '2' },
  { from: '2', to: '3' },
  { from: '3', to: '4' },
  { from: '4', to: '5' },
  { from: '5', to: '6' },
];

export default function WorkflowVisualization() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [animatedNodes, setAnimatedNodes] = useState<string[]>([]);
  const [jumpingNode, setJumpingNode] = useState<string | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show all nodes immediately instead of animating sequentially
    setAnimatedNodes(nodes.map(n => n.id));
  }, []);

  // Jumping animation for tablet/laptop view
  useEffect(() => {
    const jumpInterval = setInterval(() => {
      setJumpingNode(prev => {
        const currentIndex = prev ? nodes.findIndex(n => n.id === prev) : -1;
        const nextIndex = (currentIndex + 1) % nodes.length;
        return nodes[nextIndex].id;
      });
    }, 800); // Jump every 800ms

    return () => clearInterval(jumpInterval);
  }, []);

  // Auto-scroll for mobile
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (mobileScrollRef.current) {
        const maxScroll = mobileScrollRef.current.scrollWidth - mobileScrollRef.current.clientWidth;
        const currentScroll = mobileScrollRef.current.scrollLeft;
        
        if (currentScroll >= maxScroll) {
          mobileScrollRef.current.scrollLeft = 0;
        } else {
          mobileScrollRef.current.scrollLeft += 2; // Slightly faster scroll
        }
      }
    }, 30); // Faster interval for smoother scroll

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="relative w-full h-[400px] sm:h-[500px]">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Desktop View: Workflow diagram with connections */}
      <div className="hidden lg:block">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            return (
              <motion.path
                key={`${conn.from}-${conn.to}`}
                d={`M ${fromNode.x + 40} ${fromNode.y + 40} Q ${(fromNode.x + toNode.x) / 2} ${fromNode.y} ${toNode.x + 40} ${toNode.y + 40}`}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: animatedNodes.includes(toNode.id) ? 1 : 0,
                  opacity: animatedNodes.includes(toNode.id) ? 1 : 0.3
                }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, idx) => {
          const Icon = node.icon;
          const isActive = activeNode === node.id;
          const isAnimated = animatedNodes.includes(node.id);

          return (
            <motion.div
              key={node.id}
              className="absolute"
              style={{ left: node.x, top: node.y }}
              initial={{ opacity: 0, scale: 0, rotateY: -90 }}
              animate={{
                opacity: isAnimated ? 1 : 0.3,
                scale: isActive ? 1.1 : 1,
                rotateY: isAnimated ? 0 : -90
              }}
              transition={{
                duration: 0.6,
                delay: idx * 0.1,
                type: 'spring',
                stiffness: 100
              }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <div
                className={`
                  relative w-20 h-20 rounded-2xl cursor-pointer
                  flex flex-col items-center justify-center
                  transition-all duration-300 transform-3d
                  ${isActive ? 'z-20' : 'z-10'}
                `}
                style={{
                  background: `linear-gradient(135deg, ${node.color}20, ${node.color}10)`,
                  border: `2px solid ${isActive ? node.color : `${node.color}40`}`,
                  boxShadow: isActive
                    ? `0 0 30px ${node.color}60, 0 10px 40px rgba(0,0,0,0.3)`
                    : `0 4px 20px rgba(0,0,0,0.2)`,
                }}
              >
                <Icon
                  className="w-8 h-8 mb-1"
                  style={{ color: node.color }}
                />
                <span className="text-[10px] font-medium text-center px-1" style={{ color: node.color }}>
                  {node.label}
                </span>

                {/* Glow effect */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `radial-gradient(circle, ${node.color}30, transparent 70%)`,
                    }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Tooltip */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <div className="glass px-3 py-2 rounded-lg text-xs">
                    <div className="font-medium" style={{ color: node.color }}>{node.label}</div>
                    <div className="text-muted-foreground">{node.description}</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Tablet View: Vertical stack with arrows */}
      <div className="hidden sm:block lg:hidden">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          {nodes.map((node, idx) => {
            const Icon = node.icon;
            const isActive = activeNode === node.id;

            return (
              <div key={node.id} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    y: jumpingNode === node.id ? [-10, 0, -10] : 0,
                    scale: jumpingNode === node.id ? [1, 1.1, 1] : 1
                  }}
                  transition={{ 
                    delay: idx * 0.2,
                    y: { duration: 0.6, repeat: jumpingNode === node.id ? Infinity : 0 },
                    scale: { duration: 0.6, repeat: jumpingNode === node.id ? Infinity : 0 }
                  }}
                  onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                  className="cursor-pointer"
                >
                  <div
                    className={`
                      w-20 h-20 rounded-2xl cursor-pointer
                      flex flex-col items-center justify-center
                      transition-all duration-300
                      ${isActive ? 'scale-110' : ''}
                    `}
                    style={{
                      background: `linear-gradient(135deg, ${node.color}20, ${node.color}10)`,
                      border: `2px solid ${isActive ? node.color : `${node.color}40`}`,
                      boxShadow: isActive
                        ? `0 0 20px ${node.color}60`
                        : `0 4px 20px rgba(0,0,0,0.2)`,
                    }}
                  >
                    <Icon
                      className="w-6 h-6 mb-1"
                      style={{ color: node.color }}
                    />
                    <span className="text-[10px] font-medium text-center px-1" style={{ color: node.color }}>
                      {node.label}
                    </span>
                  </div>
                </motion.div>

                {/* Arrow */}
                {idx < nodes.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.2 + 0.3 }}
                    className="mx-4"
                  >
                    <div className="text-violet-500">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 0L0 10h7v10h6V10h7z" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Horizontal scrollable cards */}
      <div 
        ref={mobileScrollRef}
        className="sm:hidden flex overflow-x-auto gap-3 px-4 py-8 items-center h-full"
        style={{ 
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none' // IE/Edge
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none; // Chrome/Safari
          }
        `}</style>
        {nodes.map((node, idx) => {
          const Icon = node.icon;
          const isActive = activeNode === node.id;

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              className="flex-shrink-0"
            >
              <div
                className={`
                  w-24 h-28 rounded-xl cursor-pointer
                  flex flex-col items-center justify-center
                  transition-all duration-300
                  ${isActive ? 'scale-105' : ''}
                `}
                style={{
                  background: `linear-gradient(135deg, ${node.color}20, ${node.color}10)`,
                  border: `2px solid ${isActive ? node.color : `${node.color}40`}`,
                }}
              >
                <Icon 
                  className="w-6 h-6 mb-1" 
                  style={{ color: node.color }}
                />
                <span className="text-[10px] font-medium text-center px-1" style={{ color: node.color }}>
                  {node.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating particles */}
      <div className="hidden lg:block">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full bg-violet-500/30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Title - Hidden on mobile, shown on larger screens */}
      <motion.div
        className="hidden sm:flex absolute bottom-4 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Workflow className="w-4 h-4" />
          <span className="text-sm">Data Engineering Workflow</span>
          <Layers className="w-4 h-4" />
        </div>
      </motion.div>
    </div>
  );
}
