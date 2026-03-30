'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db, Course, User, Enrollment, Payment } from '@/lib/db';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Play, BookOpen, Clock, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function EnrollmentPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Lifetime Access');

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const courses = db.getCourses();
    const found = courses.find(c => c.id === params.id);
    const currentUser = db.getCurrentUser();

    const timer = setTimeout(() => {
      if (found) setCourse(found);
      setUser(currentUser);

      if (currentUser && found) {
        const enrollments = db.getEnrollments();
        const enrolled = enrollments.some(e => e.userId === currentUser.id && e.courseId === found.id);
        setIsEnrolled(enrolled);
        if (enrolled) {
          router.push('/dashboard');
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [params.id, router]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (course?.isPaid && !showPayment) {
      setShowPayment(true);
      return;
    }

    setLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));

    // eslint-disable-next-line react-hooks/purity
    const enrollmentId = Math.random().toString(36).substr(2, 9);
    const newEnrollment: Enrollment = {
      id: enrollmentId,
      userId: user.id,
      courseId: course!.id,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedVideos: [],
      status: 'active'
    };

    const enrollments = db.getEnrollments();
    db.saveEnrollments([...enrollments, newEnrollment]);

    if (course?.isPaid) {
      const planPrice = plans.find(p => p.name === selectedPlan)?.price.replace('$', '') || course.price.toString();
      // eslint-disable-next-line react-hooks/purity
      const paymentId = Math.random().toString(36).substr(2, 9);
      const newPayment: Payment = {
        id: paymentId,
        userId: user.id,
        courseId: course.id,
        amount: parseFloat(planPrice),
        status: 'success',
        date: new Date().toISOString(),
        plan: selectedPlan
      };
      const payments = db.getPayments();
      db.savePayments([...payments, newPayment]);
    }

    setLoading(false);
    setIsEnrolled(true);
    setShowSuccess(true);
    
    // Delay redirect to show success state
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  if (!course) return null;

  const plans = course.pricingType === 'tiered' ? [
    { name: '1 Month Access', price: `$${(course.tieredPrices?.oneMonth || course.price * 0.25).toFixed(2)}` },
    { name: '3 Months Access', price: `$${(course.tieredPrices?.threeMonths || course.price * 0.5).toFixed(2)}` },
    { name: '6 Months Access', price: `$${(course.tieredPrices?.sixMonths || course.price * 0.75).toFixed(2)}` },
    { name: '1 Year Access', price: `$${(course.tieredPrices?.oneYear || course.price * 0.9).toFixed(2)}` },
    { name: 'Lifetime Access', price: `$${(course.tieredPrices?.lifetime || course.price).toFixed(2)}` },
  ] : [
    { name: 'Lifetime Access', price: `$${course.price.toFixed(2)}` }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="aspect-video rounded-3xl overflow-hidden mb-8 border border-slate-200 shadow-sm relative">
                  <Image src={course.image} alt={course.name} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-slate-900">{course.name}</h1>
                <div className="flex flex-wrap gap-4 mb-8">
                  <span className="flex items-center space-x-1 text-slate-600 bg-white px-3 py-1 rounded-full text-sm border border-slate-200 shadow-sm">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.modulesCount} Modules</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-600 bg-white px-3 py-1 rounded-full text-sm border border-slate-200 shadow-sm">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration} Total</span>
                  </span>
                  <span className="flex items-center space-x-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm border border-blue-100">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Certificate Included</span>
                  </span>
                </div>

                <div className="prose max-w-none mb-12">
                  <h2 className="text-2xl font-bold mb-4 text-slate-900">Course Description</h2>
                  <p className="text-slate-600 leading-relaxed">{course.description}</p>
                  
                  <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">What you will learn</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Industry standard practices', 'Real-world projects', 'Modern frameworks', 'Optimized workflows'].map((item, i) => (
                      <li key={i} className="flex items-center space-x-2 text-slate-700">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 text-slate-900">Curriculum Overview</h2>
                  <div className="space-y-4">
                    {course.modules.map((module, i) => (
                      <div key={module.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <h3 className="font-bold text-lg mb-2 flex items-center space-x-2">
                          <span className="text-blue-600">Module {i + 1}:</span>
                          <span className="text-slate-900">{module.title}</span>
                        </h3>
                        <div className="space-y-2">
                          {module.videos.map((video) => (
                            <div key={video.id} className="flex items-center justify-between text-sm text-slate-500">
                              <div className="flex items-center space-x-2">
                                <Play className="h-3 w-3" />
                                <span>{video.title}</span>
                              </div>
                              <span>{video.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Enrollment Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl"
                >
                  <div className="mb-8">
                    <div className="text-slate-500 text-sm mb-1">Course Price</div>
                    <div className="text-4xl font-bold text-slate-900">
                      {course.isPaid ? (
                        course.pricingType === 'tiered' 
                          ? plans.find(p => p.name === selectedPlan)?.price || `$${course.price}`
                          : `$${course.price}`
                      ) : 'FREE'}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {course.isPaid && showPayment ? (
                      <motion.div
                        key="payment"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6"
                      >
                        {course.pricingType === 'tiered' && (
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700">Select Access Plan</label>
                            <div className="grid grid-cols-1 gap-2">
                              {plans.map((plan) => (
                                <button
                                  key={plan.name}
                                  onClick={() => setSelectedPlan(plan.name)}
                                  className={cn(
                                    "flex justify-between items-center p-3 rounded-xl border transition-all text-sm",
                                    selectedPlan === plan.name 
                                      ? "bg-blue-50 border-blue-500 text-blue-700" 
                                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                                  )}
                                >
                                  <span>{plan.name}</span>
                                  <span className="font-bold">{plan.price}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                          <div className="flex items-center space-x-2 text-sm text-slate-700">
                            <CreditCard className="h-4 w-4" />
                            <span>Payment Details</span>
                          </div>
                          <input 
                            type="text" 
                            placeholder="Card Number" 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-900"
                            defaultValue="4242 4242 4242 4242"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="MM/YY" className="bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-900" defaultValue="12/26" />
                            <input type="text" placeholder="CVC" className="bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-900" defaultValue="123" />
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <button
                    onClick={handleEnroll}
                    disabled={loading || isEnrolled}
                    className={cn(
                      "w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center space-x-2 mt-6 shadow-lg",
                      showSuccess
                        ? "bg-green-600 text-white shadow-green-200/40"
                        : isEnrolled 
                          ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
                          : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-200/40"
                    )}
                  >
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : showSuccess ? (
                      <>
                        <CheckCircle2 className="h-6 w-6" />
                        <span>Enrolled Successfully!</span>
                      </>
                    ) : isEnrolled ? (
                      <>
                        <CheckCircle2 className="h-6 w-6" />
                        <span>Already Enrolled</span>
                      </>
                    ) : (
                      <span>{course.isPaid ? (showPayment ? 'Confirm & Pay' : 'Enroll Now') : 'Enroll for Free'}</span>
                    )}
                  </button>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center space-x-3 text-sm text-slate-600">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-600">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      <span>Access on mobile and TV</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-600">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
