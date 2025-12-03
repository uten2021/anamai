import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to Thai format
 */
export function formatDateThai(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date to English format
 */
export function formatDateEnglish(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dob: string | Date): number {
  const birthDate = typeof dob === 'string' ? new Date(dob) : dob;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Calculate BMI
 */
export function calculateBMI(weight: number, height: number): number {
  if (weight <= 0 || height <= 0) return 0;
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(2));
}

/**
 * Get BMI result category
 */
export function getBMIResult(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

/**
 * Get BMI color for UI
 */
export function getBMIColor(bmi: number): string {
  if (bmi < 18.5) return 'text-warning-600';
  if (bmi < 25) return 'text-success-600';
  if (bmi < 30) return 'text-warning-600';
  return 'text-error-600';
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string, length: number = 4): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 2 + length);
  return `${prefix}${timestamp}${random}`;
}

/**
 * Truncate text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Get initials from name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Format duration in minutes to hours and minutes
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
}

/**
 * Get status color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Scheduled: 'bg-primary-100 text-primary-700',
    Completed: 'bg-success-100 text-success-700',
    Cancelled: 'bg-error-100 text-error-700',
    Pending: 'bg-warning-100 text-warning-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

/**
 * Get role color
 */
export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    Admin: 'bg-luxury-navy text-white',
    CG: 'bg-primary-100 text-primary-700',
    CM: 'bg-luxury-gold-light text-luxury-gold-dark',
  };
  return colors[role] || 'bg-gray-100 text-gray-700';
}

/**
 * Validate Thai ID card number
 */
export function validateThaiId(id: string): boolean {
  if (!/^\d{13}$/.test(id)) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id.charAt(i)) * (13 - i);
  }

  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(id.charAt(12));
}

/**
 * Format blood pressure reading
 */
export function formatBloodPressure(systolic: number, diastolic: number): string {
  return `${systolic}/${diastolic}`;
}

/**
 * Parse blood pressure string
 */
export function parseBloodPressure(bp: string): { systolic: number; diastolic: number } {
  const [systolic, diastolic] = bp.split('/').map(Number);
  return { systolic, diastolic };
}

/**
 * Get blood pressure status
 */
export function getBloodPressureStatus(systolic: number, diastolic: number): {
  status: string;
  color: string;
} {
  if (systolic < 90 || diastolic < 60) {
    return { status: 'Low', color: 'text-warning-600' };
  }
  if (systolic < 120 && diastolic < 80) {
    return { status: 'Normal', color: 'text-success-600' };
  }
  if (systolic < 130 && diastolic < 80) {
    return { status: 'Elevated', color: 'text-warning-600' };
  }
  if (systolic < 140 || diastolic < 90) {
    return { status: 'High Stage 1', color: 'text-error-600' };
  }
  return { status: 'High Stage 2', color: 'text-error-600' };
}

/**
 * Sort array by key
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === bVal) return 0;

    const comparison = aVal < bVal ? -1 : 1;
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Filter array by search term
 */
export function filterBySearch<T extends Record<string, any>>(
  array: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] {
  const term = searchTerm.toLowerCase();
  return array.filter((item) =>
    fields.some((field) => String(item[field]).toLowerCase().includes(term))
  );
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
