import { NextRequest, NextResponse } from 'next/server';
import {
  uploadLTCPhoto,
  uploadCGPhoto,
  uploadCMPhoto,
  uploadVisitPhoto,
  isValidImageType,
  isValidFileSize,
} from '@/lib/google-drive';
import type { APIResponse } from '@/types';

/**
 * POST /api/upload
 * Upload an image to Google Drive
 *
 * Body should be FormData with:
 * - file: The image file
 * - type: 'ltc' | 'cg' | 'cm' | 'visit'
 * - filename: Optional custom filename
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const customFilename = formData.get('filename') as string | null;

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
        } as APIResponse<null>,
        { status: 400 }
      );
    }

    if (!type || !['ltc', 'cg', 'cm', 'visit'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or missing type. Must be one of: ltc, cg, cm, visit',
        } as APIResponse<null>,
        { status: 400 }
      );
    }

    // Validate file type
    if (!isValidImageType(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed',
        } as APIResponse<null>,
        { status: 400 }
      );
    }

    // Validate file size
    if (!isValidFileSize(file.size)) {
      return NextResponse.json(
        {
          success: false,
          error: 'File size exceeds 10MB limit',
        } as APIResponse<null>,
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate filename
    const timestamp = Date.now();
    const filename = customFilename || `${type}_${timestamp}_${file.name}`;

    // Upload to appropriate folder based on type
    let fileUrl: string;
    switch (type) {
      case 'ltc':
        fileUrl = await uploadLTCPhoto(buffer, filename, file.type);
        break;
      case 'cg':
        fileUrl = await uploadCGPhoto(buffer, filename, file.type);
        break;
      case 'cm':
        fileUrl = await uploadCMPhoto(buffer, filename, file.type);
        break;
      case 'visit':
        fileUrl = await uploadVisitPhoto(buffer, filename, file.type);
        break;
      default:
        throw new Error('Invalid upload type');
    }

    const response: APIResponse<{ url: string; filename: string }> = {
      success: true,
      data: {
        url: fileUrl,
        filename: filename,
      },
      message: 'File uploaded successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error uploading file:', error);

    const response: APIResponse<null> = {
      success: false,
      error: error.message || 'Failed to upload file',
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * GET /api/upload
 * Returns upload configuration and limits
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      uploadTypes: ['ltc', 'cg', 'cm', 'visit'],
    },
  });
}
