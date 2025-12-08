import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';
import { AccessStatus, MemberStatus } from '@prisma/client';

type RouteParams = {
    params: {
        userId: string;
    };
};

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { userId } = await params;

        // Получаем информацию о пользователе
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                userType: true,
            },
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found',
            }, { status: 404 });
        }

        // Получаем организации пользователя
        const organizationMemberships = await prismaClient.organizationMember.findMany({
            where: {
                userId,
                status: MemberStatus.ACTIVE,
            },
            include: {
                organization: {
                    include: {
                        owner: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                        _count: {
                            select: {
                                members: true,
                                vessels: true,
                            },
                        },
                        subscriptions: {
                            where: {
                                status: 'ACTIVE',
                            },
                            take: 1,
                            include: {
                                plan: true,
                            },
                        },
                    },
                },
            },
        });

        // Формируем данные организаций
        const organizations = organizationMemberships.map((membership) => ({
            id: membership.organization.id,
            name: membership.organization.name,
            description: membership.organization.description,
            type: membership.organization.type,
            isOwner: membership.organization.ownerId === userId,
            memberRole: membership.role,
            memberStatus: membership.status,
            joinedAt: membership.joinedAt,
            owner: {
                id: membership.organization.owner.id,
                firstName: membership.organization.owner.firstName,
                lastName: membership.organization.owner.lastName,
                email: membership.organization.owner.email,
            },
            stats: {
                membersCount: membership.organization._count.members,
                vesselsCount: membership.organization._count.vessels,
            },
            subscription: membership.organization.subscriptions[0] ? {
                id: membership.organization.subscriptions[0].id,
                planName: membership.organization.subscriptions[0].plan.name,
                status: membership.organization.subscriptions[0].status,
                maxUsers: membership.organization.subscriptions[0].maxUsers,
                maxVessels: membership.organization.subscriptions[0].maxVessels,
                endDate: membership.organization.subscriptions[0].endDate,
            } : null,
        }));

        // Получаем корабли пользователя
        const userVessels = await prismaClient.userVessel.findMany({
            where: {
                userId,
                accessStatus: AccessStatus.ACTIVE,
            },
            include: {
                vessel: {
                    include: {
                        organization: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
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
            organizationName: userVessel.vessel.organization?.name,
        }));

        return NextResponse.json({
            success: true,
            data: {
                userType: user.userType,
                organizations,
                vessels,
            },
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
