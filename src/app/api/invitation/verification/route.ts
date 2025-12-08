import { InvitationStatus, MemberStatus, OrgRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';

export async function POST(req: NextRequest) {
    try {
        const { code, userId } = await req.json();

        if (!code) {
            return NextResponse.json({
                success: false,
                message: 'Invalid or unavailable code',
            }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: 'User ID is required',
            }, { status: 400 });
        }

        // Находим пользователя
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found',
            }, { status: 404 });
        }

        // Находим приглашение
        const invitation = await prismaClient.invitation.findFirst({
            where: {
                email: user.email,
                code: code,
                status: InvitationStatus.PENDING,
                expiresAt: {
                    gt: new Date(),
                }
            },
            include: {
                organization: true,
                vessel: true,
            }
        });

        if (!invitation) {
            return NextResponse.json({
                success: false,
                message: 'Invalid code or invitation has expired',
            }, { status: 400 });
        }

        // Выполняем все операции в транзакции
        const result = await prismaClient.$transaction(async (tx) => {
            // 1. Добавляем пользователя в OrganizationMember
            const existingMembership = await tx.organizationMember.findUnique({
                where: {
                    userId_organizationId: {
                        userId,
                        organizationId: invitation.organizationId,
                    },
                },
            });

            let organizationMember;
            if (!existingMembership) {
                organizationMember = await tx.organizationMember.create({
                    data: {
                        userId,
                        organizationId: invitation.organizationId,
                        role: invitation.orgRole || OrgRole.MEMBER,
                        status: MemberStatus.ACTIVE,
                        invitedBy: invitation.invitedBy,
                    },
                });
            } else {
                // Обновляем статус если был INVITED или SUSPENDED
                organizationMember = await tx.organizationMember.update({
                    where: { id: existingMembership.id },
                    data: {
                        status: MemberStatus.ACTIVE,
                    },
                });
            }

            // 2. Если указан vesselId, добавляем в UserVessel
            let userVessel = null;
            if (invitation.vesselId) {
                const existingUserVessel = await tx.userVessel.findUnique({
                    where: {
                        userId_vesselId: {
                            userId,
                            vesselId: invitation.vesselId,
                        },
                    },
                });

                if (!existingUserVessel) {
                    userVessel = await tx.userVessel.create({
                        data: {
                            userId,
                            vesselId: invitation.vesselId,
                            role: invitation.role,
                            invitedBy: invitation.invitedBy,
                            accessStatus: 'ACTIVE', // Явно устанавливаем доступ
                        },
                    });
                }
            }

            // 3. Обновляем статус приглашения
            await tx.invitation.update({
                where: { id: invitation.id },
                data: {
                    status: InvitationStatus.ACCEPTED,
                    usedAt: new Date(),
                },
            });

            return {
                organizationMember,
                userVessel,
                organization: invitation.organization,
                vessel: invitation.vessel,
            };
        });

        return NextResponse.json({
            success: true,
            message: `Welcome to ${result.organization.name}!${result.vessel ? ` You have been added to vessel "${result.vessel.name}".` : ''}`,
            data: {
                organizationId: result.organization.id,
                organizationName: result.organization.name,
                vesselId: result.vessel?.id,
                vesselName: result.vessel?.name,
            },
        }, { status: 200 });

    } catch (error) {
        console.error('Error verifying invitation:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to verify invitation',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
