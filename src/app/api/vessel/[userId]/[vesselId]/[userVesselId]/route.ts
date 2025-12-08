import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';
import { AccessStatus, Role } from '@prisma/client';

type RouteParams = {
    params: {
        userId: string;
       vesselId: string;
        userVesselId: string;
    };
};

// DELETE /api/vessel/:userId/:vesselId/:userVesselId - удалить участника vessel
export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const { userId: ownerUserId,vesselId, userVesselId } = await params;

        // Проверяем, что пользователь, который пытается удалить, является владельцем лаборатории
        const ownerVessel = await prismaClient.userVessel.findFirst({
            where: {
                userId: ownerUserId,
                accessStatus: AccessStatus.ACTIVE,
                role: Role.SUPPLIER,
                vessel: {
                    name:vesselId
                }
            },
            include: {
                vessel: true
            }
        });

        if (!ownerVessel) {
            return NextResponse.json({
                success: false,
                message: 'Access denied. Only vessel supplier can remove members'
            }, { status: 403 });
        }

        // Проверяем, что участник существует в судне
        const memberToDelete = await prismaClient.userVessel.findFirst({
            where: {
                id: userVesselId,
                vesselId: ownerVessel.vessel.id,
                accessStatus: AccessStatus.ACTIVE
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        if (!memberToDelete) {
            return NextResponse.json({
                success: false,
                message: 'Member not found in this vessel'
            }, { status: 404 });
        }

        // Проверяем, что поставщик не пытается удалить сам себя
        if (ownerUserId === memberToDelete.user.id) {
            return NextResponse.json({
                success: false,
                message: 'Supplier cannot remove themselves from the vessel'
            }, { status: 400 });
        }

        // Удаляем участника из судна
        await prismaClient.userVessel.delete({
            where: {
                id: memberToDelete.id
            }
        });

        const invitationToDelete = await prismaClient.invitation.findFirst({
            where: {
                vesselId: ownerVessel.vessel.id,
                email: memberToDelete.user.email
            }
        });

        if (!invitationToDelete) {
            return NextResponse.json({
                success: false,
                message: 'Member not found in this invitation list of vessel'
            }, { status: 404 });
        }

        await prismaClient.invitation.delete({
            where: {
                id: invitationToDelete.id
            }
        });

        return NextResponse.json({
            success: true,
            message: `Member ${memberToDelete.user.email} has been successfully removed from vessel`,
            data: {
                removedMember: {
                    id: memberToDelete.user.id,
                    email: memberToDelete.user.email,
                    firstName: memberToDelete.user.firstName,
                    lastName: memberToDelete.user.lastName
                }
            }
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error deleting vessel member:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        }, { status: 500 });
    }
}

