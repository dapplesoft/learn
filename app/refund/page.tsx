'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { DollarSign, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';

export default function RefundPolicy() {
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
                <DollarSign className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Refund Policy</h1>
            </div>

            <div className="prose prose-slate max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <RefreshCw className="h-6 w-6 text-blue-500" />
                  <span>30-Day Money Back Guarantee</span>
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We want you to be completely satisfied with our courses. If you are not satisfied with your purchase, you can request a full refund within 30 days of your purchase date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <CheckCircle2 className="h-6 w-6 text-blue-500" />
                  <span>Eligibility for Refunds</span>
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  To be eligible for a refund, you must have completed less than 20% of the course content. This ensures that the refund policy is not misused while still protecting our students.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <HelpCircle className="h-6 w-6 text-blue-500" />
                  <span>How to Request a Refund</span>
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  To request a refund, please contact our support team at support@dapplesoft.com with your order details. We will process your request within 5-7 business days.
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
