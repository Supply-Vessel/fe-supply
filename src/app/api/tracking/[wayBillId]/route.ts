import { NextRequest, NextResponse } from 'next/server';

type RouteParams = {
    params: {
        wayBillId: string;
    };
};

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { wayBillId } = await params;
    
    const apiKey = process.env.SEARATES_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'SEARATES_API_KEY is not configured' }, { status: 500 });
    }
    
    const response = await fetch(`https://tracking.searates.com/air?api_key=${apiKey}&number=${wayBillId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Searates API error:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch tracking data' }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching tracking data:', error);
        return NextResponse.json({ error: 'Failed to fetch tracking data' }, { status: 500 });
    }
  }