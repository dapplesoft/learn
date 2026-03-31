'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, GraduationCap, LayoutDashboard, BookOpen, LogOut, User } from 'lucide-react';
import { db, User as UserType } from '@/lib/db';

export default function HeaderStudent() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setUser(db.getCurrentUser());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    db.setCurrentUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'My Courses', href: '/student-dashboard', icon: BookOpen },
    { name: 'Browse All', href: '/courses', icon: GraduationCap },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/student-dashboard" className="flex items-center space-x-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-emerald-900 font-mono">
                Student Portal
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-slate-600 hover:text-emerald-600 flex items-center space-x-1 text-sm font-medium transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <div className="h-6 w-px bg-slate-200 mx-2" />
              
              {mounted && user && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs border border-emerald-200">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-slate-500 hover:text-red-600 text-sm font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white border-b border-emerald-100"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-600 hover:text-emerald-600 flex items-center space-x-3 p-3 rounded-xl hover:bg-emerald-50 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <link.icon className="h-5 w-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
            {mounted && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-600 flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-all font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
