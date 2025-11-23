import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';
import { AccessStatus } from '@prisma/client';

type RouteParams = {
    params: {
        userId: string;
       vesselId: string;
        rows: string;
        page: string;
    };
};

// GET /api/requests/:userId/:vesselId/:rows/:page - получить все requests (без фильтра по типу)
export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { userId,vesselId, rows, page } = await params;
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

        const requests = await prismaClient.request.findMany({
            where: {
                vesselId: userVessel.vessel.id,
            },
            skip: (pageNumber - 1) * rowsNumber,
            take: rowsNumber,
            include: {
                vessel: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const totalCount = await prismaClient.request.count({
            where: {
                vesselId: userVessel.vessel.id,
            }
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

