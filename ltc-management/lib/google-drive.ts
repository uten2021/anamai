import { google } from 'googleapis';
import { Readable } from 'stream';
import type { GoogleDriveFile } from '@/types';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Get Google Drive client
export async function getGoogleDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });

  const client = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: client as any });

  return drive;
}

// Folder IDs for organizing files
const FOLDER_IDS = {
  ltcPhotos: process.env.GOOGLE_DRIVE_LTC_FOLDER_ID || '',
  cgPhotos: process.env.GOOGLE_DRIVE_CG_FOLDER_ID || '',
  cmPhotos: process.env.GOOGLE_DRIVE_CM_FOLDER_ID || '',
  visitPhotos: process.env.GOOGLE_DRIVE_VISIT_FOLDER_ID || '',
};

/**
 * Upload a file to Google Drive
 * @param file - File buffer or stream
 * @param fileName - Name of the file
 * @param mimeType - MIME type of the file
 * @param folderId - Google Drive folder ID
 * @returns Google Drive file metadata including public URL
 */
export async function uploadFileToDrive(
  file: Buffer | Readable,
  fileName: string,
  mimeType: string,
  folderId: string
): Promise<GoogleDriveFile> {
  const drive = await getGoogleDriveClient();

  // Create file metadata
  const fileMetadata = {
    name: fileName,
    parents: folderId ? [folderId] : [],
  };

  // Convert buffer to stream if needed
  const media = {
    mimeType,
    body: Buffer.isBuffer(file) ? Readable.from(file) : file,
  };

  // Upload file
  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, name, mimeType, webViewLink, webContentLink',
  });

  // Make file publicly accessible
  await drive.permissions.create({
    fileId: response.data.id!,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  // Get thumbnail link for images
  let thumbnailLink: string | undefined;
  if (mimeType.startsWith('image/')) {
    const fileInfo = await drive.files.get({
      fileId: response.data.id!,
      fields: 'thumbnailLink',
    });
    thumbnailLink = fileInfo.data.thumbnailLink || undefined;
  }

  return {
    id: response.data.id!,
    name: response.data.name!,
    mimeType: response.data.mimeType!,
    webViewLink: response.data.webViewLink!,
    webContentLink: response.data.webContentLink!,
    thumbnailLink,
  };
}

/**
 * Upload LTC photo
 */
export async function uploadLTCPhoto(
  file: Buffer | Readable,
  fileName: string,
  mimeType: string
): Promise<string> {
  const result = await uploadFileToDrive(file, fileName, mimeType, FOLDER_IDS.ltcPhotos);
  return result.webContentLink || result.webViewLink;
}

/**
 * Upload Care Giver photo
 */
export async function uploadCGPhoto(
  file: Buffer | Readable,
  fileName: string,
  mimeType: string
): Promise<string> {
  const result = await uploadFileToDrive(file, fileName, mimeType, FOLDER_IDS.cgPhotos);
  return result.webContentLink || result.webViewLink;
}

/**
 * Upload Care Manager photo
 */
export async function uploadCMPhoto(
  file: Buffer | Readable,
  fileName: string,
  mimeType: string
): Promise<string> {
  const result = await uploadFileToDrive(file, fileName, mimeType, FOLDER_IDS.cmPhotos);
  return result.webContentLink || result.webViewLink;
}

/**
 * Upload Visit activity photo
 */
export async function uploadVisitPhoto(
  file: Buffer | Readable,
  fileName: string,
  mimeType: string
): Promise<string> {
  const result = await uploadFileToDrive(file, fileName, mimeType, FOLDER_IDS.visitPhotos);
  return result.webContentLink || result.webViewLink;
}

/**
 * Delete a file from Google Drive
 */
export async function deleteFileFromDrive(fileId: string): Promise<boolean> {
  try {
    const drive = await getGoogleDriveClient();
    await drive.files.delete({ fileId });
    return true;
  } catch (error) {
    console.error('Error deleting file from Drive:', error);
    return false;
  }
}

/**
 * Get file info from Google Drive
 */
export async function getFileInfo(fileId: string): Promise<GoogleDriveFile | null> {
  try {
    const drive = await getGoogleDriveClient();
    const response = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, webViewLink, webContentLink, thumbnailLink',
    });

    return {
      id: response.data.id!,
      name: response.data.name!,
      mimeType: response.data.mimeType!,
      webViewLink: response.data.webViewLink!,
      webContentLink: response.data.webContentLink || '',
      thumbnailLink: response.data.thumbnailLink || undefined,
    };
  } catch (error) {
    console.error('Error getting file info from Drive:', error);
    return null;
  }
}

/**
 * Extract file ID from Google Drive URL
 */
export function extractFileIdFromUrl(url: string): string | null {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Convert file buffer to base64 (for client-side preview)
 */
export function bufferToBase64(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

/**
 * Validate file type
 */
export function isValidImageType(mimeType: string): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(mimeType);
}

/**
 * Validate file size (max 10MB)
 */
export function isValidFileSize(size: number): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return size <= maxSize;
}
