import React from 'react';
import HeaderPublic from '@/components/HeaderPublic';
import FooterPublic from '@/components/FooterPublic';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderPublic />
      <main className="flex-grow">
        {children}
      </main>
      <FooterPublic />
    </div>
  );
}
