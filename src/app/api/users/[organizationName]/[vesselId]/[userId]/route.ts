import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';

type RouteParams = {
    params: {
        organizationName: string;
        vesselId: string; //  (vesselName)
        userId: string;
    };
};

// GET /api/users/:id - получить пользователя по ID с проверкой принадлежности к судну
export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { organizationName, vesselId: vesselName, userId } = await params;

        // Проверяем, что судно принадлежит указанной организации (ищем по имени судна)
        const vessel = await prismaClient.vessel.findFirst({
            where: {
                name: vesselName,
                organization: {
                    name: organizationName,
                },
            },
            include: {
                organization: true, // Включаем организацию для получения organizationId
            },
        });

        if (!vessel) {
            return NextResponse.json({
                success: false,
                message: 'Vessel not found in this organization',
            }, { status: 404 });
        }

        // Проверяем, что пользователь принадлежит к этому судну (используем vessel.id)
        const userVessel = await prismaClient.userVessel.findUnique({
            where: {
                userId_vesselId: {
                    userId,
                    vesselId: vessel.id,
                },
            },
            include: {
                user: true, // Включаем данные пользователя с паролем
            },
        });

        if (!userVessel) {
            return NextResponse.json({
                success: false,
                message: 'User is not a member of this vessel',
            }, { status: 403 });
        }

        // Получаем роль пользователя в организации
        const organizationMember = await prismaClient.organizationMember.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId: vessel.organizationId,
                },
            },
        });

        // Возвращаем данные пользователя с паролем и информацией о ролях
        return NextResponse.json({
            success: true,
            data: {
                ...userVessel.user,
                vesselRole: userVessel.role,
                accessStatus: userVessel.accessStatus,
                orgRole: organizationMember?.role ?? null,
                orgMemberStatus: organizationMember?.status ?? null,
            },
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch user',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

// PUT /api/users/:id - обновить пользователя
export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const {userId, organizationName, vesselId} = await params;
        const userData = await req.json();
        const user = await prismaClient.user.update({
            where: {
                id: userId,
            },
            data: userData,
        });

        const { password, ...successUser } = user;
        return NextResponse.json({ success: true, data: successUser }, { status: 200 });
    } catch (error) {
        console.error('Error update user:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update user',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

// DELETE /api/users/:id - удалить пользователя
export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const {userId, organizationName, vesselId} = await params;
        const user = await prismaClient.user.delete({
            where: {
                id: userId,
            },
        });

        const { password, ...successUser } = user;
        return NextResponse.json({ success: true, data: successUser }, { status: 200 });
    } catch (error) {
        console.error('Error delete user:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to delete user',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

