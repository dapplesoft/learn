'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db, User } from '@/lib/db';
import { motion } from 'framer-motion';
import { Lock, Github, Chrome } from 'lucide-react';

export default function LoginPage() {
  const handleSocialLogin = (provider: string) => {
    // Simulate social login
    const user: User = {
      id: `u_${Math.random().toString(36).substr(2, 9)}`,
      name: provider === 'google' ? 'Google User' : 'GitHub User',
      email: `${provider}@example.com`,
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`
    };
    db.setCurrentUser(user);
    window.location.href = '/dashboard';
  };

  const handleAdminLogin = () => {
    const user: User = {
      id: 'admin_root',
      name: 'System Admin',
      email: 'admin@dapplesoft.com',
      role: 'admin',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`
    };
    db.setCurrentUser(user);
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3 text-slate-900">
              Welcome to Dapplesoft
            </h1>
            <p className="text-slate-600">
              Sign in to access your courses and learning path
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center space-x-3 py-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all text-slate-700 font-semibold shadow-sm hover:shadow-md"
            >
              <Chrome className="h-6 w-6 text-blue-500" />
              <span>Continue with Google</span>
            </button>
            
            <button
              onClick={() => handleSocialLogin('github')}
              className="w-full flex items-center justify-center space-x-3 py-4 bg-slate-900 hover:bg-slate-800 rounded-2xl border border-slate-800 transition-all text-white font-semibold shadow-sm hover:shadow-md"
            >
              <Github className="h-6 w-6" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 mb-4">Are you a platform administrator?</p>
            <button
              onClick={handleAdminLogin}
              className="inline-flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors text-sm font-medium"
            >
              <Lock className="h-4 w-4" />
              <span>Admin Portal Access</span>
            </button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
