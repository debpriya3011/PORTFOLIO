import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Download } from 'lucide-react';
import WorkflowVisualization from './WorkflowVisualization';

export default function Hero() {
  return (
    <section className="relative min-h-[75vh] md:min-h-screen flex flex-col items-center justify-center overflow-x-hidden w-full max-w-full pt-4 md:pt-16 pb-10 sm:pb-16">
      {/* Background Architectural Lighting */}
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(56,189,248,0.12),transparent_70%)] pointer-events-none dark:opacity-100 opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            {/* Status Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-4 sm:mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 tracking-wide">
                Available for opportunities
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-3 sm:mb-4 md:mb-6 text-foreground"
            >
              Hi, I'm{' '}
              <span className="gradient-text font-black">
                Debpriya Santra
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-base sm:text-xl font-medium text-foreground/80 mb-3 sm:mb-4"
            >
              Data Engineer & Software Developer
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-xs sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Building resilient data pipelines, workflow automations, and scalable software systems.
              Specialized in Python, SQL, REST APIs, and cloud infrastructure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm font-medium transition-all"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get in Touch
                <ArrowDown className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border hover:bg-accent transition-all font-medium"
                onClick={() => window.open('https://linkedin.com/in/debpriya-santra-459519251', '_blank')}
              >
                <Download className="mr-2 w-4 h-4" />
                View Resume
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="grid grid-cols-3 gap-3 sm:gap-6 mt-6 sm:mt-10 pt-5 sm:pt-6 border-t border-border/60"
            >
              <div className="p-2 sm:p-3 rounded-lg bg-card/40 border border-border/40">
                <div className="text-lg sm:text-2xl font-bold font-mono text-foreground">1.5+</div>
                <div className="text-[11px] sm:text-xs text-muted-foreground font-medium">Years Exp.</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-card/40 border border-border/40">
                <div className="text-lg sm:text-2xl font-bold font-mono text-foreground">20+</div>
                <div className="text-[11px] sm:text-xs text-muted-foreground font-medium">Projects</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-card/40 border border-border/40">
                <div className="text-lg sm:text-2xl font-bold font-mono text-foreground">10+</div>
                <div className="text-[11px] sm:text-xs text-muted-foreground font-medium">Certs</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Workflow Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
            className="w-full mt-4 lg:mt-0 max-w-full overflow-hidden"
          >
            <WorkflowVisualization />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-8 sm:mt-12">
          <motion.div
            className="cursor-pointer"
            style={{ willChange: "transform" }}
            animate={{ translateY: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="w-5 h-9 rounded-full border border-border flex items-start justify-center p-1.5 bg-background/60 backdrop-blur-sm shadow-xs hover:border-foreground/40 transition-colors">
              <motion.div
                className="w-1 h-1.5 rounded-full bg-foreground/60"
                animate={{ translateY: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
