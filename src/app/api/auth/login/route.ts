import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prismaClient } from '@/src/lib/server/prisma';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        
        const user = await prismaClient.user.findUnique({
            where: { email },
        });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return NextResponse.json({
                success: false,
                error: 'Please check your login details and try again',
            }, { status: 401 });
        }

        const secret = process.env.RSA_PRIVATE_KEY;
        if (!secret || typeof secret !== 'string' || secret.trim() === '') {
            throw new Error('PRIVATE_KEY is not configured or invalid');
        }

        const accessToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                confirmedEmail: user.confirmedEmail,
                createdAt: user.createdAt,
                firstName: user.firstName,
                lastName: user.lastName,
                institution: user.institution,
                contactPhone: user.contactPhone,
                address: user.address,
            },
            secret,
            { algorithm: 'RS256', expiresIn: '1d' },
        );
        
        const refreshToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                confirmedEmail: user.confirmedEmail,
                createdAt: user.createdAt,
                firstName: user.firstName,
                lastName: user.lastName,
                institution: user.institution,
                contactPhone: user.contactPhone,
                address: user.address,
            },
            secret,
            { algorithm: 'RS256', expiresIn: '7d' },
        );

        const vessel = await prismaClient.userVessel.findFirst({
            where: {
                userId: user.id,
            },
        });

        return NextResponse.json({
            message: 'You have successfully logged in.',
            success: true,
            vessel,
            refreshToken,
            accessToken,
            user: {
                firstName: user.firstName,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                lastName: user.lastName,
                institution: user.institution,
                contactPhone: user.contactPhone,
                confirmedEmail: user.confirmedEmail,
                address: user.address,
                email: user.email,
                userId: user.id,
            },
        }, { status: 200 });
    } catch (error) {
        console.error('An error occurred. Please try again later:', error);
        return NextResponse.json({
            success: false,
            error: 'An error occurred. Please try again later',
        }, { status: 500 });
    }
}

