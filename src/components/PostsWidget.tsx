import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Linkedin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export default function PostsWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Check if user has already visited/interacted before
  useEffect(() => {
    const chatDismissed = localStorage.getItem('posts_widget_dismissed');
    const chatOpened = localStorage.getItem('posts_widget_opened');

    if (chatDismissed === 'true' || chatOpened === 'true') {
      setHasNewNotification(false);
    } else {
      // Show tooltip helper after 3 seconds if not opened
      const timer = setTimeout(() => {
        if (!isOpen) {
          setShowTooltip(true);
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle message typing simulation
  const startConversation = () => {
    if (messages.length > 0) return;

    setMessages([]);
    setShowReplies(false);
    setIsTyping(true);

    const script = [
      {
        delay: 1000,
        text: "Hi! I'm Debpriya's digital assistant.",
      },
      {
        delay: 2400,
        text: "I can show you his architecture blueprints, engineering guides, and latest LinkedIn posts!",
      },
      {
        delay: 3800,
        text: "What would you like to explore?",
      }
    ];

    let currentTimeout = 0;

    script.forEach((step, idx) => {
      setTimeout(() => {
        setIsTyping(true);
      }, currentTimeout + (idx === 0 ? 0 : 500));

      currentTimeout += step.delay;

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${idx}`,
            text: step.text,
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);

        if (idx === script.length - 1) {
          setShowReplies(true);
        }
      }, currentTimeout);
    });
  };

  const handleOpenToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    setShowTooltip(false);
    setHasNewNotification(false);
    localStorage.setItem('posts_widget_opened', 'true');

    if (nextState) {
      // Start/reset chatbot script
      startConversation();
    }
  };

  const handleDismissTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(false);
    localStorage.setItem('posts_widget_dismissed', 'true');
  };

  const handleReply = (option: 'posts' | 'blueprints' | 'dismiss') => {
    let userText = '';
    let botText = '';
    let targetPath: string | null = null;

    if (option === 'blueprints') {
      userText = "Show me the blueprints!";
      botText = "Awesome! Redirecting you to the blueprints page now... Enjoy!";
      targetPath = '/guides';
    } else if (option === 'posts') {
      userText = "Yes, show me the posts!";
      botText = "Awesome! Redirecting you to the posts page now... Enjoy!";
      targetPath = '/posts';
    } else {
      userText = "No thanks, maybe later.";
      botText = "No problem! You can always click the 'Blueprints' or 'Posts' tabs in the navbar or tap me anytime to see them. Have a great day!";
    }

    // Record user response in chat
    setMessages((prev) => [
      ...prev,
      {
        id: `reply-${Date.now()}`,
        text: userText,
        sender: 'user',
        timestamp: new Date(),
      },
    ]);
    setShowReplies(false);

    if (targetPath) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-nav-${Date.now()}`,
            text: botText,
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);

        setTimeout(() => {
          setIsOpen(false);
          navigate(targetPath);
        }, 1200);
      }, 800);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-bye-${Date.now()}`,
            text: botText,
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
        localStorage.setItem('posts_widget_dismissed', 'true');
      }, 800);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Tooltip Notification */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-4 mr-1 max-w-[240px] p-3 rounded-2xl glass border-violet-500/30 shadow-xl relative cursor-pointer group"
            onClick={handleOpenToggle}
          >
            <button
              onClick={handleDismissTooltip}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 flex items-center justify-center text-destructive transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex gap-2.5 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Updates & Blueprints</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  Explore blueprints & LinkedIn notes.
                </p>
              </div>
            </div>
            {/* Tooltip speech bubble tail */}
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 rotate-45 border-r border-b border-border/50 bg-background/80 backdrop-blur-md" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Popover Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.92, transformOrigin: 'bottom right' }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="mb-4 w-[320px] sm:w-[360px] h-[460px] glass border border-border/80 rounded-2xl shadow-xl flex flex-col overflow-hidden backdrop-blur-xl bg-card/90"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-muted/60 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                    DS
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border-2 border-background rounded-full" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Interactive Assistant</h4>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Online
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenToggle}
                className="w-7 h-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-transform active:scale-90"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 24, stiffness: 350 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted border border-border text-foreground'
                      }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted rounded-xl border border-border px-3 py-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Replies */}
            {showReplies && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3 pt-0 flex flex-col gap-1.5 bg-background/50 border-t border-border/50"
              >
                <motion.button
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReply('blueprints')}
                  className="w-full py-2 px-3 bg-primary text-primary-foreground font-medium rounded-lg text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Explore Blueprints & Guides
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReply('posts')}
                  className="w-full py-2 px-3 bg-muted hover:bg-accent text-foreground font-medium rounded-lg text-xs border border-border transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Linkedin className="w-3 h-3 text-sky-500" />
                  View LinkedIn Posts
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReply('dismiss')}
                  className="w-full py-1.5 px-3 text-muted-foreground hover:text-foreground font-medium rounded-lg text-[11px] transition-colors cursor-pointer"
                >
                  Not now, just browsing
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={handleOpenToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-black/20 relative border border-border select-none cursor-pointer group"
        aria-label="Toggle assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageSquare className="w-5 h-5" />
              {hasNewNotification && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-background rounded-full animate-ping" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
