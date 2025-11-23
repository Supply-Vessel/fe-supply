import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';
import { AccessStatus } from '@prisma/client';

type RouteParams = {
    params: {
        userId: string;
    };
};

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { userId } = await params;

        const userVessels = await prismaClient.userVessel.findMany({
            where: {
                userId,
                accessStatus: AccessStatus.ACTIVE,
            },
            include: {
                vessel: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

            const vessels = userVessels.map((userVessel) => ({
            ...userVessel.vessel,
            userRole: userVessel.role,
            joinedAt: userVessel.joinedAt,
            accessStatus: userVessel.accessStatus,
            accessStartDate: userVessel.accessStartDate,
            accessEndDate: userVessel.accessEndDate,
        }));

        return NextResponse.json({
            success: true,
            data: vessels,
        }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch vessels:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch vessels',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}