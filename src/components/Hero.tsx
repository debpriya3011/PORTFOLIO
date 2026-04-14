import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Download } from 'lucide-react';
import WorkflowVisualization from './WorkflowVisualization';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-fuchsia-500/20 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4 sm:mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse mr-2" />
              <span className="text-sm text-violet-500 font-medium">Available for opportunities</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6"
            >
              Hi, I'm{' '}
              <span className="gradient-text">Debpriya Santra</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground mb-3 sm:mb-4"
            >
              Data Engineer & Software Developer
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Passionate about building scalable data pipelines, automation solutions, 
              and machine learning workflows. Experienced in Python, SQL, and cloud technologies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get in Touch
                <ArrowDown className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open('https://linkedin.com/in/debpriya-santra-459519251', '_blank')}
              >
                <Download className="mr-2 w-4 h-4" />
                View Resume
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 gap-2 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-bold gradient-text">1.5+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Years Exp.</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold gradient-text">20+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Projects</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold gradient-text">5+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Certs</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Workflow Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="hidden md:block lg:block"
          >
            <WorkflowVisualization />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - shown on all screens except large where workflow is displayed */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ willChange: "transform" }}
        animate={{ translateY: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-violet-500"
            animate={{ translateY: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
