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
        text: "Hi! I'm Debpriya's digital assistant. 🤖",
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
      userText = "Show me the blueprints! 📐";
      botText = "Awesome! Redirecting you to the blueprints page now... Enjoy! 📐";
      targetPath = '/guides';
    } else if (option === 'posts') {
      userText = "Yes, show me the posts! 🚀";
      botText = "Awesome! Redirecting you to the posts page now... Enjoy! 📚";
      targetPath = '/posts';
    } else {
      userText = "No thanks, maybe later.";
      botText = "No problem! You can always click the 'Blueprints' or 'Posts' tabs in the navbar or tap me anytime to see them. Have a great day! 👋";
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
              <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">New updates available!</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug group-hover:text-violet-500 transition-colors">
                  Check out blueprints & LinkedIn posts.
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
            className="mb-4 w-[320px] sm:w-[360px] h-[460px] glass border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-violet-500/10 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    D
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-background rounded-full animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Debpriya's Assistant</h4>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                    Online
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenToggle}
                className="w-7 h-7 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-transform active:scale-90"
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
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${msg.sender === 'user'
                      ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md rounded-tr-none'
                      : 'bg-muted/80 text-foreground rounded-tl-none border border-border/20 backdrop-blur-sm'
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
                  <div className="bg-muted/80 rounded-2xl rounded-tl-none border border-border/20 px-3.5 py-2.5 flex items-center gap-1">
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
                className="p-3.5 pt-0 flex flex-col gap-2 bg-background/25 backdrop-blur-sm border-t border-white/5"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleReply('blueprints')}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md shadow-violet-500/20 hover:shadow-violet-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Explore Blueprints & Guides! 📐
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleReply('posts')}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-semibold rounded-xl text-xs shadow-md shadow-fuchsia-500/20 hover:shadow-fuchsia-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  Yes, show me the posts! 🚀
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReply('dismiss')}
                  className="w-full py-2 px-4 bg-secondary/80 hover:bg-secondary text-foreground font-semibold rounded-xl text-xs transition-colors cursor-pointer"
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
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-violet-500/40 relative border border-white/20 select-none cursor-pointer group"
        aria-label="Toggle chatbot"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-ping opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
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
              <MessageSquare className="w-6 h-6" />
              {hasNewNotification && (
                <span className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-red-500 border-2 border-background rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md animate-pulse">
                  1
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
