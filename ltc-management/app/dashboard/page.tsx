'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Heart,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  Activity,
  FileText,
} from 'lucide-react';

// Mock data - Replace with actual API calls
const stats = {
  totalLTC: 145,
  totalCG: 32,
  totalCM: 8,
  scheduledToday: 12,
  completedToday: 8,
  pendingVisits: 24,
};

const recentVisits = [
  {
    id: 'V00001',
    ltcName: 'สมชาย ใจดี',
    cgName: 'นางสาว มานี ดีงาม',
    date: '2025-12-03',
    status: 'Completed',
    duration: 45,
  },
  {
    id: 'V00002',
    ltcName: 'สมหญิง รักสุข',
    cgName: 'นาย สมศักดิ์ ใจซื่อ',
    date: '2025-12-03',
    status: 'Completed',
    duration: 60,
  },
  {
    id: 'V00003',
    ltcName: 'สมปอง มีสุข',
    cgName: 'นางสาว มานี ดีงาม',
    date: '2025-12-03',
    status: 'In Progress',
    duration: 30,
  },
];

const upcomingSchedule = [
  {
    id: 'S00001',
    ltcName: 'สมใจ ดีมาก',
    cgName: 'นาย สมศักดิ์ ใจซื่อ',
    time: '14:00',
    status: 'Scheduled',
  },
  {
    id: 'S00002',
    ltcName: 'สมศรี ใจดี',
    cgName: 'นางสาว มานี ดีงาม',
    time: '15:30',
    status: 'Scheduled',
  },
  {
    id: 'S00003',
    ltcName: 'สมหมาย รักงาน',
    cgName: 'นาง สุดา ใจงาม',
    time: '16:00',
    status: 'Scheduled',
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Today's Date</p>
            <p className="text-lg font-semibold text-gray-900">
              December 3, 2025
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total LTC */}
          <Card variant="luxury" hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total LTC Patients
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalLTC}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-success-600" />
                    <span className="text-sm text-success-600 font-medium">
                      +5% from last month
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Care Givers */}
          <Card variant="luxury" hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Care Givers
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalCG}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Activity className="w-4 h-4 text-primary-600" />
                    <span className="text-sm text-primary-600 font-medium">
                      {stats.totalCM} Care Managers
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-luxury-gold to-luxury-gold-dark rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card variant="luxury" hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Today's Visits
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.scheduledToday}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle className="w-4 h-4 text-success-600" />
                    <span className="text-sm text-success-600 font-medium">
                      {stats.completedToday} completed
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Visits */}
          <Card variant="luxury" hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Visits
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.pendingVisits}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-4 h-4 text-warning-600" />
                    <span className="text-sm text-warning-600 font-medium">
                      Needs attention
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Visits */}
          <Card variant="luxury">
            <CardHeader>
              <CardTitle>Recent Visits</CardTitle>
              <CardDescription>Latest completed and ongoing visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {visit.ltcName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Care Giver: {visit.cgName}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={
                            visit.status === 'Completed' ? 'success' : 'warning'
                          }
                          size="sm"
                        >
                          {visit.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {visit.duration} min
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {visit.id}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{visit.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Schedule */}
          <Card variant="luxury">
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
              <CardDescription>Today's scheduled visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSchedule.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-luxury-gold-light/20 rounded-lg border border-primary-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {schedule.ltcName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {schedule.cgName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">
                        {schedule.time}
                      </p>
                      <Badge variant="info" size="sm" className="mt-1">
                        {schedule.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-gradient">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-luxury transition-all duration-200 hover:-translate-y-1">
                <Heart className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Add LTC Patient
                </p>
              </button>
              <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-luxury transition-all duration-200 hover:-translate-y-1">
                <Calendar className="w-8 h-8 text-success-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Schedule Visit
                </p>
              </button>
              <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-luxury transition-all duration-200 hover:-translate-y-1">
                <FileText className="w-8 h-8 text-luxury-gold mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Submit Report
                </p>
              </button>
              <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-luxury transition-all duration-200 hover:-translate-y-1">
                <Users className="w-8 h-8 text-warning-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Manage Users
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
