import { NextRequest, NextResponse } from 'next/server';
import { WayBillType } from '@prisma/client';

type RouteParams = {
    params: {
        wayBillId: string;
        wayBillType: WayBillType;
    };
};

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
      const { wayBillId, wayBillType } = await params;
      const apiKey = process.env.SEARATES_API_KEY;
      let response: Response;
    if (!apiKey) {
      return NextResponse.json({ error: 'SEARATES_API_KEY is not configured' }, { status: 500 });
    }

    switch (wayBillType) {
      case WayBillType.AIR_WAYBILL:
        response = await fetch(`https://tracking.searates.com/air?api_key=${apiKey}&number=${wayBillId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        break;
      case WayBillType.PARCEL_WAYBILL:
        response = await fetch(`https://tracking.searates.com/parcel?api_key=${apiKey}&number=${wayBillId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid waybill type' }, { status: 400 });
    }
    
    if (!response.ok) {
      console.error('Searates API error:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch tracking data' }, { status: response.status });
    }
    
    const data = await response?.json();
    return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching tracking data:', error);
        return NextResponse.json({ error: 'Failed to fetch tracking data' }, { status: 500 });
    }
  }