import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Linkedin, ExternalLink, Heart, MessageCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LinkedInPost {
  id: number;
  linkedin_url: string;
  author_name: string;
  author_image: string | null;
  content: string;
  images: string | string[]; // Can be JSON string or array
  likes: number;
  comments: number;
  created_at: string | number;
}

// Helper to safely parse images and clean up escaped ampersands
const parseImages = (images: string | string[] | null | undefined): string[] => {
  if (!images) return [];
  
  const cleanUrl = (url: string) => url.replace(/&amp;/g, '&');

  if (Array.isArray(images)) {
    return images.map(cleanUrl);
  }

  const cleanedImages = images.trim();

  // Handle PostgreSQL native array format e.g. {"url1", "url2"}
  if (cleanedImages.startsWith('{') && cleanedImages.endsWith('}')) {
    const content = cleanedImages.slice(1, -1).trim();
    if (!content) return [];
    return content.split(',')
      .map(item => {
        let clean = item.trim();
        if (clean.startsWith('"') && clean.endsWith('"')) {
          clean = clean.slice(1, -1);
        }
        return clean.replace(/\\"/g, '"');
      })
      .map(cleanUrl)
      .filter(Boolean);
  }

  try {
    const parsed = JSON.parse(cleanedImages);
    if (Array.isArray(parsed)) {
      return parsed.map(cleanUrl);
    }
  } catch {
    // If it's a single URL
    if (cleanedImages.startsWith('http')) {
      return [cleanUrl(cleanedImages)];
    }
  }
  return [];
};

export default function Posts() {
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        toast.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/posts/refresh-all`, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        if (data.posts) {
          setPosts(data.posts);
          toast.success('Posts refreshed with latest likes & comments!');
        } else {
          await fetchPosts();
          toast.success('Posts refreshed!');
        }
      } else {
        await fetchPosts();
        toast.success('Posts refreshed!');
      }
    } catch (error) {
      console.error('Error refreshing posts:', error);
      await fetchPosts();
      toast.success('Posts refreshed!');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium tracking-wide mb-4">
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn Activity</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 text-foreground">
            Activity & <span className="gradient-brand">Engineering Notes</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6 text-sm sm:text-base">
            Curated updates, technical insights, and pipeline architecture notes shared on LinkedIn.
          </p>
          <Button
            onClick={handleManualRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="gap-2 border-border hover:bg-accent text-xs font-mono rounded-xl shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-500 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Sync Activity'}
          </Button>
        </motion.div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-2xl bg-card border border-border shadow-sm p-8"
          >
            <Linkedin className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">No posts yet</h3>
            <p className="text-sm text-muted-foreground">Check back later for updates!</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => {
              // Parse images safely for each post
              const images = parseImages(post.images);
              
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-2xl overflow-hidden card-hover border border-border bg-card shadow-sm"
                >
                  {/* Author Header */}
                  <div className="p-5 sm:p-6 border-b border-border bg-muted/20">
                    <div className="flex items-center gap-3.5">
                      {post.author_image ? (
                        <img
                          src={post.author_image.replace(/&amp;/g, '&')}
                          alt={post.author_name}
                          className="w-11 h-11 rounded-full object-cover border border-border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-base shadow-xs">
                          {post.author_name?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-foreground text-sm sm:text-base">{post.author_name || 'Debpriya Santra'}</h3>
                        <p className="text-xs font-mono text-muted-foreground">
                          {(() => {
                            // Postgres BIGINT comes back as a numeric string e.g. "1725280423"
                            const epoch = parseInt(String(post.created_at), 10);
                            const d = new Date(epoch * 1000);
                            return isNaN(d.getTime()) ? 'Date unavailable' : d.toLocaleDateString();
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <p className="text-foreground/90 text-sm sm:text-base whitespace-pre-line mb-5 leading-relaxed">
                      {post.content?.length > 350 
                        ? `${post.content.substring(0, 350)}...` 
                        : post.content || 'No content'}
                    </p>

                    {/* Images - Safely parsed */}
                    {images.length > 0 && (
                      <div className={`grid gap-2.5 mb-5 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {images.slice(0, 4).map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`Post image ${imgIndex + 1}`}
                            className="w-full h-48 object-cover rounded-xl border border-border bg-muted/40"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-5 text-xs font-mono text-muted-foreground mb-5 pt-2 border-t border-border/60">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Heart className="w-4 h-4 text-rose-500" />
                        {post.likes || 0} likes
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <MessageCircle className="w-4 h-4 text-sky-500" />
                        {post.comments || 0} comments
                      </span>
                    </div>

                    {/* View on LinkedIn Button */}
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-border hover:bg-sky-500/10 hover:text-sky-600 hover:border-sky-500/30 text-xs font-mono font-medium transition-colors"
                      onClick={() => window.open(post.linkedin_url, '_blank')}
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-2 text-sky-500" />
                      View on LinkedIn
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}