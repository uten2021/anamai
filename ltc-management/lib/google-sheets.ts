import { google } from 'googleapis';
import type {
  LTC,
  CareGiver,
  CareManager,
  CGSchedule,
  Visit,
  User,
  GoogleSheetsConfig,
} from '@/types';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Get Google Sheets client
export async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client as any });

  return sheets;
}

// Configuration
const config: GoogleSheetsConfig = {
  spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '',
  sheetNames: {
    ltc: 'LTC',
    cg: 'CG',
    cm: 'CM',
    cgSchedule: 'CG_Schedule',
    visit: 'Visit',
    user: 'User',
  },
};

// Helper function to convert rows to objects
function rowsToObjects<T>(rows: any[][]): T[] {
  if (!rows || rows.length === 0) return [];

  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj as T;
  });
}

// Helper function to convert object to row
function objectToRow(obj: any, headers: string[]): any[] {
  return headers.map((header) => obj[header] || '');
}

// ==================== LTC CRUD ====================

export async function getAllLTC(): Promise<LTC[]> {
  const sheets = await getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.ltc}!A:N`,
  });

  return rowsToObjects<LTC>(response.data.values || []);
}

export async function getLTCById(id: string): Promise<LTC | null> {
  const allLTC = await getAllLTC();
  return allLTC.find((ltc) => ltc.LTC_ID === id) || null;
}

export async function createLTC(data: Omit<LTC, 'LTC_ID'>): Promise<LTC> {
  const sheets = await getGoogleSheetsClient();
  const allLTC = await getAllLTC();

  // Generate new ID
  const newId = `LTC${String(allLTC.length + 1).padStart(4, '0')}`;
  const newLTC: LTC = { LTC_ID: newId, ...data };

  const headers = [
    'LTC_ID', 'Prefix', 'FirstName', 'LastName', 'DOB', 'HouseNo',
    'VillageNo', 'Phone', 'Diseases', 'ADLScore', 'Weight', 'Height',
    'HomeCareGiver', 'CG_ID', 'PhotoURL',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.ltc}!A:N`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [objectToRow(newLTC, headers)],
    },
  });

  return newLTC;
}

export async function updateLTC(id: string, data: Partial<LTC>): Promise<LTC | null> {
  const sheets = await getGoogleSheetsClient();
  const allLTC = await getAllLTC();
  const index = allLTC.findIndex((ltc) => ltc.LTC_ID === id);

  if (index === -1) return null;

  const updated = { ...allLTC[index], ...data };
  const headers = [
    'LTC_ID', 'Prefix', 'FirstName', 'LastName', 'DOB', 'HouseNo',
    'VillageNo', 'Phone', 'Diseases', 'ADLScore', 'Weight', 'Height',
    'HomeCareGiver', 'CG_ID', 'PhotoURL',
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.ltc}!A${index + 2}:N${index + 2}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [objectToRow(updated, headers)],
    },
  });

  return updated;
}

export async function deleteLTC(id: string): Promise<boolean> {
  const sheets = await getGoogleSheetsClient();
  const allLTC = await getAllLTC();
  const index = allLTC.findIndex((ltc) => ltc.LTC_ID === id);

  if (index === -1) return false;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: config.spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0, // Adjust if needed
              dimension: 'ROWS',
              startIndex: index + 1,
              endIndex: index + 2,
            },
          },
        },
      ],
    },
  });

  return true;
}

// ==================== CARE GIVER CRUD ====================

export async function getAllCareGivers(): Promise<CareGiver[]> {
  const sheets = await getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.cg}!A:J`,
  });

  return rowsToObjects<CareGiver>(response.data.values || []);
}

export async function getCareGiverById(id: string): Promise<CareGiver | null> {
  const allCG = await getAllCareGivers();
  return allCG.find((cg) => cg.CG_ID === id) || null;
}

export async function createCareGiver(data: Omit<CareGiver, 'CG_ID'>): Promise<CareGiver> {
  const sheets = await getGoogleSheetsClient();
  const allCG = await getAllCareGivers();

  const newId = `CG${String(allCG.length + 1).padStart(4, '0')}`;
  const newCG: CareGiver = { CG_ID: newId, ...data };

  const headers = [
    'CG_ID', 'Prefix', 'FirstName', 'LastName', 'DOB', 'HouseNo',
    'VillageNo', 'Phone', 'CM_ID', 'PhotoURL',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.cg}!A:J`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [objectToRow(newCG, headers)],
    },
  });

  return newCG;
}

