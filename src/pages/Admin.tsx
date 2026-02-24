import { useState, useEffect, useRef } from 'react';
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
  Workflow,
  Image as ImageIcon,
  Upload,
  X,
  Save,
  Calendar,
  MapPin,
  Building,
  User
} from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

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
  created_at: string;
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

interface Image {
  id: number;
  filename: string;
  url: string;
  alt: string;
  category: string;
  created_at: string;
}

interface Workflow {
  id: number;
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
  display_order: number;
  created_at: string;
}

// Login Component
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (email !== 'debpriya3011@gmail.com') {
      toast.error('Unauthorized email address');
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
        localStorage.setItem('auth_token', data.token);
        toast.success('Login successful!');
        onLogin();
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
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground mt-2">
            OTP will be sent to your Email
          </p>
        </div>

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
          images: scrapedData.images || [] ,
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
        <div className="flex gap-4">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.linkedin.com/posts/..."
            className="flex-1"
          />
          <Button
            onClick={scrapePost}
            disabled={loading || !url}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
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
              className="glass rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                {post.author_image ? (
                  <img src={post.author_image} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <span className="text-white font-bold">{post.author_name?.[0] || 'U'}</span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{post.author_name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deletePost(post.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// Image Upload Manager
function ImageManager() {
  const [images, setImages] = useState<Image[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/images`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('alt', file.name);
    formData.append('category', 'general');

    try {
      const response = await fetch(`${API_BASE_URL}/images`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      
      toast.success('Image uploaded to Neon!');
      fetchImages();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const deleteImage = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/images/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Image deleted!');
      fetchImages();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-violet-500" />
          Upload Image to Neon
        </h3>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Select Image
        </Button>
      </div>

      {/* Gallery */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group aspect-square"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                onClick={() => deleteImage(image.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {image.alt}
              </div>
            </motion.div>
          ))}
        </div>
      )}
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
                className="glass rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold">{exp.role}</p>
                  <p className="text-sm text-violet-500">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">
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

// Workflow Manager
function WorkflowManager() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    nodes: [{ label: '', icon: 'Database', color: '#8b5cf6' }]
  });

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/workflows`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setWorkflows(data);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const addNode = () => {
    setNewWorkflow({
      ...newWorkflow,
      nodes: [...newWorkflow.nodes, { label: '', icon: 'Database', color: '#8b5cf6' }]
    });
  };

  const removeNode = (index: number) => {
    if (newWorkflow.nodes.length <= 1) return;
    const updatedNodes = newWorkflow.nodes.filter((_, i) => i !== index);
    setNewWorkflow({ ...newWorkflow, nodes: updatedNodes });
  };

  const updateNode = (index: number, field: string, value: string) => {
    const updatedNodes = [...newWorkflow.nodes];
    updatedNodes[index] = { ...updatedNodes[index], [field]: value };
    setNewWorkflow({ ...newWorkflow, nodes: updatedNodes });
  };

  const saveWorkflow = async () => {
    if (!newWorkflow.name.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/workflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWorkflow.name,
          description: newWorkflow.description,
          nodes: JSON.stringify(newWorkflow.nodes.filter(n => n.label.trim())),
          edges: JSON.stringify([]),
          display_order: workflows.length
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }

      toast.success('Workflow saved to Neon!');
      setNewWorkflow({ name: '', description: '', nodes: [{ label: '', icon: 'Database', color: '#8b5cf6' }] });
      fetchWorkflows();
    } catch (error) {
      console.error('Save workflow error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save workflow');
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Workflow */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Workflow className="w-5 h-5 text-violet-500" />
          Create Workflow in Neon
        </h3>
        <Input
          placeholder="Workflow name (e.g., Data Pipeline)"
          value={newWorkflow.name}
          onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
          className="mb-4"
        />
        <Textarea
          placeholder="Description"
          value={newWorkflow.description}
          onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
          className="mb-4"
        />
        
        <div className="space-y-3 mb-4">
          {newWorkflow.nodes.map((node, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Input
                placeholder={`Node ${idx + 1} label (e.g., Extract)`}
                value={node.label}
                onChange={(e) => updateNode(idx, 'label', e.target.value)}
                className="flex-1"
              />
              <input
                type="color"
                value={node.color}
                onChange={(e) => updateNode(idx, 'color', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              {newWorkflow.nodes.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeNode(idx)}
                  className="text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNode}>
            <Plus className="w-4 h-4 mr-2" />
            Add Node
          </Button>
          <Button onClick={saveWorkflow} className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
            <Save className="w-4 h-4 mr-2" />
            Save to Neon
          </Button>
        </div>
      </div>

      {/* Preview */}
      {newWorkflow.nodes.some(n => n.label) && (
        <div className="glass rounded-xl p-6">
          <h4 className="font-bold mb-4">Preview</h4>
          <div className="flex flex-wrap gap-4">
            {newWorkflow.nodes.map((node, idx) => (
              node.label && (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-24 h-24 rounded-xl flex flex-col items-center justify-center p-2"
                  style={{
                    background: `${node.color}20`,
                    border: `2px solid ${node.color}`
                  }}
                >
                  <span className="text-xs font-medium text-center break-words" style={{ color: node.color }}>
                    {node.label}
                  </span>
                </motion.div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Existing Workflows */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Saved Workflows ({workflows.length})</h3>
          {workflows.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No workflows yet. Create your first workflow!</p>
          ) : (
            workflows.map((wf) => (
              <motion.div
                key={wf.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-xl p-4"
              >
                <p className="font-bold">{wf.name}</p>
                <p className="text-sm text-muted-foreground mb-2">{wf.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {wf.nodes?.map((node: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded text-xs"
                      style={{ background: `${node.color}30`, color: node.color }}
                    >
                      {node.label}
                    </span>
                  ))}
                </div>
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your portfolio content in Neon PostgreSQL</p>
        </motion.div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              <span className="hidden sm:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Images</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Experience</span>
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              <span className="hidden sm:inline">Workflows</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <LinkedInPostManager />
          </TabsContent>

          <TabsContent value="images">
            <ImageManager />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsManager />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceManager />
          </TabsContent>

          <TabsContent value="workflows">
            <WorkflowManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Main Admin Component
export default function Admin() {
  const { isAuthenticated } = useAuth();
  const [loggedIn, setLoggedIn] = useState(isAuthenticated);

  return (
    <AnimatePresence mode="wait">
      {!loggedIn ? (
        <LoginForm key="login" onLogin={() => setLoggedIn(true)} />
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