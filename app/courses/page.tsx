'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db, Course, User } from '@/lib/db';
import { motion } from 'framer-motion';
import { Search, Filter, Play, Clock, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');

  useEffect(() => {
    const data = db.getCourses().filter(c => c.published);
    const timer = setTimeout(() => {
      setCourses(data);
      setFilteredCourses(data);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = courses;
    if (search) {
      filtered = filtered.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (category !== 'All') {
      filtered = filtered.filter(c => c.category === category);
    }
    if (type !== 'All') {
      filtered = filtered.filter(c => type === 'Free' ? !c.isPaid : c.isPaid);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredCourses(filtered);
  }, [search, category, type, courses]);

  const categories = ['All', ...new Set(courses.map(c => c.category))];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 text-slate-900">Explore Courses</h1>
            <p className="text-slate-600">Master the most in-demand programming skills with our structured curriculum.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="All">All Types</option>
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col group hover:border-blue-500/50 transition-all shadow-sm"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image 
                    src={course.image} 
                    alt={course.name} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                    {course.category}
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{course.name}</h3>
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
                      <BookOpen className="h-3 w-3" />
                      <span>{course.modulesCount} Modules</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration}</span>
                    </span>
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full py-3 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-900 rounded-xl font-bold transition-all text-center flex items-center justify-center space-x-2"
                  >
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No courses found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
