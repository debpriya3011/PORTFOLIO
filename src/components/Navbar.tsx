import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPath = location.pathname === '/blueprints' ? '/guides' : location.pathname;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/guides', label: 'Blueprints' },
    { path: '/posts', label: 'Posts' },
    { path: '/admin', label: 'Admin' },
  ];

  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const controls = useAnimationControls();
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const prevPathRef = useRef<string | null>(null);
  const hasMeasuredRef = useRef(false);

  const getTabRect = useCallback((path: string) => {
    const el = linkRefs.current[path];
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { left: rect.left, width: rect.width, top: rect.bottom + 2 };
  }, []);

  // On route change, animate the indicator
  useEffect(() => {
    const rect = getTabRect(currentPath);
    if (!rect) return;

    const isFirstMount = prevPathRef.current === null;
    const isRouteChange = prevPathRef.current !== null && prevPathRef.current !== currentPath;
    prevPathRef.current = currentPath;

    if (isFirstMount) {
      // First mount: just place indicator at tab with no fly-in
      controls.set({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
      });
      setIndicatorVisible(true);
      hasMeasuredRef.current = true;
    } else if (isRouteChange) {
      // Route change: fly from bottom with a curve
      setIndicatorVisible(true);

      // Step 1: Instantly teleport to bottom of viewport (starting position)
      controls.set({
        top: window.innerHeight,
        left: window.innerWidth / 2 - rect.width / 2,
        width: rect.width,
        opacity: 0.6,
        scaleX: 0.3,
        scaleY: 3,
      });

      // Step 2: Animate to the tab in a curved path
      controls.start({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        transition: {
          top: {
            type: 'spring',
            stiffness: 55,
            damping: 13,
            mass: 0.4,
          },
          left: {
            type: 'spring',
            stiffness: 30,
            damping: 11,
            mass: 0.7,
          },
          scaleX: {
            type: 'spring',
            stiffness: 80,
            damping: 14,
            delay: 0.35,
          },
          scaleY: {
            type: 'spring',
            stiffness: 80,
            damping: 14,
          },
          opacity: { duration: 0.2 },
        },
      });
    }
  }, [currentPath, controls, getTabRect]);

  // Re-measure on resize
  useEffect(() => {
    const handleResize = () => {
      const rect = getTabRect(currentPath);
      if (rect && hasMeasuredRef.current) {
        controls.set({
          top: rect.top,
          left: rect.left,
          width: rect.width,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPath, controls, getTabRect]);

  return (
    <>
      {/* Persistent flying indicator — always in DOM, never unmounted */}
      {indicatorVisible && (
        <motion.div
          animate={controls}
          className="fixed z-[60] h-0.5 bg-foreground pointer-events-none origin-center rounded-full"
          style={{ willChange: 'transform, top, left, opacity' }}
        />
      )}

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                DS
              </div>
              <span className="text-sm sm:text-lg font-bold tracking-tight text-foreground hidden sm:block">
                Debpriya Santra
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  ref={(el) => { linkRefs.current[link.path] = el; }}
                  className={`relative text-sm transition-colors ${currentPath === link.path
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground font-medium'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Social Links */}
              <div className="hidden sm:flex items-center space-x-2">
                <a
                  href="https://github.com/debpriya3011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/debpriya-santra-459519251/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://www.hackerrank.com/profile/debpriya3011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  title="HackerRank"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm3.75 16.5h-2.25v-3.5h-3v3.5H8.25v-9h2.25v3.25h3V7.5h2.25v9Z" />
                  </svg>
                </a>
                <a
                  href="mailto:debpriya3011@gmail.com"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              {/* Logout button for admin */}
              {isAuthenticated && (
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-border"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-md text-sm font-medium transition-colors ${currentPath === link.path
                      ? 'bg-accent text-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
