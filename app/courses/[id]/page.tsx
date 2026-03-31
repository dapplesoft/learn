'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db, Course, User, Enrollment } from '@/lib/db';
import { motion } from 'framer-motion';
import { BookOpen, Clock, CheckCircle2, ChevronRight, Play, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const courses = db.getCourses();
    const data = courses.find(c => c.id === id);
    const currentUser = db.getCurrentUser();

    const timer = setTimeout(() => {
      if (data) {
        setCourse(data);
      }
      setUser(currentUser);

      if (currentUser && data) {
        const enrollments = db.getEnrollments();
        const enrolled = enrollments.some(e => e.userId === currentUser.id && e.courseId === data.id);
        setIsEnrolled(enrolled);
      }
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [params.id]);

  const handleEnrollClick = async () => {
    let currentUser = user;
    if (!currentUser) {
      currentUser = {
        id: `u_${Math.random().toString(36).substr(2, 9)}`,
        name: 'Student User',
        email: 'student@example.com',
        role: 'student',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=student`
      };
      db.setCurrentUser(currentUser);
      setUser(currentUser);
    }

    if (isEnrolled) {
      router.push('/student-dashboard');
      return;
    }

    if (course?.isPaid) {
      router.push(`/courses/${course.id}/enroll`);
      return;
    }

    // Direct enrollment for free courses
    setEnrolling(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000));

    const enrollmentId = Math.random().toString(36).substr(2, 9);
    const newEnrollment: Enrollment = {
      id: enrollmentId,
      userId: currentUser.id,
      courseId: course!.id,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedVideos: [],
      status: 'active'
    };

    const enrollments = db.getEnrollments();
    db.saveEnrollments([...enrollments, newEnrollment]);

    setEnrolling(false);
    router.push('/student-dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Course Not Found</h1>
          <Link href="/courses" className="text-emerald-600 hover:underline flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Courses</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image 
              src={course.image} 
              alt={course.name} 
              fill 
              className="object-cover blur-sm"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link href="/courses" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Courses</span>
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full mb-4 inline-block">
                  {course.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                  {course.name}
                </h1>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  {course.shortDescription}
                </p>
                
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <BookOpen className="h-5 w-5 text-emerald-400" />
                    <span>{course.modulesCount} Modules</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Clock className="h-5 w-5 text-emerald-400" />
                    <span>{course.duration} Total Content</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Play className="h-5 w-5 text-emerald-400" />
                    <span>Video Lessons</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleEnrollClick}
                    disabled={enrolling}
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center space-x-2"
                  >
                    {enrolling ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : isEnrolled ? (
                      'Go to Dashboard'
                    ) : (
                      'Enroll Now'
                    )}
                  </button>
                  <div className="text-2xl font-bold">
                    {course.isPaid ? `$${course.price}` : 'FREE'}
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl">
                  <Image 
                    src={course.image} 
                    alt={course.name} 
                    fill 
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                      <Play className="h-10 w-10 text-white fill-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-slate-900">About this Course</h2>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                    {course.description.split('\n').map((para, i) => (
                      <p key={i} className="mb-4">{para}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6 text-slate-900">Course Curriculum</h2>
                  <div className="space-y-4">
                    {course.modules.map((module, mIdx) => (
                      <div key={module.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                        <div className="bg-slate-50 p-4 flex items-center justify-between border-b border-slate-200">
                          <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm">
                              {mIdx + 1}
                            </span>
                            <h3 className="font-bold text-slate-900">{module.title}</h3>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            {module.videos.length} Lessons
                          </span>
                        </div>
                        <div className="p-2 space-y-1">
                          {module.videos.map((video, vIdx) => (
                            <div key={video.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                              <div className="flex items-center space-x-3">
                                <Play className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{video.title}</span>
                              </div>
                              <span className="text-xs text-slate-400">{video.duration}m</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                    <h3 className="text-xl font-bold mb-6 text-slate-900">What you&apos;ll get</h3>
                    <ul className="space-y-4">
                      {[
                        'Lifetime access to content',
                        'Hands-on coding exercises',
                        'Downloadable resources',
                        'Course completion certificate',
                        'Community support access',
                        'Mobile-friendly learning'
                      ].map((item, i) => (
                        <li key={i} className="flex items-start space-x-3 text-sm text-slate-600">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-8 pt-8 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-slate-500 font-medium">Price</span>
                        <span className="text-3xl font-bold text-slate-900">
                          {course.isPaid ? `$${course.price}` : 'FREE'}
                        </span>
                      </div>
                      <button
                        onClick={handleEnrollClick}
                        disabled={enrolling}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all text-center block shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2"
                      >
                        {enrolling ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : isEnrolled ? (
                          'Go to Dashboard'
                        ) : (
                          'Enroll Now'
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-4">Need help?</h3>
                      <p className="text-emerald-100 text-sm mb-6">
                        Have questions about this course? Our support team is here to help you.
                      </p>
                      <button className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all">
                        Contact Support
                      </button>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500 rounded-full blur-2xl opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
