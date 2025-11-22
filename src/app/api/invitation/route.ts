import { NextRequest, NextResponse } from 'next/server';
import sendInvitationCode from '@/src/lib/server/services/email/invitation.service';
import generateCode from '@/src/lib/server/codeGenerator';
import { prismaClient } from '@/src/lib/server/prisma';

export async function POST(req: NextRequest) {
    try {
        const { email,vesselId, role, invitedBy } = await req.json();
        const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;
        const code = generateCode();

        const vessel = await prismaClient.vessel.findFirst({
            where: {
                name:vesselId
            }
        });

        if (!vessel) {
            return NextResponse.json({
                success: false,
                error: 'Failed to create Invitation for vessel',
            }, { status: 403 });
        }

        const invitation = await prismaClient.invitation.create({
            data: {
                expiresAt: new Date(Date.now() + TEN_DAYS_MS),
                invitedBy: invitedBy,
                vesselId: vessel.id,
                email: email,
                code: code,
                role: role,
                token: code,
            }
        });

        if (!invitation) {
            return NextResponse.json({
                success: false,
                error: 'Failed to create Invitation for vessel',
            }, { status: 403 });
        }

        await sendInvitationCode(email, code,vesselId, role);
        
        return NextResponse.json({ 
            success: true, 
            message: 'Invitation created successfuly' 
        }, { status: 201 });

    } catch (error) {
        console.error('Error create Invitation for vessel:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create Invitation for vessel',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

