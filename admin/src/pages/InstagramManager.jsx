import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Plus, Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { getInstagramPosts, addInstagramPost, deleteInstagramPost } from '../api';

const InstagramManager = () => {
  const [newUrl, setNewUrl] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await getInstagramPosts();
      setPosts(res.data.map(p => ({ id: p._id, url: p.url })));
    } catch (err) {
      toast.error('Failed to load Instagram posts');
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await addInstagramPost({ url: newUrl });
      setPosts([{ id: res.data._id, url: res.data.url }, ...posts]);
      setNewUrl('');
      toast.success('Post linked successfully');
    } catch (err) {
      toast.error('Failed to add post');
    } finally {
      setLoading(false);
    }
  };

  const removePost = async (id) => {
    try {
      await deleteInstagramPost(id);
      setPosts(posts.filter(p => p.id !== id));
      toast.success('Post unlinked');
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Instagram Integration</h1>
          <p className="text-gray-400 text-sm mt-1">Manage the Instagram feed displayed on the website.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#1E1E1E] rounded-2xl p-6 md:p-8 border border-[#2C2C2C] shadow-lg mb-8"
      >
        <form onSubmit={handleAddPost} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1 w-full group">
            <label className="text-sm font-medium text-gray-300 ml-1">Instagram Image URL (Direct File Link for demo UI)</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6B00] transition-colors" size={20} />
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#111111] border border-[#2C2C2C] rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-[#FF6B00] hover:bg-[#FF8C00] text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_20px_rgba(255,107,0,0.5)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus size={20} /> Add Post
          </button>
        </form>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1E1E1E] p-3 rounded-2xl border border-[#2C2C2C] group"
            >
              <div className="relative aspect-square bg-[#111111] rounded-xl overflow-hidden mb-3 group block">
                {post.url.includes('instagram.com/p/') || post.url.includes('instagram.com/reel/') ? (
                  <iframe
                    src={post.url.endsWith('/') ? `${post.url}embed/` : `${post.url}/embed/`}
                    className="w-[100%] h-[120%] border-none pointer-events-none"
                    scrolling="no"
                    allowtransparency="true"
                    title={`Insta Post ${post.id}`}
                  ></iframe>
                ) : (
                  <>
                    <img src={post.url} alt="Instagram Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <Instagram size={32} className="text-white drop-shadow-lg" />
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-between items-center px-2">
                <a href={post.url} target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-[#FF6B00] flex items-center gap-1 transition-colors">
                  View <ExternalLink size={14} />
                </a>
                <button onClick={() => removePost(post.id)} className="text-gray-500 hover:text-red-500 transition-colors p-1" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {posts.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No posts added yet. Add an image URL above to see it here.
          </div>
        )}
      </div>

    </div>
  );
};

export default InstagramManager;
