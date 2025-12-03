// Database Types matching Google Sheets structure

export interface LTC {
  LTC_ID: string;
  Prefix: string;
  FirstName: string;
  LastName: string;
  DOB: string; // Date of Birth
  HouseNo: string;
  VillageNo: string;
  Phone: string;
  Diseases: string;
  ADLScore: number;
  Weight: number;
  Height: number;
  HomeCareGiver: string;
  CG_ID: string;
  PhotoURL?: string; // Google Drive URL
}

export interface CareGiver {
  CG_ID: string;
  Prefix: string;
  FirstName: string;
  LastName: string;
  DOB: string;
  HouseNo: string;
  VillageNo: string;
  Phone: string;
  CM_ID: string;
  PhotoURL?: string;
}

export interface CareManager {
  CM_ID: string;
  Prefix: string;
  FirstName: string;
  LastName: string;
  Phone: string;
  PhotoURL?: string;
}

export interface CGSchedule {
  Visit_ID: string;
  LTC_ID: string;
  CG_ID: string;
  Date: string;
  Status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending';
  Note?: string;
}

export interface Visit {
  Date: string;
  CG_ID: string;
  LTC_ID: string;
  HouseNo: string;
  VillageNo: string;
  Phone: string;
  Age: number;
  Weight: number;
  Height: number;
  BMI: number;
  BMIResult: string; // Underweight, Normal, Overweight, Obese
  Waistline: number;
  Temperature: number;
  BloodPressure: string; // e.g., "120/80"
  Pulse: number;
  Respiration: number;
  SymptomSummary: string;
  HomeCareGiver: string;
  ADLScore: number;
  StartTime: string;
  EndTime: string;
  Duration: number; // in minutes
  CareActivities: string;
  ActivityPhotoURL?: string;
}

export interface User {
  User_ID: string;
  Prefix: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Username: string;
  Password: string; // hashed
  Role: 'Admin' | 'CG' | 'CM';
}

// UI Component Types
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'th';

export interface DashboardStats {
  totalLTC: number;
  totalCG: number;
  totalCM: number;
  scheduledVisitsToday: number;
  completedVisitsToday: number;
  pendingVisits: number;
}

export interface ChartData {
  name: string;
  value: number;
}

// Form Types
export interface LTCFormData extends Omit<LTC, 'LTC_ID' | 'PhotoURL'> {
  photo?: File;
}

export interface CareGiverFormData extends Omit<CareGiver, 'CG_ID' | 'PhotoURL'> {
  photo?: File;
}

export interface CareManagerFormData extends Omit<CareManager, 'CM_ID' | 'PhotoURL'> {
  photo?: File;
}

export interface VisitFormData extends Omit<Visit, 'ActivityPhotoURL'> {
  activityPhoto?: File;
}

export interface UserFormData extends Omit<User, 'User_ID' | 'Password'> {
  password?: string;
  confirmPassword?: string;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter and Sort Types
export interface FilterOptions {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  cgId?: string;
  cmId?: string;
  ltcId?: string;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

// Google API Types
export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  webContentLink: string;
  thumbnailLink?: string;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetNames: {
    ltc: string;
    cg: string;
    cm: string;
    cgSchedule: string;
    visit: string;
    user: string;
  };
}
