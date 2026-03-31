'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Settings, Server, Database, Activity, Lock } from 'lucide-react';

export default function FooterAdmin() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-purple-600 p-1.5 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-mono tracking-tight">
                Admin <span className="text-purple-400">Panel</span>
              </span>
            </div>
            <p className="text-slate-500 max-w-md mb-6">
              System administration and management portal. Monitor performance, 
              manage content, and oversee user activity with real-time analytics.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
                <Activity className="h-3 w-3 text-green-500" />
                <span>System: Healthy</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
                <Server className="h-3 w-3 text-purple-500" />
                <span>v1.2.4-stable</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 text-slate-200 uppercase tracking-widest">Management</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/admin-dashboard" className="hover:text-purple-400 transition-colors">Course Manager</Link></li>
              <li><Link href="/admin-dashboard" className="hover:text-purple-400 transition-colors">Blog Editor</Link></li>
              <li><Link href="/admin-dashboard" className="hover:text-purple-400 transition-colors">User Directory</Link></li>
              <li><Link href="/admin-dashboard" className="hover:text-purple-400 transition-colors">Revenue Stats</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 text-slate-200 uppercase tracking-widest">System</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/admin-dashboard" className="hover:text-purple-400 transition-colors flex items-center space-x-2">
                <Settings className="h-3 w-3" />
                <span>Settings</span>
              </Link></li>
              <li><Link href="/admin-dashboard" className="hover:text-purple-400 transition-colors flex items-center space-x-2">
                <Database className="h-3 w-3" />
                <span>Backups</span>
              </Link></li>
              <li><Link href="/admin-dashboard" className="hover:text-purple-400 transition-colors flex items-center space-x-2">
                <Lock className="h-3 w-3" />
                <span>Security Logs</span>
              </Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Dapplesoft Admin System. Internal use only.
          </p>
          <div className="flex items-center space-x-6 text-slate-600 text-xs">
            <Link href="/" className="hover:text-white transition-colors">Public Site</Link>
            <Link href="/student-dashboard" className="hover:text-white transition-colors">Student View</Link>
            <span className="text-slate-800">|</span>
            <span className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Secure Session</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
