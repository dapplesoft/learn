'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, Code2, LogIn, User, LayoutDashboard, Settings } from 'lucide-react';
import { db, User as UserType } from '@/lib/db';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(db.getCurrentUser());
  }, []);

  const handleLogout = () => {
    db.setCurrentUser(null);
    window.location.href = '/';
  };

  const handleStudentLogin = () => {
    const newUser: UserType = {
      id: `u_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Student User',
      email: 'student@example.com',
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=student`
    };
    db.setCurrentUser(newUser);
    window.location.href = '/dashboard';
  };

  const navLinks = [
    { name: 'Courses', href: '/courses' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                Dapplesoft Learn
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <div className="flex items-center space-x-4 ml-4">
                  <button
                    onClick={handleStudentLogin}
                    className="flex items-center space-x-1 text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Student Login</span>
                  </button>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <Settings className="h-4 w-4" />
                      <span>admin</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStudentLogin}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all shadow-lg shadow-blue-900/20"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Student Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-slate-200"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <button
                  onClick={handleStudentLogin}
                  className="text-slate-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Student Login
                </button>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-amber-600 hover:text-amber-700 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-slate-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleStudentLogin}
                className="w-full text-left bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Student Login
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
