import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  User
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
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
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
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogle();
      document.body.appendChild(script);
    }
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

  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
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
            Sign in with Google OAuth or Email OTP
          </p>
        </div>

        {/* Google OAuth Section */}
        <div className="mb-4 flex flex-col items-center">
          <div id="googleSignInBtn" className="w-full flex justify-center min-h-[40px]"></div>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted-foreground/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background/80 backdrop-blur-md px-2 text-muted-foreground">
              Or continue with OTP
            </span>
          </div>
        </div>


        {/* OTP Section */}
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
          <TabsList className="flex w-full justify-center overflow-x-auto gap-1 h-auto p-1 max-w-md mx-auto">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 text-xs py-2 px-4 whitespace-nowrap"
            >
              <Linkedin className="w-4 h-4 shrink-0" />
              <span>Posts</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2 text-xs py-2 px-4 whitespace-nowrap">
              <Award className="w-4 h-4 shrink-0" />
              <span>Skills</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2 text-xs py-2 px-4 whitespace-nowrap">
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>Exp</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <LinkedInPostManager />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsManager />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceManager />
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

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <LoginForm key="login" />
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AdminDashboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}