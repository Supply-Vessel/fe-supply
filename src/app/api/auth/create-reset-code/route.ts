import { NextRequest, NextResponse } from 'next/server';
import sendResetConfirmationCode from '@/src/lib/server/services/email/reset.service';
import generateCode from '@/src/lib/server/codeGenerator';
import { prismaClient } from '@/src/lib/server/prisma';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        const user = await prismaClient.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'No user find with existing email!',
            }, { status: 200 });
        }

        // Generate Verification Code
        const code = generateCode();
        await prismaClient.verificationCode.create({
            data: {
                email,
                code,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        await sendResetConfirmationCode(email, code);

        return NextResponse.json({
            success: true,
            message: 'Reset confirmation code was created!',
        }, { status: 201 });
    } catch (error) {
        console.error('Error to create confirmation code:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create confirmation code',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

