'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />
      
      <main className="flex-grow py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-slate-900">Welcome back, {user.name}!</h1>
              <p className="text-slate-600">Track your progress and continue your learning journey.</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center space-x-4 shadow-sm">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{enrollments.length}</div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Courses</div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center space-x-4 shadow-sm">
                <div className="bg-green-50 p-2 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{enrollments.filter(e => e.status === 'completed').length}</div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Completed</div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center space-x-4 shadow-sm">
                <div className="bg-amber-50 p-2 rounded-lg">
                  <CreditCard className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{payments.length}</div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Payments</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('courses')}
              className={cn(
                "pb-4 px-2 font-bold transition-all border-b-2",
                activeTab === 'courses' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={cn(
                "pb-4 px-2 font-bold transition-all border-b-2",
                activeTab === 'payments' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              Payment History
            </button>
          </div>

          {activeTab === 'courses' ? (
            <div className="space-y-12">
              {/* Enrolled Courses */}
              <div>
                <h2 className="text-2xl font-bold mb-8 flex items-center space-x-2 text-slate-900">
                  <LayoutDashboard className="h-6 w-6 text-blue-600" />
                  <span>My Enrolled Courses</span>
                </h2>

                {enrollments.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                    <div className="mb-6 inline-block p-4 bg-slate-100 rounded-full">
                      <BookOpen className="h-12 w-12 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">No courses enrolled yet</h3>
                    <p className="text-slate-600 mb-8">Start exploring our catalog to begin your learning journey.</p>
                    <Link
                      href="/courses"
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all inline-flex items-center space-x-2 shadow-lg shadow-blue-200"
                    >
                      <span>Browse Courses</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {enrollments.map((enrollment) => (
                      <motion.div
                        key={enrollment.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="aspect-video relative">
                          <Image 
                            src={enrollment.course.image} 
                            alt={enrollment.course.name} 
                            fill 
                            className="object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/dashboard/courses/${enrollment.courseId}`}
                              className="p-4 bg-blue-600 rounded-full text-white shadow-xl shadow-blue-200 transform scale-90 group-hover:scale-100 transition-transform"
                            >
                              <Play className="h-8 w-8 fill-current" />
                            </Link>
                          </div>
                        </div>
                        <div className="p-6 flex-grow">
                          <h3 className="text-xl font-bold mb-4 line-clamp-1 text-slate-900">{enrollment.course.name}</h3>
                          
                          {/* Progress Bar */}
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-2 text-sm">
                              <span className="text-slate-500">Progress</span>
                              <span className="text-blue-600 font-bold">{enrollment.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${enrollment.progress}%` }}
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-slate-500 text-xs mb-6">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{enrollment.course.duration}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                              <span>{enrollment.completedVideos.length} / {enrollment.course.modules.reduce((acc, m) => acc + m.videos.length, 0)} Lessons</span>
                            </span>
                          </div>

                          <Link
                            href={`/dashboard/courses/${enrollment.courseId}`}
                            className="w-full py-3 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-900 border border-slate-200 rounded-xl font-bold transition-all text-center block"
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
                <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Ready to learn more?</h2>
                    <p className="text-blue-100 mb-8 max-w-xl">
                      Expand your skills with our top-rated courses. Quick and easy enrollment to keep your momentum going.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {availableCourses.map((course) => (
                        <Link
                          key={course.id}
                          href={`/courses/${course.id}`}
                          className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 transition-all group"
                        >
                          <h3 className="font-bold mb-2 group-hover:text-cyan-300 transition-colors">{course.name}</h3>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-blue-100">{course.category}</span>
                            <span className="font-bold">{course.isPaid ? `$${course.price}` : 'FREE'}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-8">
                      <Link
                        href="/courses"
                        className="inline-flex items-center space-x-2 text-white font-bold hover:underline"
                      >
                        <span>View All Courses</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl" />
                </div>
              )}
            </div>
          ) : (
            /* Payment History Section */
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900">Recent Transactions</h2>
              </div>
              {payments.length === 0 ? (
                <div className="p-12 text-center">
                  <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No payment history found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                        <th className="px-6 py-4">Course</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Plan</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{payment.course.name}</td>
                          <td className="px-6 py-4 text-slate-600 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-slate-600 text-sm">{payment.plan}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">${payment.amount.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
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
      </main>

      <Footer />
    </div>
  );
}
