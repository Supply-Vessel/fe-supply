import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';

type RouteParams = {
    params: {
        id: string;
    };
};

// GET /api/users/:id - получить пользователя по ID
export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const userId = params.id;
        const user = await prismaClient.user.findUnique({
            where: {
                id: userId,
            },
        });
        return NextResponse.json({ success: true, data: user }, { status: 200 });
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
        const userId = params.id;
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
        const userId = params.id;
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

