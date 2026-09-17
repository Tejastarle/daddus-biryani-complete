'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Loader, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getYouTubeId, getYouTubeThumbnail } from '@/lib/youtube';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  image: string;
  video_url: string | null;
  video_file_url: string | null;
  created_at: string;
}

const FALLBACK_IMAGE =
  '/images/dishes/chicken-dum-biryani.webp';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBlogs(data || []);
      } catch (err) {
        console.error('Error loading blogs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative h-80 overflow-hidden">
        <Image
          src="/images/dishes/kolkata-biryani.webp"
          alt="Blogs"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold font-playfair gradient-text">Our Blog</h1>
        </div>
      </section>

      <section className="section container-max px-4">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted">
            <Loader className="animate-spin mr-2" />
            Loading posts...
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-lg">No blog posts published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => {
              const isUploaded = Boolean(blog.video_file_url);
              const ytId = blog.video_url ? getYouTubeId(blog.video_url) : null;
              const hasVideo = isUploaded || Boolean(ytId);

              // Uploaded videos have no auto-generated thumbnail — fall
              // back to the image field (admin should set one for these)
              const thumbnail = ytId ? getYouTubeThumbnail(ytId) : blog.image || FALLBACK_IMAGE;

              return (
                <motion.div
                  key={blog.id}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="card group overflow-hidden"
                >
                  <Link href={`/blogs/${blog.slug}`}>
                    <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={thumbnail}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />

                      {hasVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                          <div className="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play size={24} className="text-background ml-1" fill="currentColor" />
                          </div>
                        </div>
                      )}

                      {blog.category && (
                        <div className="absolute top-3 left-3 bg-accent px-3 py-1 rounded-full text-xs font-semibold text-background">
                          {blog.category}
                        </div>
                      )}
                    </div>
                  </Link>

                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-sm text-muted mb-4 line-clamp-2">{blog.excerpt}</p>

                  <div className="flex gap-4 text-xs text-muted mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      {blog.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="flex items-center gap-2 text-accent hover:gap-3 transition-all"
                  >
                    {hasVideo ? 'Watch Now' : 'Read More'}
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
