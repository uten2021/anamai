'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  UserCog,
  Settings,
  Heart,
  Briefcase,
} from 'lucide-react';

interface NavItem {
  name: string;
  nameTh: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    nameTh: 'แดชบอร์ด',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'LTC Profiles',
    nameTh: 'ข้อมูลผู้รับบริการ',
    href: '/ltc',
    icon: Heart,
  },
  {
    name: 'Care Givers',
    nameTh: 'ผู้ดูแล',
    href: '/caregivers',
    icon: Users,
  },
  {
    name: 'Care Managers',
    nameTh: 'ผู้จัดการดูแล',
    href: '/caremanagers',
    icon: Briefcase,
    roles: ['Admin', 'CM'],
  },
  {
    name: 'Schedule',
    nameTh: 'ตารางเวลา',
    href: '/schedule',
    icon: Calendar,
  },
  {
    name: 'Visit Logs',
    nameTh: 'บันทึกการเยี่ยม',
    href: '/visits',
    icon: FileText,
  },
  {
    name: 'Users',
    nameTh: 'ผู้ใช้งาน',
    href: '/users',
    icon: UserCog,
    roles: ['Admin'],
  },
  {
    name: 'Settings',
    nameTh: 'ตั้งค่า',
    href: '/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  language?: 'en' | 'th';
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  language = 'en',
  userRole = 'Admin',
}) => {
  const pathname = usePathname();

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-luxury-navy to-luxury-navy-dark text-white shadow-luxury-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="w-10 h-10 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-lg flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">LTC Management</h1>
          <p className="text-xs text-luxury-gold-light">Healthcare Excellence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-luxury-gold text-white shadow-luxury'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">
                {language === 'th' ? item.nameTh : item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="text-center text-xs text-white/60">
          <p>Powered by Luxury Healthcare</p>
          <p className="mt-1">© 2025 All rights reserved</p>
        </div>
      </div>
    </aside>
  );
};
