'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function TermsOfService() {
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
                <FileText className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
            </div>

            <div className="prose prose-slate max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <Info className="h-6 w-6 text-blue-500" />
                  <span>Acceptance of Terms</span>
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  By accessing or using our services, you agree to be bound by these terms. If you do not agree to all of these terms, you may not access or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <CheckCircle2 className="h-6 w-6 text-blue-500" />
                  <span>User Accounts</span>
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                  <AlertCircle className="h-6 w-6 text-blue-500" />
                  <span>Termination</span>
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these terms or is harmful to other users of our services, us, or third parties, or for any other reason.
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
