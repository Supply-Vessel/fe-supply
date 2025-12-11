import { NextRequest, NextResponse } from 'next/server';
import { Role, OrgRole, MemberStatus } from '@prisma/client';
import { prismaClient } from '@/src/lib/server/prisma';

// POST /api/vessel - создать vessel
export async function POST(req: NextRequest) {
    const { userId, organizationId, name, ...vesselDataToSend } = await req.json();

    // Проверяем обязательные поля
    if (!organizationId) {
        return NextResponse.json({
            success: false,
            message: 'Organization ID is required to create a vessel',
        }, { status: 400 });
    }

    if (!userId) {
        return NextResponse.json({
            success: false,
            message: 'User ID is required',
        }, { status: 400 });
    }

    if (!name) {
        return NextResponse.json({
            success: false,
            message: 'Vessel name is required',
        }, { status: 400 });
    }

    try {
        // Проверяем, что пользователь имеет право создавать корабли в этой организации
        const membership = await prismaClient.organizationMember.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId,
                },
            },
            include: {
                organization: true,
            },
        });

        if (!membership) {
            return NextResponse.json({
                success: false,
                message: 'You are not a member of this organization',
            }, { status: 403 });
        }

        // Проверяем роль - создавать могут только ADMIN или MANAGER
        const canCreate = membership.role === OrgRole.ADMIN || 
                         membership.role === OrgRole.MANAGER ||
                         membership.organization.ownerId === userId;

        if (!canCreate) {
            return NextResponse.json({
                success: false,
                message: 'You do not have permission to create vessels in this organization',
            }, { status: 403 });
        }

        // Проверяем лимит кораблей (если есть активная подписка)
        const subscription = await prismaClient.subscription.findFirst({
            where: {
                organizationId,
                status: 'ACTIVE',
            },
        });

        if (subscription?.maxVessels) {
            const currentVesselsCount = await prismaClient.vessel.count({
                where: { organizationId },
            });

            if (currentVesselsCount >= subscription.maxVessels) {
                return NextResponse.json({
                    success: false,
                    message: `Vessel limit reached (${subscription.maxVessels}). Please upgrade your plan.`,
                }, { status: 403 });
            }
        }

        // Проверяем, существует ли уже корабль с таким именем в организации
        const existingVessel = await prismaClient.vessel.findFirst({
            where: {
                name,
                organizationId,
            },
        });

        if (existingVessel) {
            return NextResponse.json({
                success: false,
                message: 'A vessel with this name already exists in your organization',
            }, { status: 400 });
        }

        // Создаём корабль
        const vessel = await prismaClient.vessel.create({
            data: { 
                name, 
                organizationId,
                ...vesselDataToSend,
            },
        });

        // Добавляем создателя как пользователя корабля
        await prismaClient.userVessel.create({
            data: {
                userId,
                vesselId: vessel.id,
                role: vesselDataToSend.position || Role.SUPPLIER,
            },
        });

        return NextResponse.json({
            success: true,
            data: vessel,
            message: 'Vessel created successfully!',
        }, { status: 201 });

    } catch (error) {
        console.error('Error create vessel:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create vessel',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

// GET /api/vessel - получить организации пользователя для выбора
export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({
            success: false,
            message: 'User ID is required',
        }, { status: 400 });
    }

    try {
        // Получаем организации, где пользователь может создавать корабли
        const memberships = await prismaClient.organizationMember.findMany({
            where: {
                userId,
                status: MemberStatus.ACTIVE,
                role: {
                    in: [OrgRole.ADMIN, OrgRole.MANAGER],
                },
            },
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true,
                        ownerId: true,
                    },
                },
            },
        });

        // Также добавляем организации, где пользователь является владельцем
        const ownedOrganizations = await prismaClient.organization.findMany({
            where: {
                ownerId: userId,
            },
            select: {
                id: true,
                name: true,
                ownerId: true,
            },
        });

        // Объединяем и убираем дубликаты
        const allOrganizations = [...memberships.map(m => m.organization), ...ownedOrganizations];
        const uniqueOrganizations = allOrganizations.filter((org, index, self) =>
            index === self.findIndex((o) => o.id === org.id)
        );

        return NextResponse.json({
            success: true,
            data: uniqueOrganizations,
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching organizations:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch organizations',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
