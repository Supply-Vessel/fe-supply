import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prismaClient } from '@/src/lib/server/prisma';

export async function POST(req: NextRequest) {
    try {
        const { code, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);

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
                password: hashedPassword,
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
            message: 'New password successfully reseted.',
        }, { status: 200 });
    } catch (error) {
        console.error('Error Reset Password:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to Reset Password',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

