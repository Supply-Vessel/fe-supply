import { NextRequest, NextResponse } from 'next/server';
import { InvitationStatus } from '@prisma/client';
import { prismaClient } from '@/src/lib/server/prisma';

export async function POST(req: NextRequest) {
    try {
        const { code, userId } = await req.json();

        if (!code) {
            return NextResponse.json({
                success: false,
                message: 'Invalid or unavailable code',
            }, { status: 200 });
        }

        const user = await prismaClient.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'No user find with existing Id!',
            }, { status: 200 });
        }

        const invitation = await prismaClient.invitation.findFirst({
            where: {
                email: user.email,
                code: code,
                status: InvitationStatus.PENDING,
                expiresAt: {
                    gt: new Date(),
                }
            }
        });

        if (!invitation) {
            return NextResponse.json({
                success: false,
                message: 'Invalid code or invitation not exist',
            }, { status: 400 });
        }

        await prismaClient.userVessel.create({
            data: {
                userId,
                vesselId: invitation.vesselId,
                role: invitation.role,
                invitedBy: invitation.invitedBy
            },
        });

        await prismaClient.invitation.update({
            where: {
                id: invitation.id
            },
            data: {
                status: InvitationStatus.ACCEPTED
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Congratulations, you have been successfully added to the vessel.',
        }, { status: 201 });

    } catch (error) {
        console.error('Error Verify Invitation:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to Verify Invitation',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

