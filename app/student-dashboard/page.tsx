'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { db, User, Enrollment, Course, Payment } from '@/lib/db';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, Clock, BookOpen, ArrowRight, LayoutDashboard, Award, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [enrollments, setEnrollments] = useState<(Enrollment & { course: Course })[]>([]);
  const [payments, setPayments] = useState<(Payment & { course: Course })[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'payments'>('courses');

  useEffect(() => {
    // Ensure we start at the top of the page
    window.scrollTo(0, 0);

    const currentUser = db.getCurrentUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(currentUser);

    const allEnrollments = db.getEnrollments();
    const userEnrollments = allEnrollments.filter(e => e.userId === currentUser.id);
    const courses = db.getCourses();

    const enrichedEnrollments = userEnrollments.map(e => ({
      ...e,
      course: courses.find(c => c.id === e.courseId)!
    })).filter(e => e.course);

    setEnrollments(enrichedEnrollments);

    const allPayments = db.getPayments();
    const userPayments = allPayments.filter(p => p.userId === currentUser.id);
    const enrichedPayments = userPayments.map(p => ({
      ...p,
      course: courses.find(c => c.id === p.courseId)!
    })).filter(p => p.course);

    setPayments(enrichedPayments);

    // Courses not yet enrolled
    const enrolledIds = userEnrollments.map(e => e.courseId);
    const available = courses.filter(c => !enrolledIds.includes(c.id) && c.published);
    setAvailableCourses(available.slice(0, 3)); // Show top 3
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-emerald-50/30">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-emerald-900/40 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-emerald-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-emerald-900">Welcome back, {user.name}!</h1>
              <p className="text-emerald-700/80 font-medium">Track your progress and continue your learning journey.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white border border-emerald-100 p-4 rounded-2xl flex items-center space-x-4 shadow-sm min-w-[140px]">
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-900">{enrollments.length}</div>
                  <div className="text-[10px] text-emerald-600/60 uppercase font-bold tracking-wider">Courses</div>
                </div>
              </div>
              <div className="bg-white border border-emerald-100 p-4 rounded-2xl flex items-center space-x-4 shadow-sm min-w-[140px]">
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <Award className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-900">{enrollments.filter(e => e.status === 'completed').length}</div>
                  <div className="text-[10px] text-emerald-600/60 uppercase font-bold tracking-wider">Completed</div>
                </div>
              </div>
              <div className="bg-white border border-emerald-100 p-4 rounded-2xl flex items-center space-x-4 shadow-sm min-w-[140px]">
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <CreditCard className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-900">{payments.length}</div>
                  <div className="text-[10px] text-emerald-600/60 uppercase font-bold tracking-wider">Payments</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 mb-8 border-b border-emerald-100">
            <button
              onClick={() => setActiveTab('courses')}
              className={cn(
                "pb-4 px-2 font-bold transition-all border-b-2 text-sm uppercase tracking-wider",
                activeTab === 'courses' ? "border-emerald-600 text-emerald-600" : "border-transparent text-emerald-900/40 hover:text-emerald-900/60"
              )}
            >
              My Learning
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={cn(
                "pb-4 px-2 font-bold transition-all border-b-2 text-sm uppercase tracking-wider",
                activeTab === 'payments' ? "border-emerald-600 text-emerald-600" : "border-transparent text-emerald-900/40 hover:text-emerald-900/60"
              )}
            >
              Billing History
            </button>
          </div>

          {activeTab === 'courses' ? (
            <div className="space-y-12">
              {/* Enrolled Courses */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold flex items-center space-x-2 text-emerald-900">
                    <LayoutDashboard className="h-6 w-6 text-emerald-600" />
                    <span>Active Courses</span>
                  </h2>
                  <Link href="/courses" className="text-emerald-600 hover:text-emerald-700 font-bold text-sm flex items-center space-x-1">
                    <span>Browse More</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {enrollments.length === 0 ? (
                  <div className="bg-white border border-emerald-100 rounded-3xl p-16 text-center shadow-sm">
                    <div className="mb-6 inline-block p-6 bg-emerald-50 rounded-full">
                      <BookOpen className="h-12 w-12 text-emerald-300" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-emerald-900">No courses enrolled yet</h3>
                    <p className="text-emerald-700/60 mb-8 max-w-md mx-auto">Start exploring our catalog to begin your learning journey and master new skills today.</p>
                    <Link
                      href="/courses"
                      className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all inline-flex items-center space-x-2 shadow-xl shadow-emerald-200"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {enrollments.map((enrollment) => (
                      <motion.div
                        key={enrollment.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl border border-emerald-100 overflow-hidden flex flex-col group shadow-sm hover:shadow-xl transition-all"
                      >
                        <div className="aspect-video relative">
                          <Image 
                            src={enrollment.course.image} 
                            alt={enrollment.course.name} 
                            fill 
                            className="object-cover transition-transform group-hover:scale-105" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                            <Link
                              href={`/student-dashboard/courses/${enrollment.courseId}`}
                              className="p-4 bg-white rounded-full text-emerald-600 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform"
                            >
                              <Play className="h-8 w-8 fill-current" />
                            </Link>
                          </div>
                          <div className="absolute bottom-4 left-4">
                            <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                              {enrollment.course.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex-grow">
                          <h3 className="text-xl font-bold mb-4 line-clamp-1 text-emerald-950 group-hover:text-emerald-600 transition-colors">{enrollment.course.name}</h3>
                          
                          {/* Progress Bar */}
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-2 text-xs">
                              <span className="text-emerald-700/60 font-bold uppercase tracking-wider">Progress</span>
                              <span className="text-emerald-600 font-bold">{enrollment.progress}%</span>
                            </div>
                            <div className="w-full bg-emerald-50 h-2 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${enrollment.progress}%` }}
                                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-emerald-700/60 text-[10px] font-bold uppercase tracking-wider mb-6">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{enrollment.course.duration}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              <span>{enrollment.completedVideos.length} / {enrollment.course.modules.reduce((acc, m) => acc + m.videos.length, 0)} Lessons</span>
                            </span>
                          </div>

                          <Link
                            href={`/student-dashboard/courses/${enrollment.courseId}`}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all text-center block shadow-lg shadow-emerald-100"
                          >
                            {enrollment.progress === 0 ? 'Start Learning' : 'Continue Learning'}
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Purchase Section */}
              {availableCourses.length > 0 && (
                <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative shadow-2xl shadow-emerald-900/20">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Expand Your Knowledge</h2>
                    <p className="text-emerald-100/80 mb-8 max-w-xl text-lg">
                      Don&apos;t stop now! Explore these recommended courses to further enhance your professional skills.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {availableCourses.map((course) => (
                        <Link
                          key={course.id}
                          href={`/courses/${course.id}`}
                          className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all group"
                        >
                          <h3 className="font-bold mb-2 group-hover:text-teal-300 transition-colors line-clamp-1">{course.name}</h3>
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-emerald-300">{course.category}</span>
                            <span className="text-white bg-emerald-600/50 px-2 py-0.5 rounded">{course.isPaid ? `$${course.price}` : 'FREE'}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-10">
                      <Link
                        href="/courses"
                        className="inline-flex items-center space-x-2 bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg"
                      >
                        <span>View All Courses</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
                  <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
                </div>
              )}
            </div>
          ) : (
            /* Payment History Section */
            <div className="bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-emerald-50 bg-emerald-50/30 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-emerald-900">Billing History</h2>
                <div className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {payments.length} Transactions
                </div>
              </div>
              {payments.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="h-8 w-8 text-emerald-300" />
                  </div>
                  <p className="text-emerald-900/40 font-bold uppercase tracking-widest text-sm">No payment history found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-emerald-50/50 text-emerald-900/40 text-[10px] uppercase tracking-widest font-bold">
                        <th className="px-8 py-5">Course Description</th>
                        <th className="px-8 py-5">Date</th>
                        <th className="px-8 py-5">Plan Type</th>
                        <th className="px-8 py-5 text-right">Amount</th>
                        <th className="px-8 py-5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-50">
                      {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-emerald-50/20 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="font-bold text-emerald-950 group-hover:text-emerald-600 transition-colors">{payment.course.name}</div>
                            <div className="text-[10px] text-emerald-700/40 uppercase font-bold tracking-wider mt-1">ID: {payment.id}</div>
                          </td>
                          <td className="px-8 py-6 text-emerald-900/60 text-sm font-medium">{new Date(payment.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                          <td className="px-8 py-6">
                            <span className="text-emerald-900/60 text-sm font-medium">{payment.plan}</span>
                          </td>
                          <td className="px-8 py-6 text-right font-bold text-emerald-950">${payment.amount.toFixed(2)}</td>
                          <td className="px-8 py-6 text-center">
                            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  );
}
