'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, Code2, LogIn, LayoutDashboard, Settings } from 'lucide-react';
import { db, User as UserType } from '@/lib/db';

export default function HeaderPublic() {
  const router = useRouter();
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
    setUser(null);
    router.push('/');
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
    setUser(newUser);
    router.push('/student-dashboard');
  };

  const navLinks = [
    { name: 'Courses', href: '/courses' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-400 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white font-mono">
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
                  className="text-blue-50 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {mounted && user ? (
                <div className="flex items-center space-x-4 ml-4">
                  <Link
                    href="/student-dashboard"
                    className="flex items-center space-x-1 text-white hover:text-blue-50 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Student Dashboard</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin-dashboard"
                      className="flex items-center space-x-1 text-amber-200 hover:text-amber-100 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStudentLogin}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all shadow-lg shadow-blue-900/20"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-50 hover:text-white hover:bg-white/10 focus:outline-none"
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
          className="md:hidden bg-blue-600 border-b border-blue-500"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-blue-50 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {mounted && user ? (
              <>
                <Link
                  href="/student-dashboard"
                  className="text-white hover:text-blue-50 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Student Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin-dashboard"
                    className="text-amber-200 hover:text-amber-100 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-blue-50 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleStudentLogin}
                className="w-full text-left bg-white text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
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
