import { RequestStatus, AccessStatus, RequestType, PoStatus, PaymentStatus, TSIConfirm, WayBillType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';

// POST /api/requests - создать request
export async function POST(req: NextRequest) {
    try {
        const {
            tsiConfirm,
            identifier,
            poStatus,
            poNumber,
            paymentStatus,
            description,
            wayBillType,
            wayBillNumber,
            storeLocation,
            status,
            offerNumber,
            companyOfOrder,
            countryOfOrder,
            requestType,
            vesselId,
            userId,
        } = await req.json();

        // Check required fields
        if (!identifier || !vesselId || !requestType) {
            return NextResponse.json({
                success: false,
                message: 'Required fields: identifier, vesselId, requestType'
            }, { status: 400 });
        }

        // Check if laboratory exists
        const vessel = await prismaClient.vessel.findFirst({
            where: {
                name: vesselId,
                users: {
                    some: {
                        userId: userId,
                        accessStatus: AccessStatus.ACTIVE
                    }
                }
            }
        });

        if (!vessel) {
            return NextResponse.json({
                success: false,
                message: 'Vessel not found'
            }, { status: 404 });
        }

        // Check if request with this identifier already exists in this vessel
        const existingRequest = await prismaClient.request.findFirst({
            where: {
                identifier: identifier,
                vesselId: vessel.id
            }
        });

        if (existingRequest) {
            return NextResponse.json({
                success: false,
                message: 'Request with this identifier already exists in this vessel'
            }, { status: 409 });
        }

        // Create request
        const request = await prismaClient.request.create({
            data: {
                tsiConfirm: (tsiConfirm as TSIConfirm) || TSIConfirm.NOT_CONFIRMED,
                identifier,
                poStatus: (poStatus as PoStatus) || PoStatus.WITHOUT_PO,
                poNumber,
                paymentStatus: (paymentStatus as PaymentStatus) || PaymentStatus.CREDIT_NOT_PAID,
                description,
                wayBillType: (wayBillType as WayBillType) || WayBillType.NO_WAYBILL,
                wayBillNumber: wayBillNumber?.trim() || null,
                storeLocation,
                status: (status as RequestStatus) || RequestStatus.ON_HOLD,
                offerNumber,
                companyOfOrder,
                countryOfOrder,
                requestType: requestType as RequestType,
                vesselId: vessel.id,
            },
            include: {
                vessel: {
                    select: {
                        name: true,
                        id: true,
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: request,
            message: 'Request created successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating request:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create request',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// PUT /api/requests - обновить request
export async function PUT(req: NextRequest) {
    try {
        const {
            tsiConfirm,
            identifier,
            poStatus,
            poNumber,
            paymentStatus,
            description,
            wayBillType,
            wayBillNumber,
            storeLocation,
            status,
            offerNumber,
            companyOfOrder,
            countryOfOrder,
            requestType,
            vesselId,
            userId,
            id,
        } = await req.json();

        // Check required fields
        if (!vesselId) {
            return NextResponse.json({
                success: false,
                message: 'Required fields: vesselId'
            }, { status: 400 });
        }

        // Check if vessel exists
        const vessel = await prismaClient.vessel.findFirst({
            where: {
                name: vesselId,
                users: {
                    some: {
                        userId: userId,
                        accessStatus: AccessStatus.ACTIVE
                    }
                }
            }
        });

        if (!vessel) {
            return NextResponse.json({
                success: false,
                message: 'Vessel not found'
            }, { status: 404 });
        }

        // Check if request with this identifier already exists in this vessel
        const existingRequest = await prismaClient.request.findFirst({
            where: {
                id: id,
                vesselId: vessel.id
            }
        });

        if (!existingRequest) {
            return NextResponse.json({
                success: false,
                message: 'Request not found'
            }, { status: 409 });
        }

        // Update request
        const request = await prismaClient.request.update({
            where: {
                id: id,
                vesselId: vessel.id
            },
            data: {
                id: id,
                tsiConfirm: (tsiConfirm as TSIConfirm) || TSIConfirm.NOT_CONFIRMED,
                identifier,
                poStatus: (poStatus as PoStatus) || PoStatus.WITHOUT_PO,
                poNumber,
                paymentStatus: (paymentStatus as PaymentStatus) || PaymentStatus.CREDIT_NOT_PAID,
                description,
                wayBillType: (wayBillType as WayBillType) || WayBillType.NO_WAYBILL,
                wayBillNumber: wayBillNumber?.trim() || null,
                storeLocation,
                status: (status as RequestStatus) || RequestStatus.ON_HOLD,
                offerNumber,
                companyOfOrder,
                countryOfOrder,
                requestType: (requestType as RequestType) || RequestType.ENGINE,
                vesselId: vessel.id,
                updatedAt: new Date(),
            },
            include: {
                vessel: {
                    select: {
                        name: true,
                        id: true,
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: request,
            message: 'Request updated successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Error updating request:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update request',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
