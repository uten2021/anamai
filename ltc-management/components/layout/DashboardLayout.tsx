'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'th'>('en');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar language={language} userRole="Admin" />
      <Navbar
        userName="Admin User"
        userRole="Admin"
        language={language}
        onLanguageChange={setLanguage}
      />
      <main className="ml-64 pt-16">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};
