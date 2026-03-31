'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, BookOpen, User, HelpCircle, MessageSquare, Mail } from 'lucide-react';

export default function FooterStudent() {
  return (
    <footer className="bg-emerald-900 text-emerald-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-mono">
                Student Portal
              </span>
            </div>
            <p className="text-emerald-200 max-w-md mb-6">
              Your gateway to mastering modern technologies. Track your progress, 
              access exclusive resources, and connect with our expert instructors.
            </p>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-all text-sm font-medium">
                <HelpCircle className="h-4 w-4" />
                <span>Help Center</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-all text-sm font-medium">
                <MessageSquare className="h-4 w-4" />
                <span>Community</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Dashboard</h3>
            <ul className="space-y-2 text-emerald-200">
              <li><Link href="/student-dashboard" className="hover:text-white transition-colors">My Courses</Link></li>
              <li><Link href="/student-dashboard" className="hover:text-white transition-colors">Learning Path</Link></li>
              <li><Link href="/student-dashboard" className="hover:text-white transition-colors">Certificates</Link></li>
              <li><Link href="/student-dashboard" className="hover:text-white transition-colors">Settings</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-emerald-200">
              <li><Link href="/courses" className="hover:text-white transition-colors">Browse All Courses</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Tech Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-emerald-400 text-sm">
            © {new Date().getFullYear()} Dapplesoft Student Portal. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-emerald-400 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:support@dapplesoft.com" className="flex items-center space-x-1 hover:text-white transition-colors">
              <Mail className="h-4 w-4" />
              <span>support@dapplesoft.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
