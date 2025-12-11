import sendInvitationCode from '@/src/lib/server/services/email/invitation.service';
import generateCode from '@/src/lib/server/codeGenerator';
import { NextRequest, NextResponse } from 'next/server';
import { OrgRole, MemberStatus } from '@prisma/client';
import { prismaClient } from '@/src/lib/server/prisma';

export async function POST(req: NextRequest) {
    try {
        const { email, vesselId, role, invitedBy, organizationId, orgRole } = await req.json();
        const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;
        const code = generateCode();

        // Получаем organizationId из vessel если не передан напрямую
        let finalOrganizationId = organizationId;
        let vessel = null;

        if (vesselId) {
            // Если vesselId - это имя, найдём vessel по имени
            vessel = await prismaClient.vessel.findFirst({
                where: {
                    OR: [
                        { id: vesselId },
                        { name: vesselId }
                    ]
                }
            });

            if (!vessel) {
                return NextResponse.json({
                    success: false,
                    message: 'Vessel not found',
                }, { status: 404 });
            }

            // Если organizationId не передан, берём из vessel
            if (!finalOrganizationId) {
                finalOrganizationId = vessel.organizationId;
            }
        }

        // Проверяем, что organizationId указан
        if (!finalOrganizationId) {
            return NextResponse.json({
                success: false,
                message: 'Organization ID is required for invitation',
            }, { status: 400 });
        }

        // Проверяем, что организация существует
        const organization = await prismaClient.organization.findUnique({
            where: { id: finalOrganizationId },
        });

        if (!organization) {
            return NextResponse.json({
                success: false,
                message: 'Organization not found',
            }, { status: 404 });
        }

        // Проверяем права приглашающего
        const inviterMembership = await prismaClient.organizationMember.findUnique({
            where: {
                userId_organizationId: {
                    userId: invitedBy,
                    organizationId: finalOrganizationId,
                },
            },
        });

        const isOwner = organization.ownerId === invitedBy;
        const canInvite = isOwner || 
                         inviterMembership?.role === OrgRole.ADMIN || 
                         inviterMembership?.role === OrgRole.MANAGER;

        if (!canInvite) {
            return NextResponse.json({
                success: false,
                message: 'You do not have permission to invite members to this organization',
            }, { status: 403 });
        }

        // Проверяем лимит пользователей по подписке
        const subscription = await prismaClient.subscription.findFirst({
            where: {
                organizationId: finalOrganizationId,
                status: 'ACTIVE',
            },
        });

        if (subscription?.maxUsers) {
            const currentMembersCount = await prismaClient.organizationMember.count({
                where: { 
                    organizationId: finalOrganizationId,
                    status: { in: [MemberStatus.ACTIVE, MemberStatus.INVITED] },
                },
            });

            if (currentMembersCount >= subscription.maxUsers) {
                return NextResponse.json({
                    success: false,
                    message: `User limit reached (${subscription.maxUsers}). Please upgrade your plan.`,
                }, { status: 403 });
            }
        }

        // Проверяем, не существует ли уже приглашение для этого email в эту организацию
        const existingInvitation = await prismaClient.invitation.findFirst({
            where: {
                email,
                organizationId: finalOrganizationId,
                status: 'PENDING',
            },
        });

        if (existingInvitation) {
            console.log('Duplicate invitation:', { email, organizationId: finalOrganizationId });
            return NextResponse.json({
                success: false,
                message: `An invitation has already been sent to ${email} for this organization`,
            }, { status: 400 });
        }

        // Проверяем, не является ли пользователь уже членом организации
        const existingUser = await prismaClient.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            const existingMembership = await prismaClient.organizationMember.findUnique({
                where: {
                    userId_organizationId: {
                        userId: existingUser.id,
                        organizationId: finalOrganizationId,
                    },
                },
            });

            if (existingMembership) {
                // Если приглашаем на конкретный vessel - добавляем напрямую
                if (vessel) {
                    // Проверяем, не добавлен ли уже на этот vessel
                    const existingUserVessel = await prismaClient.userVessel.findUnique({
                        where: {
                            userId_vesselId: {
                                userId: existingUser.id,
                                vesselId: vessel.id,
                            },
                        },
                    });

                    if (existingUserVessel) {
                        return NextResponse.json({
                            success: false,
                            message: `${email} is already a member of vessel "${vessel.name}"`,
                        }, { status: 400 });
                    }

                    // Добавляем пользователя на vessel напрямую (без invitation)
                    await prismaClient.userVessel.create({
                        data: {
                            userId: existingUser.id,
                            vesselId: vessel.id,
                            role: role || 'SUPPLIER',
                            invitedBy,
                            accessStatus: 'ACTIVE', // Явно устанавливаем доступ
                        },
                    });

                    return NextResponse.json({
                        success: true,
                        message: `${email} has been added to vessel "${vessel.name}"`,
                        data: {
                            userId: existingUser.id,
                            vesselId: vessel.id,
                            vesselName: vessel.name,
                            addedDirectly: true,
                        }
                    }, { status: 201 });
                }

                // Если просто приглашаем в организацию - ошибка
                console.log('User already member:', { email, userId: existingUser.id, organizationId: finalOrganizationId });
                return NextResponse.json({
                    success: false,
                    message: `${email} is already a member of this organization`,
                }, { status: 400 });
            }
        }

        // Создаём приглашение
        const invitation = await prismaClient.invitation.create({
            data: {
                email,
                code,
                token: code,
                organizationId: finalOrganizationId,
                vesselId: vessel?.id || null, // Опционально - конкретный vessel
                invitedBy,
                role: role || 'SUPPLIER',
                orgRole: orgRole || OrgRole.MEMBER,
                expiresAt: new Date(Date.now() + TEN_DAYS_MS),
            }
        });

        if (!invitation) {
            return NextResponse.json({
                success: false,
                message: 'Failed to create invitation',
            }, { status: 500 });
        }

        // Отправляем email с приглашением
        const vesselName = vessel?.name || organization.name;
        await sendInvitationCode(email, code, vesselName, role);
        
        return NextResponse.json({ 
            success: true, 
            message: 'Invitation sent successfully',
            data: {
                id: invitation.id,
                email: invitation.email,
                organizationName: organization.name,
                vesselName: vessel?.name,
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating invitation:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create invitation',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

// GET - получить приглашения организации
export async function GET(req: NextRequest) {
    const organizationId = req.nextUrl.searchParams.get('organizationId');
    const userId = req.nextUrl.searchParams.get('userId');

    if (!organizationId || !userId) {
        return NextResponse.json({
            success: false,
            message: 'Organization ID and User ID are required',
        }, { status: 400 });
    }

    try {
        // Проверяем права доступа
        const membership = await prismaClient.organizationMember.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId,
                },
            },
        });

        const organization = await prismaClient.organization.findUnique({
            where: { id: organizationId },
        });

        const isOwner = organization?.ownerId === userId;
        const canView = isOwner || 
                       membership?.role === OrgRole.ADMIN || 
                       membership?.role === OrgRole.MANAGER;

        if (!canView) {
            return NextResponse.json({
                success: false,
                message: 'You do not have permission to view invitations',
            }, { status: 403 });
        }

        const invitations = await prismaClient.invitation.findMany({
            where: { organizationId },
            include: {
                vessel: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            success: true,
            data: invitations,
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching invitations:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch invitations',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
