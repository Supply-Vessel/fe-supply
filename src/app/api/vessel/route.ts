import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { prismaClient } from '@/src/lib/server/prisma';

// POST /api/vessel - создать vessel
export async function POST(req: NextRequest) {
    const { userId, name, ...vesselDataToSend } = await req.json();

    try {
        const existingVessel = await prismaClient.vessel.findFirst({
            where: {
                name,
                users: {
                    some: {
                        userId,
                    },
                },
            },
        });

        if (existingVessel) {
            return NextResponse.json({
                success: false,
                message: 'You already have a vessel with this name!',
            }, { status: 200 });
        }
    } catch (error) {
        console.error('Error checking existing vessel:', error);
        return NextResponse.json({
            success: false,
            message: 'You already have a vessel with this name!',
        }, { status: 200 });
    }

    try {
        const vessel = await prismaClient.vessel.create({
            data: { name, ...vesselDataToSend },
        });

        await prismaClient.userVessel.create({
            data: {
                userId,
                vesselId: vessel.id,
                role: Role.SUPPLIER,
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

