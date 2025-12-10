import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';
import { AccessStatus } from '@prisma/client';

type RouteParams = {
    params: {
        requestType: string;
        vesselId: string;
        userId: string;
        rows: string;
        page: string;
    };
};

// GET /api/requests/:userId/:vesselId/:rows/:page/:requestType - получить requests с фильтром по типу
export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { userId,vesselId, rows, page, requestType } = await params;
        console.log(userId, vesselId, rows, page, requestType);
        const rowsNumber = parseInt(rows);
        const pageNumber = parseInt(page);
        
        // First check if user has access to this laboratory
        const userVessel = await prismaClient.userVessel.findFirst({
            where: {
                userId: userId,
                accessStatus: AccessStatus.ACTIVE,
                vessel: {
                    name:vesselId
                }
            },
            include: {
                vessel: true
            }
        });

        if (!userVessel) {
            return NextResponse.json({
                success: false,
                message: 'Access denied to this vessel'
            }, { status: 403 });
        }

        // Find request type by name for this vessel
        const requestTypeRecord = await prismaClient.requestTypeModel.findFirst({
            where: {
                name: requestType,
                vesselId: userVessel.vessel.id
            }
        });

        // If request type not found, return empty result
        if (!requestTypeRecord) {
            return NextResponse.json({ 
                success: true, 
                data: [],
                pagination: {
                    currentPage: pageNumber,
                    pageSize: rowsNumber,
                    totalCount: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false
                }
            }, { status: 200 });
        }

        const whereCondition = {
            vesselId: userVessel.vessel.id,
            requestTypeId: requestTypeRecord.id
        };
        
        const requests = await prismaClient.request.findMany({
            where: whereCondition,
            skip: (pageNumber - 1) * rowsNumber,
            take: rowsNumber,
            include: {
                vessel: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                requestType: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const totalCount = await prismaClient.request.count({
            where: whereCondition
        });
        
        const totalPages = Math.ceil(totalCount / rowsNumber);
        const hasNextPage = pageNumber < totalPages;
        const hasPreviousPage = pageNumber > 1;
        
        return NextResponse.json({ 
            success: true, 
            data: requests,
            pagination: {
                currentPage: pageNumber,
                pageSize: rowsNumber,
                totalCount: totalCount,
                totalPages: totalPages,
                hasNextPage: hasNextPage,
                hasPreviousPage: hasPreviousPage
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching requests:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch requests',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

