import React from 'react';
import NavBar from '@/components/shared/navBar/navBar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center antialiased">
      <NavBar />
      {children}
    </div>
  );
}
