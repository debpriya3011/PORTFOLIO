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
  created_at: number;
}

// Helper to safely parse images
const parseImages = (images: string | string[] | null | undefined): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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
      const response = await fetch('http://localhost:3001/api/posts');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched posts:', data); // Debug: check the data format
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
    await fetchPosts();
    toast.success('Posts refreshed!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
            <Linkedin className="w-4 h-4 text-violet-500" />
            <span className="text-sm text-violet-500 font-medium">LinkedIn Posts</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            My <span className="gradient-text">LinkedIn Activity</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Curated posts from my professional journey, insights, and learnings shared on LinkedIn.
          </p>
          <Button
            onClick={handleManualRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Posts'}
          </Button>
        </motion.div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Linkedin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No posts yet</h3>
            <p className="text-muted-foreground">Check back later for updates!</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {posts.map((post, index) => {
              // Parse images safely for each post
              const images = parseImages(post.images);
              
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl overflow-hidden card-hover"
                >
                  {/* Author Header */}
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      {post.author_image ? (
                        <img
                          src={post.author_image}
                          alt={post.author_name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {post.author_name?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold">{post.author_name || 'Unknown'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(post.created_at * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-muted-foreground whitespace-pre-line mb-4">
                      {post.content?.length > 300 
                        ? `${post.content.substring(0, 300)}...` 
                        : post.content || 'No content'}
                    </p>

                    {/* Images - Now safely parsed */}
                    {images.length > 0 && (
                      <div className={`grid gap-2 mb-4 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {images.slice(0, 4).map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`Post image ${imgIndex + 1}`}
                            className="w-full h-48 object-cover rounded-lg bg-gray-800"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        {post.likes || 0} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments || 0} comments
                      </span>
                    </div>

                    {/* View on LinkedIn Button */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(post.linkedin_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
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