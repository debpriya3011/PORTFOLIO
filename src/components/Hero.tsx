import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Download } from 'lucide-react';
import WorkflowVisualization from './WorkflowVisualization';

export default function Hero() {
  return (
    <section className="relative min-h-[75vh] md:min-h-screen flex flex-col items-center justify-center overflow-x-hidden w-full max-w-full pt-4 md:pt-16 pb-10 sm:pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-3 sm:mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse mr-2" />
              <span className="text-xs sm:text-sm text-violet-500 font-medium">Available for opportunities</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4 md:mb-6"
            >
              Hi, I'm{' '}
              <span className="gradient-text">Debpriya Santra</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-xl text-muted-foreground mb-2 sm:mb-4 font-medium"
            >
              Data Engineer & Software Developer
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xs sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Passionate about building scalable data pipelines, automation solutions,
              and machine learning workflows. Experienced in Python, SQL, and cloud technologies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 shadow-md shadow-violet-500/20"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 gap-2 sm:gap-8 mt-6 sm:mt-10 pt-5 sm:pt-6 border-t border-border/50"
            >
              <div>
                <div className="text-xl sm:text-3xl font-bold gradient-text">1.5+</div>
                <div className="text-[11px] sm:text-sm text-muted-foreground">Years Exp.</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-bold gradient-text">20+</div>
                <div className="text-[11px] sm:text-sm text-muted-foreground">Projects</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-bold gradient-text">10+</div>
                <div className="text-[11px] sm:text-sm text-muted-foreground">Certs</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Workflow Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="w-full mt-4 lg:mt-0 max-w-full overflow-hidden"
          >
            <WorkflowVisualization />
          </motion.div>
        </div>

        {/* Jumping scroll indicator - cleanly spaced below content */}
        <div className="flex justify-center mt-8 sm:mt-12">
          <motion.div
            className="cursor-pointer"
            style={{ willChange: "transform" }}
            animate={{ translateY: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2 bg-background/50 backdrop-blur-sm shadow-sm hover:border-violet-500/50 transition-colors">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-sm shadow-violet-500"
                animate={{ translateY: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
