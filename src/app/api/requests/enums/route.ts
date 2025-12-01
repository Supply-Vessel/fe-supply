import { RequestStatus, PoStatus, TSIConfirm, PaymentStatus, RequestType, Role, WayBillType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/requests/enums - получить enums для requests
export async function GET() {
    try {
        const enums = {
            requestStatus: RequestStatus ? Object.values(RequestStatus) : [],
            paymentStatus: PaymentStatus ? Object.values(PaymentStatus) : [],
            wayBillType: WayBillType ? Object.values(WayBillType) : [],
            requestType: RequestType ? Object.values(RequestType) : [],
            tsiConfirm: TSIConfirm ? Object.values(TSIConfirm) : [],
            poStatus: PoStatus ? Object.values(PoStatus) : [],
            role: Role ? Object.values(Role) : [],
        };

        return NextResponse.json({
            success: true,
            data: enums
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching request enums:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch request enums',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

