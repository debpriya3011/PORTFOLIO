import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Github, Linkedin, Send, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import { Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const HackerRankIcon = ({ className = "w-5 h-5 text-violet-500" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm3.75 16.5h-2.25v-3.5h-3v3.5H8.25v-9h2.25v3.25h3V7.5h2.25v9Z" />
  </svg>
);

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('Message sent successfully! I will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Network error - please try again later');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'debpriya3011@gmail.com',
      href: 'mailto:debpriya3011@gmail.com'
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/debpriya3011',
      href: 'https://github.com/debpriya3011'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/debpriya-santra',
      href: 'https://www.linkedin.com/in/debpriya-santra-459519251/'
    },
    {
      icon: HackerRankIcon,
      label: 'HackerRank',
      value: 'hackerrank.com/debpriya3011',
      href: 'https://www.hackerrank.com/profile/debpriya3011'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Kolkata, West Bengal, India',
      href: '#'
    }
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border/80 mb-3.5">
            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-mono font-medium text-foreground tracking-wide">Communication</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-foreground">
            Let's Connect
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Have a project in mind, an engineering role, or want to collaborate? Feel free to reach out!
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-5xl mx-auto items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            className="order-1 md:order-1"
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-5 tracking-tight text-foreground">
              Contact Information
            </h3>
            <div className="space-y-3">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ delay: 0.25 + index * 0.08 }}
                    className="flex items-center gap-3.5 p-4 rounded-xl glass card-hover border border-border/70 bg-card/40"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-foreground flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-muted-foreground">{item.label}</p>
                      <p className="font-medium text-sm truncate text-foreground">{item.value}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            className="order-2 md:order-2"
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-5 tracking-tight text-foreground">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium mb-1.5 text-foreground">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="bg-card/50 border-border"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium mb-1.5 text-foreground">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="bg-card/50 border-border"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium mb-1.5 text-foreground">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message..."
                  required
                  rows={5}
                  className="bg-card/50 border-border resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {submitting ? 'Sending Message...' : 'Send Message'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
