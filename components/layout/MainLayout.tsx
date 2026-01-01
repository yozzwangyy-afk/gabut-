'use client';

import { ReactNode } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black">
      <Header />
      
      <div className="flex-1 flex">
        {showSidebar && (
          <div className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-800/50">
            <Sidebar />
          </div>
        )}
        
        <main className="flex-1">
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
