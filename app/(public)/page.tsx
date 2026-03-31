'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, ArrowRight, Play, Users, Chrome, LayoutGrid, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { db, Course, BlogPost, CATEGORIES, INITIAL_COURSES } from '@/lib/db';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCourses(db.getCourses().filter(c => c.published));
      setBlogs(db.getBlogs().slice(0, 4));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStudentLogin = () => {
    const newUser: any = {
      id: `u_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Student User',
      email: 'student@example.com',
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=student`
    };
    db.setCurrentUser(newUser);
    router.push('/student-dashboard');
  };

  const filterChips = ['All', 'Newest', 'Popular', 'Free', 'Premium', 'Web Dev', 'DevOps', 'Design'];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-slate-50/50 -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
                The Future of Learning is Here
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
                Master the Skills that <br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Shape the Digital World
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                Dapplesoft Learn provides industry-leading courses in software development, 
                cloud engineering, and design. Start your journey today with expert-led content.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => document.getElementById('courses-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-200"
                >
                  <span>Start Learning Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={handleStudentLogin}
                  className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-bold transition-all border border-slate-200 flex items-center justify-center space-x-2"
                >
                  <Chrome className="h-4 w-4 text-blue-500" />
                  <span>Try Demo Account</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Category Menu (YouTube Style) */}
            <aside className="hidden lg:block lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <nav className="space-y-1">
                  <Link href="/" className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-100 text-slate-900 font-bold text-sm">
                    <LayoutGrid className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link href="/blog" className="flex items-center space-x-3 p-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-all">
                    <Trophy className="h-5 w-5" />
                    <span>Success Stories</span>
                  </Link>
                </nav>
                
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</h3>
                  <nav className="space-y-0.5">
                    {CATEGORIES.slice(0, 8).map((cat) => (
                      <button
                        key={cat}
                        className="w-full text-left flex items-center p-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        {cat}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-10">
              {/* Filter Chips (YouTube Style) */}
              <div className="flex overflow-x-auto pb-6 space-x-3 scrollbar-hide">
                {filterChips.map((chip, i) => (
                  <button
                    key={chip}
                    className={cn(
                      "flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-all border",
                      i === 0 
                        ? "bg-slate-900 text-white border-slate-900" 
                        : "bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200"
                    )}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Course Grid (YouTube Style) */}
              <section id="courses-grid" className="mb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10">
                  {courses.map((course) => (
                    <Link key={course.id} href={`/courses/${course.id}`} className="group flex flex-col">
                      <div className="aspect-video relative rounded-xl overflow-hidden mb-3 bg-slate-100">
                        <Image 
                          src={course.image} 
                          alt={course.name} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-[10px] font-bold rounded">
                          {course.duration}
                        </div>
                        {!course.isPaid && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded uppercase">
                            Free
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {course.category.charAt(0)}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {course.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            {course.category} • {course.modulesCount} Modules
                          </p>
                          <p className="text-xs font-bold text-slate-700 mt-1">
                            {course.isPaid ? `$${course.price}` : 'Free Course'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
        {/* Mobile Categories (Visible only on mobile) */}
        <section className="lg:hidden py-12 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 px-2">Browse Categories</h2>
            <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide px-2">
              {CATEGORIES.slice(0, 10).map((cat) => (
                <button
                  key={cat}
                  className="flex-shrink-0 px-6 py-3 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
