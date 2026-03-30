'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, ArrowRight, Play, Users, Chrome } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { db, Course, BlogPost } from '@/lib/db';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCourses(db.getCourses().filter(c => c.published).slice(0, 3));
      setBlogs(db.getBlogs().slice(0, 3));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 -z-10" />
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none -z-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-400 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                  Code. Learn. Build.
                </span>
                <br />
                <span className="text-slate-900">Master Programming Skills</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
                C#, ASP.NET Core, PHP, Linux, DevOps, AI – Free & Paid Courses, 
                Sequential Learning & Progress Tracking. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/courses"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-2 shadow-xl shadow-blue-200/40"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-bold text-lg transition-all border border-slate-200 flex items-center justify-center space-x-2"
                >
                  <Chrome className="h-5 w-5 text-blue-500" />
                  <span>Sign In with Google</span>
                </Link>
              </div>
            </motion.div>

            {/* Code Animation Simulation */}
            <div className="mt-16 relative max-w-4xl mx-auto">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-2xl font-mono text-left overflow-hidden">
                <div className="flex space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-blue-400">
                  <span className="text-purple-400">public class</span> <span className="text-yellow-400">Developer</span> {'{'}
                  <br />
                  &nbsp;&nbsp;<span className="text-purple-400">public string</span> Name {'{'} get; set; {'}'}
                  <br />
                  &nbsp;&nbsp;<span className="text-purple-400">public void</span> <span className="text-yellow-400">Learn</span>() {'{'}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;Console.<span className="text-yellow-400">WriteLine</span>(<span className="text-green-400">&quot;Mastering new skills at Dapplesoft Learn!&quot;</span>);
                  <br />
                  &nbsp;&nbsp;{'}'}
                  <br />
                  {'}'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-slate-900">Featured Courses</h2>
                <p className="text-slate-600">Start your career with our top-rated programs</p>
              </div>
              <Link href="/courses" className="text-blue-600 hover:text-blue-500 font-medium flex items-center space-x-1">
                <span>View all courses</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm"
                >
                  <div className="aspect-video relative">
                    <Image 
                      src={course.image} 
                      alt={course.name} 
                      fill 
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                      {course.category}
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{course.name}</h3>
                      <span className={cn(
                        "text-sm font-bold",
                        course.isPaid ? "text-amber-600" : "text-green-600"
                      )}>
                        {course.isPaid ? `$${course.price}` : 'FREE'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                      {course.shortDescription}
                    </p>
                    <div className="flex items-center justify-between text-slate-500 text-xs mb-6">
                      <span className="flex items-center space-x-1">
                        <Play className="h-3 w-3" />
                        <span>{course.modulesCount} Modules</span>
                      </span>
                      <span>{course.duration} Content</span>
                    </div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="w-full py-3 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-900 rounded-xl font-bold transition-all text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-slate-900">Latest from the Blog</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.id}`} className="group">
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all group-hover:border-blue-500/50 shadow-sm">
                    <div className="aspect-video relative overflow-hidden">
                      <Image 
                        src={blog.image} 
                        alt={blog.title} 
                        fill 
                        className="object-cover transition-transform group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-blue-600 text-xs font-bold uppercase mb-2">{blog.date}</p>
                      <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors">{blog.title}</h3>
                      <p className="text-slate-600 text-sm line-clamp-2">{blog.shortDescription}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section (Moved to Bottom) */}
        <section className="py-20 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: BookOpen, title: 'Expert Courses', desc: 'Curated by industry veterans' },
                { icon: Play, title: 'Sequential Learning', desc: 'Step-by-step video modules' },
                { icon: Trophy, title: 'Certificates', desc: 'Earn recognition for your skills' },
                { icon: Users, title: 'Community', desc: 'Learn with thousands of others' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-500/50 transition-all shadow-sm"
                >
                  <feature.icon className="h-10 w-10 text-blue-500 mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
