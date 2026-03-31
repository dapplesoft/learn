'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube, Github, Mail, MessageSquare, PinIcon, Lock } from 'lucide-react';
import { db, User as UserType } from '@/lib/db';

export default function FooterPublic() {
  const handleAdminLogin = () => {
    const adminUser: UserType = {
      id: 'admin_root',
      name: 'System Admin',
      email: 'admin@dapplesoft.com',
      role: 'admin',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`
    };
    db.setCurrentUser(adminUser);
    window.location.href = '/admin-dashboard';
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/dapplesoft/', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/dapplesoft', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/dapplesoft/', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://www.youtube.com/@dapplesoft', label: 'YouTube' },
    { icon: MessageSquare, href: 'https://www.reddit.com/user/Dapplesoft', label: 'Reddit' },
    { icon: PinIcon, href: 'https://www.pinterest.com/dapplesoft', label: 'Pinterest' },
    { icon: Github, href: 'https://github.com/dapplesoft', label: 'GitHub' },
    { icon: Mail, href: 'mailto:info@dapplesoft.com', label: 'Email' },
  ];

  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-400 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 font-mono">Dapplesoft Learn</h2>
            <p className="text-blue-50 max-w-md mb-6">
              Empowering developers worldwide with high-quality programming education. 
              Master C#, .NET, PHP, Linux, and more with our expert-led courses.
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-blue-50">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Articles</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-blue-50">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-100 text-sm order-2 md:order-1">
            © {new Date().getFullYear()} Dapplesoft. All rights reserved.
          </p>
          <div className="order-1 md:order-2">
            <button 
              onClick={handleAdminLogin}
              className="text-white/60 hover:text-white text-xs transition-colors flex items-center space-x-1 bg-transparent border-none cursor-pointer font-bold"
            >
              <Lock className="h-3 w-3" />
              <span>admin login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
