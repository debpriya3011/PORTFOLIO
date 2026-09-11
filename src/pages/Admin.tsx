import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Loader2,
  Lock,
  Mail,
  Linkedin,
  Plus,
  Trash2,
  RefreshCw,
  Briefcase,
  Award,
  Save,
  User,
  ShieldCheck,
  Smartphone,
  KeyRound,
  Copy,
  Check,
  QrCode,
  MessageSquare,
  Inbox,
  CheckCheck,
  Clock
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Types
interface Post {
  id: number;
  linkedin_url: string;
  author_name: string;
  author_image: string | null;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  created_at: string | number;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  sources: string | null;
  display_order: number;
  created_at: string;
}

interface Experience {
  id: number;
  company: string;
  role: string;
  type: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string;
  skills: string[];
  display_order: number;
  created_at: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

// Login Component
function LoginForm() {
  const { login } = useAuth();
  const [loginMode, setLoginMode] = useState<'otp' | 'totp'>('totp');
  const [email, setEmail] = useState('debpriya3011@gmail.com');
  const [otp, setOtp] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '164348458496-tur37rbf28ncac1r0nn9efj6o9vamad4.apps.googleusercontent.com';

    const handleGoogleResponse = async (response: any) => {
      if (!response.credential) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          login(data.token);
          toast.success('Google Login successful!');
        } else {
          toast.error(data.error || 'Google login failed');
        }
      } catch (err) {
        console.error('Google login error:', err);
        toast.error('Network error during Google login');
      } finally {
        setLoading(false);
      }
    };

    const initGoogle = () => {
      try {
        if (!window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleResponse
        });

        const btnParent = document.getElementById('googleSignInBtn');
        if (btnParent) {
          btnParent.innerHTML = '';
          window.google.accounts.id.renderButton(btnParent, {
            theme: 'filled_blue',
            size: 'large',
            width: 240,
            text: 'signin_with',
            shape: 'pill'
          });
        }
      } catch (err) {
        console.error('Google GSI init error:', err);
      }
    };

    const timer = setTimeout(() => {
      if (window.google?.accounts?.id) {
        initGoogle();
      } else {
        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (existingScript) {
          initGoogle();
        } else {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = () => initGoogle();
          document.body.appendChild(script);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [login]);

  const sendOTP = async () => {
    if (email !== 'debpriya3011@gmail.com') {
      toast.error('Access denied: You do not have permission to access the admin portal');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        toast.success('OTP sent to your email! Check your inbox.');
      } else {
        toast.error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error('Network error - make sure backend is running on port 3001');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      if (response.ok) {
        login(data.token);
        toast.success('Login successful!');
      } else {
        toast.error(data.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const verifyTotp = async () => {
    if (email !== 'debpriya3011@gmail.com') {
      toast.error('Access denied: Google Authenticator is reserved for Admin only');
      return;
    }

    if (!totpCode || totpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit Google Authenticator code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/totp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: totpCode })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        login(data.token);
        toast.success('Google Authenticator login successful!');
      } else {
        toast.error(data.error || 'Invalid Google Authenticator code');
      }
    } catch (error) {
      console.error('TOTP verify error:', error);
      toast.error('Network error during Google Authenticator verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 glass rounded-2xl"
      >
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Exclusive Portal for Admin Authentication
          </p>
        </div>

        {/* Google OAuth Section */}
        <div className="mb-4 flex flex-col items-center">
          <div id="googleSignInBtn" className="w-full flex justify-center min-h-[40px]"></div>
        </div>

        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted-foreground/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background/80 backdrop-blur-md px-2 text-muted-foreground">
              Or Choose Admin Auth Method
            </span>
          </div>
        </div>

        {/* Login Mode Selector */}
        <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-muted/40 rounded-xl">
          <button
            type="button"
            onClick={() => setLoginMode('totp')}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${loginMode === 'totp'
              ? 'bg-violet-600 text-white shadow-md'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Google Authenticator
          </button>
          <button
            type="button"
            onClick={() => setLoginMode('otp')}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${loginMode === 'otp'
              ? 'bg-violet-600 text-white shadow-md'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Email OTP
          </button>
        </div>

        {loginMode === 'totp' ? (
          <div className="space-y-5">
            <div className="text-center space-y-3">
              <label className="block text-sm font-semibold text-foreground/90">
                Google Authenticator Code
              </label>
              <div className="relative max-w-[200px] mx-auto">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                <Input
                  type="text"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="pl-9 pr-4 font-mono tracking-[0.2em] text-center text-xl h-12 rounded-full border-violet-500/30 focus-visible:ring-violet-500/50 shadow-inner bg-background/50"
                  maxLength={6}
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit code from Google Authenticator app
              </p>
            </div>

            <Button
              onClick={verifyTotp}
              disabled={loading || totpCode.length !== 6}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 gap-2 h-11 text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Verify &amp; Log In
            </Button>

            {/* Security Note */}
            <div className="pt-3 border-t border-border/40 text-center space-y-1">
              <p className="text-[11px] text-muted-foreground">
                <strong>First time setup?</strong> Log in using Google Sign-In or Email OTP above first, then open <strong>Admin Dashboard &gt; Security 2FA</strong> to scan your QR code.
              </p>
            </div>
          </div>
        ) : (
          /* OTP Section */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abcd@gmail.com"
                  className="pl-10"
                  disabled={otpSent}
                />
              </div>
            </div>

            {otpSent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-sm font-medium mb-2">OTP</label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Check your Gmail inbox/spam for the OTP
                </p>
              </motion.div>
            )}

            <Button
              onClick={otpSent ? verifyOTP : sendOTP}
              disabled={loading || !email}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : otpSent ? (
                'Verify OTP'
              ) : (
                'Send OTP'
              )}
            </Button>

            {otpSent && (
              <Button
                variant="ghost"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  sendOTP();
                }}
                className="w-full"
              >
                Resend OTP
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}


// LinkedIn Post Manager
function LinkedInPostManager() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setFetching(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      // DEBUG: log raw created_at values to understand the format
      if (data.length > 0) {
        console.log('DEBUG created_at:', data[0].created_at, 'type:', typeof data[0].created_at);
      }
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setFetching(false);
    }
  };

  const scrapePost = async () => {
    if (!url.includes('linkedin.com/posts/')) {
      toast.error('Please enter a valid LinkedIn post URL');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/scrape-linkedin?url=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        throw new Error('Scraping failed');
      }

      const data = await response.json();

      // ✅ FIXED — backend returns direct object
      if (data.success) {
        setScrapedData(data);
        toast.success('Post scraped successfully!');
      } else {
        throw new Error('Invalid response');
      }

    } catch (error) {
      console.error('Scrape error:', error);
      toast.error('Failed to scrape LinkedIn post');
    } finally {
      setLoading(false);
    }
  };
  const savePost = async () => {
    if (!scrapedData) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedin_url: url,
          author_name: scrapedData.author_name,
          author_image: scrapedData.author_image || '',
          content: scrapedData.content,
          images: scrapedData.images || [],
          likes: scrapedData.likes || 0,
          comments: scrapedData.comments || 0,
          comments_data: JSON.stringify(scrapedData.comments_data || [])
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }

      toast.success('Post saved to Neon database!');
      setUrl('');
      setScrapedData(null);
      fetchPosts();
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save post');
    }
  };

  const deletePost = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Post deleted!');
      fetchPosts();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Post */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Linkedin className="w-5 h-5 text-violet-500" />
          Add LinkedIn Post
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.linkedin.com/posts/..."
            className="flex-1 min-w-0"
          />
          <Button
            onClick={scrapePost}
            disabled={loading || !url}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Preview
          </Button>
        </div>

        {scrapedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-muted/50"
          >
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Preview
            </h4>
            <p className="text-sm text-muted-foreground mb-2">{scrapedData.author_name}</p>
            <p className="text-sm mb-4">{scrapedData.content}</p>
            <Button onClick={savePost} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save to Neon Database
            </Button>
          </motion.div>
        )}
      </div>

      {/* Existing Posts */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center justify-between">
          <span>Posts in Neon ({posts.length})</span>
          {fetching && <Loader2 className="w-4 h-4 animate-spin" />}
        </h3>

        {posts.length === 0 && !fetching ? (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-muted-foreground">No posts yet. Add your first LinkedIn post above!</p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {post.author_image ? (
                    <img src={post.author_image.replace(/&amp;/g, '&')} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center">
                      <span className="text-white font-bold">{post.author_name?.[0] || 'U'}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{post.author_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {(() => {
                          // Postgres BIGINT comes back as a numeric string e.g. "1725280423"
                          const epoch = parseInt(String(post.created_at), 10);
                          const d = new Date(epoch * 1000);
                          return isNaN(d.getTime()) ? 'Date unavailable' : d.toLocaleDateString();
                        })()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePost(post.id)}
                      className="text-red-500 hover:text-red-600 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{post.content}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// Skills Manager
function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Industry Knowledge',
    sources: ''
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/skills`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    if (!newSkill.name.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSkill,
          display_order: skills.length
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add');
      }

      toast.success('Skill added to Neon!');
      setNewSkill({ name: '', category: 'Industry Knowledge', sources: '' });
      fetchSkills();
    } catch (error) {
      console.error('Add skill error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add skill');
    }
  };

  const deleteSkill = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/skills/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Skill deleted!');
      fetchSkills();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete skill');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Skill */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-violet-500" />
          Add Skill to Neon
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Skill name (e.g., React, Python)"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          />
          <select
            className="px-3 py-2 rounded-md bg-background border"
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
          >
            <option>Industry Knowledge</option>
            <option>Tools & Technologies</option>
            <option>Interpersonal Skills</option>
            <option>Languages</option>
          </select>
          <Button onClick={addSkill} className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </div>

      {/* Skills List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="space-y-2">
          {skills.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No skills yet. Add your first skill!</p>
          ) : (
            skills.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">({skill.category})</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSkill(skill.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Experience Manager
function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [newExp, setNewExp] = useState({
    company: '',
    role: '',
    type: 'Full-time',
    location: '',
    start_date: '',
    end_date: '',
    description: ''
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/experience`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const addExperience = async () => {
    if (!newExp.company || !newExp.role) {
      toast.error('Company and role are required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newExp,
          skills: JSON.stringify([]),
          display_order: experiences.length
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add');
      }

      toast.success('Experience added to Neon!');
      setNewExp({
        company: '', role: '', type: 'Full-time', location: '',
        start_date: '', end_date: '', description: ''
      });
      fetchExperiences();
    } catch (error) {
      console.error('Add experience error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add experience');
    }
  };

  const deleteExperience = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/experience/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Experience deleted!');
      fetchExperiences();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete experience');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Experience */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-violet-500" />
          Add Experience to Neon
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            placeholder="Company *"
            value={newExp.company}
            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
          />
          <Input
            placeholder="Role *"
            value={newExp.role}
            onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
          />
          <Input
            placeholder="Location"
            value={newExp.location}
            onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
          />
          <select
            className="px-3 py-2 rounded-md bg-background border"
            value={newExp.type}
            onChange={(e) => setNewExp({ ...newExp, type: e.target.value })}
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
          <Input
            placeholder="Start Date (e.g., Jan 2020)"
            value={newExp.start_date}
            onChange={(e) => setNewExp({ ...newExp, start_date: e.target.value })}
          />
          <Input
            placeholder="End Date (or 'Present')"
            value={newExp.end_date}
            onChange={(e) => setNewExp({ ...newExp, end_date: e.target.value })}
          />
        </div>
        <Textarea
          placeholder="Description (use bullet points with -)"
          value={newExp.description}
          onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
          className="mb-4"
          rows={4}
        />
        <Button onClick={addExperience} className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {/* Experience List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No experience yet. Add your first experience!</p>
          ) : (
            experiences.map((exp) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-xl p-4 flex items-center justify-between gap-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{exp.role}</p>
                  <p className="text-sm text-violet-500 truncate">{exp.company}</p>
                  <p className="text-xs text-muted-foreground break-words">
                    {exp.start_date} - {exp.end_date || 'Present'} • {exp.location}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteExperience(exp.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Google Authenticator Security Manager Component
function SecurityManager() {
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setupData, setSetupData] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [disabling, setDisabling] = useState(false);
  const [showDisableForm, setShowDisableForm] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/totp/status`);
      const data = await res.json();
      setTotpEnabled(Boolean(data.enabled));
    } catch (err) {
      console.error('TOTP status error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleStartSetup = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/totp/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'debpriya3011@gmail.com' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSetupData({ secret: data.secret, qrCodeUrl: data.qrCodeUrl });
      } else {
        toast.error(data.error || 'Failed to initialize Google Authenticator setup');
      }
    } catch (err) {
      toast.error('Failed to communicate with server');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/totp/verify-setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'debpriya3011@gmail.com', code: verifyCode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Google Authenticator 2FA enabled successfully!');
        setTotpEnabled(true);
        setSetupData(null);
        setVerifyCode('');
      } else {
        toast.error(data.error || 'Verification failed');
      }
    } catch (err) {
      toast.error('Network error during verification');
    } finally {
      setVerifying(false);
    }
  };

  const handleDisableTotp = async () => {
    setDisabling(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/totp/disable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'debpriya3011@gmail.com', code: disableCode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Google Authenticator 2FA disabled');
        setTotpEnabled(false);
        setShowDisableForm(false);
        setDisableCode('');
      } else {
        toast.error(data.error || 'Failed to disable 2FA');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setDisabling(false);
    }
  };

  const copySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      toast.success('Secret key copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${totpEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Google Authenticator (2FA)</h2>
            <p className="text-xs text-muted-foreground">Admin Multi-Factor Authentication</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${totpEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
          <span className={`w-2 h-2 rounded-full ${totpEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          {totpEnabled ? '2FA Enabled' : '2FA Disabled'}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        </div>
      ) : !totpEnabled && !setupData ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 text-violet-500 flex items-center justify-center mx-auto">
            <Smartphone className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Secure Admin Account with Google Authenticator</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
              Use any TOTP authenticator app (Google Authenticator, Authy, 1Password) to generate 2FA security codes for instant admin login.
            </p>
          </div>
          <Button
            onClick={handleStartSetup}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white gap-2 font-medium px-6"
          >
            <QrCode className="w-4 h-4" />
            Set Up Google Authenticator
          </Button>
        </div>
      ) : setupData ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-4 bg-violet-500/5 rounded-xl border border-violet-500/20 text-sm text-violet-300">
            <p className="font-semibold mb-1">Step 1: Scan QR Code with Google Authenticator App</p>
            <p className="text-xs text-muted-foreground">Open Google Authenticator on your mobile phone, tap the <strong>+</strong> button, and choose <strong>Scan a QR code</strong>.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 bg-background/50 rounded-2xl border border-border/40">
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <img src={setupData.qrCodeUrl} alt="Google Authenticator QR Code" className="w-44 h-44 rounded" />
            </div>
            <div className="space-y-3 max-w-xs text-center sm:text-left">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Manual Setup Key</p>
                <div className="flex items-center gap-2 mt-1 bg-muted/50 p-2 rounded-lg font-mono text-xs break-all">
                  <span>{setupData.secret}</span>
                  <Button variant="ghost" size="icon" onClick={copySecret} className="h-6 w-6 shrink-0">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Can't scan QR code? Tap <strong>Enter a setup key</strong> in your app and paste the code above.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-sm font-semibold">Step 2: Enter 6-Digit Code from App to Verify</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="font-mono text-center tracking-widest text-lg h-11"
                maxLength={6}
              />
              <Button
                onClick={handleVerifySetup}
                disabled={verifying || verifyCode.length !== 6}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 h-11 shrink-0"
              >
                {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Enable 2FA'}
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setSetupData(null)} className="text-xs text-muted-foreground">
              Cancel Setup
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-emerald-300">Google Authenticator is Active</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your admin account is protected by 2FA. You can log into the Admin portal anytime using your 6-digit Google Authenticator verification codes.
              </p>
            </div>
          </div>

          {!showDisableForm ? (
            <Button
              variant="outline"
              onClick={() => setShowDisableForm(true)}
              className="text-red-400 border-red-500/20 hover:bg-red-500/10 text-xs"
            >
              Disable Google Authenticator
            </Button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 glass rounded-xl space-y-3 border border-red-500/30">
              <p className="text-sm font-semibold text-red-400">Confirm Disabling 2FA</p>
              <p className="text-xs text-muted-foreground">Enter your 6-digit code from Google Authenticator to confirm disabling 2FA.</p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={disableCode}
                  onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="font-mono text-center tracking-widest text-sm"
                  maxLength={6}
                />
                <Button
                  onClick={handleDisableTotp}
                  disabled={disabling}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 shrink-0"
                >
                  {disabling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Disable'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowDisableForm(false)} className="text-xs">
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// Messages Inbox Manager Component
interface MessageItem {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string | number;
}

function MessagesManager() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Fetch messages error:', err);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${id}/read`, { method: 'PUT' });
      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
        toast.success('Marked as read');
      }
    } catch (err) {
      toast.error('Failed to update message');
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        toast.success('Message deleted!');
      }
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between glass rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Contact Messages Inbox</h2>
            <p className="text-xs text-muted-foreground">Visitor submissions from portfolio contact form</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500 text-white animate-pulse">
              {unreadCount} Unread
            </span>
          )}
          <Button variant="ghost" size="icon" onClick={fetchMessages}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 glass rounded-2xl space-y-3">
          <Inbox className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-semibold">No messages yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Messages submitted by visitors through your contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass rounded-xl p-5 border transition-all ${
                !msg.is_read ? 'border-violet-500/40 bg-violet-500/5' : 'border-border/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
                    {msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      {msg.name}
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-violet-500" />
                      )}
                    </h4>
                    <a href={`mailto:${msg.email}`} className="text-xs text-violet-400 hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(Number(msg.created_at) * 1000).toLocaleString()}
                  </span>
                  {!msg.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(msg.id)}
                      className="text-xs text-emerald-400 hover:bg-emerald-500/10 h-8 px-2"
                    >
                      <CheckCheck className="w-3.5 h-3.5 mr-1" />
                      Mark Read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMessage(msg.id)}
                    className="text-red-400 hover:bg-red-500/10 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Admin Dashboard
function AdminDashboard() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your portfolio content in Neon PostgreSQL</p>
        </motion.div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="flex w-full justify-center overflow-x-auto gap-1 h-auto p-1 max-w-xl mx-auto">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 text-xs py-2 px-4 whitespace-nowrap"
            >
              <Linkedin className="w-4 h-4 shrink-0" />
              <span>Posts</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2 text-xs py-2 px-4 whitespace-nowrap">
              <MessageSquare className="w-4 h-4 shrink-0 text-violet-400" />
              <span>Messages</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2 text-xs py-2 px-4 whitespace-nowrap">
              <Award className="w-4 h-4 shrink-0" />
              <span>Skills</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2 text-xs py-2 px-4 whitespace-nowrap">
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>Exp</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 text-xs py-2 px-4 whitespace-nowrap">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Security 2FA</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <LinkedInPostManager />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesManager />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsManager />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceManager />
          </TabsContent>

          <TabsContent value="security">
            <SecurityManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Main Admin Component
export default function Admin() {
  const { isAuthenticated, isAuthChecked } = useAuth();

  if (!isAuthChecked) return null;

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AdminDashboard />
    </motion.div>
  );
}