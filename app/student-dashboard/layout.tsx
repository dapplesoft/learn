import React from 'react';
import HeaderStudent from '@/components/HeaderStudent';
import FooterStudent from '@/components/FooterStudent';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-emerald-50/30">
      <HeaderStudent />
      <main className="flex-grow">
        {children}
      </main>
      <FooterStudent />
    </div>
  );
}
