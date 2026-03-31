'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { db, BlogPost } from '@/lib/db';
import { motion } from 'framer-motion';
import { Calendar, User, ChevronLeft, Share2, Bookmark } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    const blogs = db.getBlogs();
    const found = blogs.find(b => b.id === params.id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (found) setBlog(found);
  }, [params.id]);

  if (!blog) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link 
            href="/blog" 
            className="inline-flex items-center space-x-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Blog</span>
          </Link>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <header className="mb-12">
              <div className="flex items-center space-x-4 text-sm text-blue-600 font-bold uppercase tracking-widest mb-4">
                <span>Technology</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span>Tutorial</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight text-slate-900">
                {blog.title}
              </h1>
              <div className="flex items-center justify-between border-y border-slate-100 py-6">
                <div className="flex items-center space-x-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-slate-100">
                    <Image 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}`} 
                      alt={blog.author} 
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{blog.author}</div>
                    <div className="text-sm text-slate-500 flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 transition-all">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 transition-all">
                    <Bookmark className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </header>

            <div className="aspect-video rounded-3xl overflow-hidden mb-12 border border-slate-100 shadow-sm relative">
              <Image src={blog.image} alt={blog.title} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-700 leading-relaxed mb-8 font-medium italic">
                {blog.shortDescription}
              </p>
              <div className="text-slate-600 leading-loose space-y-6">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Key Takeaways</h2>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <div className="bg-slate-50 border-l-4 border-blue-600 p-8 my-12 rounded-r-2xl italic text-slate-700">
                  &quot;The best way to predict the future is to invent it. Programming is the ultimate tool for invention in the digital age.&quot;
                </div>
                <p>
                  {blog.content}
                </p>
                <p>
                  Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed pretium diam sem ut ipsum.
                </p>
              </div>
            </div>

            <footer className="mt-16 pt-12 border-t border-slate-100">
              <div className="bg-slate-50 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-blue-500/20">
                  <Image 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}`} 
                    alt={blog.author} 
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2 text-slate-900">About {blog.author}</h3>
                  <p className="text-slate-600 mb-4">
                    Senior Developer and Technical Writer at Dapplesoft. Passionate about teaching modern web technologies and software architecture.
                  </p>
                  <div className="flex justify-center md:justify-start space-x-4">
                    <button className="text-blue-600 hover:text-blue-500 font-bold text-sm">Follow</button>
                    <button className="text-slate-500 hover:text-slate-600 font-bold text-sm">View Profile</button>
                  </div>
                </div>
              </div>
            </footer>
          </motion.article>
        </div>
      </main>
    </div>
  );
}
