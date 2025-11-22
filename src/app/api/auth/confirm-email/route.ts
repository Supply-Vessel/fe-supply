import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';
export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();
        
        const record = await prismaClient.verificationCode.findFirst({
            where: {
                email,
                code,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!record) {
            return NextResponse.json({
                success: false,
                message: 'Invalid code',
            }, { status: 400 });
        }

        const updatedUser = await prismaClient.user.update({
            where: {
                email,
            },
            data: {
                confirmedEmail: true,
            },
        });

        await prismaClient.verificationCode.delete({
            where: {
                id: record.id,
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedUser,
            message: 'Verification code successfully confirmed.',
        }, { status: 200 });
    } catch (error) {
        console.error('Error Verififying Email:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to verify email',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

