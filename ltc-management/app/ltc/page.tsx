'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import {
  Heart,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  User,
} from 'lucide-react';
import { calculateAge, formatPhoneNumber, getBMIResult, calculateBMI } from '@/lib/utils';

// Mock data - Replace with actual API calls
const mockLTCData = [
  {
    LTC_ID: 'LTC0001',
    Prefix: 'นาย',
    FirstName: 'สมชาย',
    LastName: 'ใจดี',
    DOB: '1950-05-15',
    HouseNo: '123',
    VillageNo: '5',
    Phone: '0812345678',
    Diseases: 'เบาหวาน, ความดันโลหิตสูง',
    ADLScore: 12,
    Weight: 65,
    Height: 165,
    HomeCareGiver: 'นางสมหญิง ใจดี',
    CG_ID: 'CG0001',
    PhotoURL: '',
  },
  {
    LTC_ID: 'LTC0002',
    Prefix: 'นาง',
    FirstName: 'สมหญิง',
    LastName: 'รักสุข',
    DOB: '1955-08-20',
    HouseNo: '45',
    VillageNo: '3',
    Phone: '0823456789',
    Diseases: 'โรคหัวใจ',
    ADLScore: 15,
    Weight: 58,
    Height: 160,
    HomeCareGiver: 'นายสมศักดิ์ รักสุข',
    CG_ID: 'CG0002',
    PhotoURL: '',
  },
  {
    LTC_ID: 'LTC0003',
    Prefix: 'นาย',
    FirstName: 'สมปอง',
    LastName: 'มีสุข',
    DOB: '1948-12-10',
    HouseNo: '78',
    VillageNo: '7',
    Phone: '0834567890',
    Diseases: 'Alzheimer',
    ADLScore: 8,
    Weight: 72,
    Height: 170,
    HomeCareGiver: 'นางสมใจ มีสุข',
    CG_ID: 'CG0001',
    PhotoURL: '',
  },
];

export default function LTCListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLTC, setSelectedLTC] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredLTC = mockLTCData.filter(
    (ltc) =>
      ltc.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ltc.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ltc.LTC_ID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (ltc: any) => {
    setSelectedLTC(ltc);
    setIsViewModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary-600" />
              LTC Patient Profiles
            </h1>
            <p className="text-gray-600 mt-1">
              Manage long-term care patient information
            </p>
          </div>
          <Button variant="luxury" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add New Patient
          </Button>
        </div>

        {/* Filter Bar */}
        <Card variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
              <Button variant="secondary">
                <Search className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="luxury" hover>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {mockLTCData.length}
              </p>
            </CardContent>
          </Card>
          <Card variant="luxury" hover>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Average Age</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round(
                  mockLTCData.reduce(
                    (acc, ltc) => acc + calculateAge(ltc.DOB),
                    0
                  ) / mockLTCData.length
                )}{' '}
                years
              </p>
            </CardContent>
          </Card>
          <Card variant="luxury" hover>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Low ADL Score</p>
              <p className="text-2xl font-bold text-warning-600 mt-1">
                {mockLTCData.filter((ltc) => ltc.ADLScore < 10).length}
              </p>
            </CardContent>
          </Card>
          <Card variant="luxury" hover>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Active Care</p>
              <p className="text-2xl font-bold text-success-600 mt-1">
                {mockLTCData.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Patient Table */}
        <Card variant="luxury">
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
            <CardDescription>
              {filteredLTC.length} patients found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Diseases</TableHead>
                  <TableHead>ADL Score</TableHead>
                  <TableHead>BMI</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLTC.map((ltc) => {
                  const age = calculateAge(ltc.DOB);
                  const bmi = calculateBMI(ltc.Weight, ltc.Height);
                  const bmiResult = getBMIResult(bmi);

                  return (
                    <TableRow key={ltc.LTC_ID}>
                      <TableCell>
                        <span className="font-mono font-semibold text-primary-600">
                          {ltc.LTC_ID}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {ltc.FirstName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {ltc.Prefix} {ltc.FirstName} {ltc.LastName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{age} years</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {formatPhoneNumber(ltc.Phone)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {ltc.HouseNo}/{ltc.VillageNo}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 truncate max-w-[150px]">
                          {ltc.Diseases}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={ltc.ADLScore >= 12 ? 'success' : 'warning'}
                        >
                          {ltc.ADLScore}/20
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            bmiResult === 'Normal' ? 'success' : 'warning'
                          }
                        >
                          {bmi} - {bmiResult}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(ltc)}
                            className="p-1.5 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-primary-600" />
                          </button>
                          <button className="p-1.5 hover:bg-warning-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-warning-600" />
                          </button>
                          <button className="p-1.5 hover:bg-error-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-error-600" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Patient Details"
        size="lg"
      >
        {selectedLTC && (
          <div className="space-y-6">
            {/* Patient Header */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-primary-50 to-luxury-gold-light/20 rounded-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {selectedLTC.FirstName.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedLTC.Prefix} {selectedLTC.FirstName}{' '}
                  {selectedLTC.LastName}
                </h3>
                <p className="text-gray-600 mt-1">ID: {selectedLTC.LTC_ID}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="info">
                    {calculateAge(selectedLTC.DOB)} years old
                  </Badge>
                  <Badge variant="luxury">ADL: {selectedLTC.ADLScore}/20</Badge>
                </div>
              </div>
            </div>

            {/* Patient Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date of Birth
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {new Date(selectedLTC.DOB).toLocaleDateString('th-TH')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {formatPhoneNumber(selectedLTC.Phone)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  House {selectedLTC.HouseNo}, Village {selectedLTC.VillageNo}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Home Caregiver
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {selectedLTC.HomeCareGiver}
                </p>
              </div>
            </div>

            {/* Health Info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Health Information</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Weight</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedLTC.Weight} kg
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Height</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedLTC.Height} cm
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">BMI</p>
                  <p className="text-lg font-bold text-gray-900">
                    {calculateBMI(selectedLTC.Weight, selectedLTC.Height)}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  Medical Conditions
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {selectedLTC.Diseases}
                </p>
              </div>
            </div>
          </div>
        )}
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </ModalFooter>
      </Modal>
    </DashboardLayout>
  );
}
