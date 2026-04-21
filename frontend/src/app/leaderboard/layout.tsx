import React from 'react';
import NavBar from '@/components/shared/navBar/navBar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="antialiased">
      <NavBar />
      {children}
    </div>
  );
}
