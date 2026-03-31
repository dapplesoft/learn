'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Users, Target, Award, BookOpen } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />
      <main className="flex-grow py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                <Users className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
            </div>

            <div className="prose prose-slate max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <Target className="h-6 w-6 text-blue-500" />
                  <span>Our Mission</span>
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Our mission is to empower developers worldwide by providing high-quality, expert-led programming education. We believe that everyone should have access to the tools and knowledge they need to build amazing things.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <Award className="h-6 w-6 text-blue-500" />
                  <span>Expert-Led Courses</span>
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Our courses are designed and taught by industry experts with years of experience. We focus on practical, real-world skills that you can use in your career.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                  <span>Quality Education</span>
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We are committed to providing the best possible learning experience. Our platform is designed to be intuitive and easy to use, so you can focus on learning.
                </p>
              </section>

              <div className="pt-8 border-t border-slate-100 text-sm text-slate-500 italic space-y-1">
                <p>Dapplesoft Learn - Empowering Developers</p>
                <p>Founded in 2019 From Joypurhat, Bangladesh</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
