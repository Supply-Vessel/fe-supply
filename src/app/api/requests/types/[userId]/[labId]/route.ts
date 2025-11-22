import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';
import { AccessStatus } from '@prisma/client';

type RouteParams = {
    params: {
        userId: string;
       vesselId: string;
    };
};

// GET /api/requests/types/:userId/:vesselId - получить типы requests
export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const {vesselId, userId } = params;

        // Check if user has access to this laboratory (vesselId is laboratory name)
        const userVessel = await prismaClient.userVessel.findFirst({
            where: {
                userId: userId,
                accessStatus: AccessStatus.ACTIVE,
                vessel: {
                    name:vesselId //vesselId это имя лаборатории
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

        // Get animal types for this laboratory using the laboratory ID
        const [requestTypes, totalCount] = await Promise.all([
            prismaClient.request.findMany({
                where: {
                    vesselId: userVessel.vessel.id
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }),
            prismaClient.request.count({
                where: {
                    vesselId: userVessel.vessel.id
                }
            })
        ]);
        
        return NextResponse.json({
            success: true,
            data: requestTypes,
            totalCount: totalCount
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching request types:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch request types',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

