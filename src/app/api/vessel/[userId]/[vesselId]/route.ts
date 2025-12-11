import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';
import { AccessStatus, MemberStatus } from '@prisma/client';

type RouteParams = {
    params: {
        userId: string;
       vesselId: string;
    };
};

// GET /api/vessel/:userId/:vesselId - получить всех пользователей vessel
export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { userId, vesselId } = await params;

        // Проверяем, что пользователь имеет доступ к лаборатории
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

        // Получаем всех пользователей лаборатории с включением данных пользователей
        const vesselMembers = await prismaClient.userVessel.findMany({
            where: {
                vesselId: userVessel.vessel.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        userType: true,
                        firstName: true,
                        lastName: true,
                        address: true,
                        contactPhone: true,
                        institution: true,
                        confirmedEmail: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },
            },
            orderBy: {
                joinedAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            data: vesselMembers,
            message: 'Vessel members retrieved successfully'
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error getting vessel members:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        }, { status: 500 });
    }
}

