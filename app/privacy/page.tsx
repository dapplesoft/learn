'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
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
                <Shield className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
            </div>

            <div className="prose prose-slate max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <Lock className="h-6 w-6 text-blue-500" />
                  <span>Information We Collect</span>
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We collect information that you provide directly to us when you create an account, enroll in a course, or communicate with us. This may include your name, email address, payment information, and any other information you choose to provide.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <Eye className="h-6 w-6 text-blue-500" />
                  <span>How We Use Your Information</span>
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you about your account and our products.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-blue-500" />
                  <span>Data Security</span>
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                </p>
              </section>

              <div className="pt-8 border-t border-slate-100 text-sm text-slate-500 italic">
                Last updated: March 30, 2026
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