export async function updateCareGiver(id: string, data: Partial<CareGiver>): Promise<CareGiver | null> {
  const sheets = await getGoogleSheetsClient();
  const allCG = await getAllCareGivers();
  const index = allCG.findIndex((cg) => cg.CG_ID === id);

  if (index === -1) return null;

  const updated = { ...allCG[index], ...data };
  const headers = [
    'CG_ID', 'Prefix', 'FirstName', 'LastName', 'DOB', 'HouseNo',
    'VillageNo', 'Phone', 'CM_ID', 'PhotoURL',
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.cg}!A${index + 2}:J${index + 2}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [objectToRow(updated, headers)],
    },
  });

  return updated;
}

// ==================== CARE MANAGER CRUD ====================

export async function getAllCareManagers(): Promise<CareManager[]> {
  const sheets = await getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.cm}!A:F`,
  });

  return rowsToObjects<CareManager>(response.data.values || []);
}

export async function getCareManagerById(id: string): Promise<CareManager | null> {
  const allCM = await getAllCareManagers();
  return allCM.find((cm) => cm.CM_ID === id) || null;
}

export async function createCareManager(data: Omit<CareManager, 'CM_ID'>): Promise<CareManager> {
  const sheets = await getGoogleSheetsClient();
  const allCM = await getAllCareManagers();

  const newId = `CM${String(allCM.length + 1).padStart(4, '0')}`;
  const newCM: CareManager = { CM_ID: newId, ...data };

  const headers = ['CM_ID', 'Prefix', 'FirstName', 'LastName', 'Phone', 'PhotoURL'];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.cm}!A:F`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [objectToRow(newCM, headers)],
    },
  });

  return newCM;
}

// ==================== SCHEDULE CRUD ====================

export async function getAllSchedules(): Promise<CGSchedule[]> {
  const sheets = await getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.cgSchedule}!A:F`,
  });

  return rowsToObjects<CGSchedule>(response.data.values || []);
}

export async function getSchedulesByDate(date: string): Promise<CGSchedule[]> {
  const all = await getAllSchedules();
  return all.filter((schedule) => schedule.Date === date);
}

export async function createSchedule(data: Omit<CGSchedule, 'Visit_ID'>): Promise<CGSchedule> {
  const sheets = await getGoogleSheetsClient();
  const allSchedules = await getAllSchedules();

  const newId = `V${String(allSchedules.length + 1).padStart(5, '0')}`;
  const newSchedule: CGSchedule = { Visit_ID: newId, ...data };

  const headers = ['Visit_ID', 'LTC_ID', 'CG_ID', 'Date', 'Status', 'Note'];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.cgSchedule}!A:F`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [objectToRow(newSchedule, headers)],
    },
  });

  return newSchedule;
}

// ==================== VISIT CRUD ====================

export async function getAllVisits(): Promise<Visit[]> {
  const sheets = await getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.visit}!A:Y`,
  });

  return rowsToObjects<Visit>(response.data.values || []);
}

export async function createVisit(data: Visit): Promise<Visit> {
  const sheets = await getGoogleSheetsClient();

  const headers = [
    'Date', 'CG_ID', 'LTC_ID', 'HouseNo', 'VillageNo', 'Phone', 'Age',
    'Weight', 'Height', 'BMI', 'BMIResult', 'Waistline', 'Temperature',
    'BloodPressure', 'Pulse', 'Respiration', 'SymptomSummary', 'HomeCareGiver',
    'ADLScore', 'StartTime', 'EndTime', 'Duration', 'CareActivities', 'ActivityPhotoURL',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.visit}!A:Y`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [objectToRow(data, headers)],
    },
  });

  return data;
}

// ==================== USER CRUD ====================

export async function getAllUsers(): Promise<User[]> {
  const sheets = await getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.user}!A:H`,
  });

  return rowsToObjects<User>(response.data.values || []);
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const allUsers = await getAllUsers();
  return allUsers.find((user) => user.Username === username) || null;
}

export async function createUser(data: Omit<User, 'User_ID'>): Promise<User> {
  const sheets = await getGoogleSheetsClient();
  const allUsers = await getAllUsers();

  const newId = `U${String(allUsers.length + 1).padStart(4, '0')}`;
  const newUser: User = { User_ID: newId, ...data };

  const headers = [
    'User_ID', 'Prefix', 'FirstName', 'LastName', 'Email', 'Username', 'Password', 'Role',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetNames.user}!A:H`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [objectToRow(newUser, headers)],
    },
  });

  return newUser;
}
