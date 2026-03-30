'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db, BlogPost } from '@/lib/db';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBlogs(db.getBlogs());
  }, []);

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.shortDescription.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Dapplesoft Blog
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Insights, tutorials, and updates from the world of programming and technology.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
              />
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredBlogs.map((blog, i) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col group hover:border-blue-500/50 transition-all shadow-sm"
              >
                <Link href={`/blog/${blog.id}`} className="aspect-video overflow-hidden relative">
                  <Image 
                    src={blog.image} 
                    alt={blog.title} 
                    fill
                    className="object-cover transition-transform group-hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center space-x-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{blog.author}</span>
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
                  </h2>
                  <p className="text-slate-600 mb-8 line-clamp-3 flex-grow">
                    {blog.shortDescription}
                  </p>
                  <Link
                    href={`/blog/${blog.id}`}
                    className="flex items-center space-x-2 text-blue-600 font-bold hover:text-blue-500 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
