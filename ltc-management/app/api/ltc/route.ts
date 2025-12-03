import { NextRequest, NextResponse } from 'next/server';
import { getAllLTC, createLTC } from '@/lib/google-sheets';
import type { LTC, APIResponse } from '@/types';

/**
 * GET /api/ltc
 * Fetch all LTC patients
 */
export async function GET(request: NextRequest) {
  try {
    const ltcData = await getAllLTC();

    const response: APIResponse<LTC[]> = {
      success: true,
      data: ltcData,
      message: `Retrieved ${ltcData.length} LTC patients`,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching LTC data:', error);

    const response: APIResponse<null> = {
      success: false,
      error: error.message || 'Failed to fetch LTC data',
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * POST /api/ltc
 * Create a new LTC patient
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'Prefix',
      'FirstName',
      'LastName',
      'DOB',
      'HouseNo',
      'VillageNo',
      'Phone',
      'Diseases',
      'ADLScore',
      'Weight',
      'Height',
      'HomeCareGiver',
      'CG_ID',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          } as APIResponse<null>,
          { status: 400 }
        );
      }
    }

    // Create new LTC patient
    const newLTC = await createLTC({
      Prefix: body.Prefix,
      FirstName: body.FirstName,
      LastName: body.LastName,
      DOB: body.DOB,
      HouseNo: body.HouseNo,
      VillageNo: body.VillageNo,
      Phone: body.Phone,
      Diseases: body.Diseases,
      ADLScore: Number(body.ADLScore),
      Weight: Number(body.Weight),
      Height: Number(body.Height),
      HomeCareGiver: body.HomeCareGiver,
      CG_ID: body.CG_ID,
      PhotoURL: body.PhotoURL || '',
    });

    const response: APIResponse<LTC> = {
      success: true,
      data: newLTC,
      message: 'LTC patient created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating LTC patient:', error);

    const response: APIResponse<null> = {
      success: false,
      error: error.message || 'Failed to create LTC patient',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
