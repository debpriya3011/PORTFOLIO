import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
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
  { id: '1', icon: Globe, label: 'Web Scraping', description: 'Selenium, BeautifulSoup', color: '#8b5cf6', x: 50, y: 20 },
  { id: '2', icon: Database, label: 'Data Storage', description: 'PostgreSQL, Pandas', color: '#3b82f6', x: 150, y: 80 },
  { id: '3', icon: FileCode, label: 'Processing', description: 'Python, n8n', color: '#10b981', x: 250, y: 20 },
  { id: '4', icon: Brain, label: 'ML Models', description: 'Scikit-learn, TensorFlow', color: '#f59e0b', x: 350, y: 80 },
  { id: '5', icon: BarChart3, label: 'Visualization', description: 'Power BI, Tableau', color: '#ec4899', x: 450, y: 20 },
  { id: '6', icon: Server, label: 'Deployment', description: 'Cloud, Automation', color: '#06b6d4', x: 550, y: 80 },
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

  useEffect(() => {
    // Animate nodes sequentially
    const interval = setInterval(() => {
      setAnimatedNodes(prev => {
        if (prev.length >= nodes.length) return [];
        return [...prev, nodes[prev.length].id];
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] perspective-1000">
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

      {/* Floating particles */}
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

      {/* Title */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
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
