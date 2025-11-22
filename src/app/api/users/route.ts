import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import sendVarificationCode from '@/src/lib/server/services/email/verification.service';
import generateCode from '@/src/lib/server/codeGenerator';
import { prismaClient } from '@/src/lib/server/prisma';

// GET /api/users - получить всех пользователей
export async function GET() {
    try {
        const users = await prismaClient.user.findMany();
        return NextResponse.json({ success: true, data: users }, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch users',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

// POST /api/users - создать пользователя
export async function POST(req: NextRequest) {
    try {
        const { password, ...userData } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prismaClient.user.create({
            data: {
                ...userData,
                password: hashedPassword,
            },
        });
        const {
            confirmedEmail,
            contactPhone,
            institution,
            createdAt,
            firstName,
            lastName,
            address,
            email,
            id,
        } = user;
        const successUser = {
            confirmedEmail,
            contactPhone,
            institution,
            createdAt,
            firstName,
            lastName,
            address,
            email,
            id,
        };

        // Generate Verification Code
        const code = generateCode();
        await prismaClient.verificationCode.create({
            data: {
                email: user.email,
                code,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        await sendVarificationCode(user.email, code);

        return NextResponse.json({ success: true, data: successUser }, { status: 201 });
    } catch (error) {
        console.error('Error create user:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create user',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

