import sendVarificationCode from '@/src/lib/server/services/email/verification.service';
import { UserType, OrgRole, MemberStatus, InvitationStatus } from '@prisma/client';
import generateCode from '@/src/lib/server/codeGenerator';
import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';
import bcrypt from 'bcryptjs';

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
        const body = await req.json();
        const { 
            password, 
            userType, 
            organizationName, 
            invitationCode,
            ...userData 
        } = body;

        // Проверяем, существует ли пользователь с таким email
        const existingUser = await prismaClient.user.findUnique({
            where: { email: userData.email },
        });

        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: 'User with this email already exists',
            }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // ================================================================
        // РЕГИСТРАЦИЯ ВЛАДЕЛЬЦА ОРГАНИЗАЦИИ (ORGANIZATION_OWNER)
        // ================================================================
        if (userType === UserType.ORGANIZATION_OWNER) {
            if (!organizationName) {
                return NextResponse.json({
                    success: false,
                    message: 'Organization name is required for organization owner',
                }, { status: 400 });
            }

            // Создаём пользователя и организацию в транзакции
            const result = await prismaClient.$transaction(async (tx) => {
                // 1. Создаём пользователя
                const user = await tx.user.create({
                    data: {
                        ...userData,
                        password: hashedPassword,
                        userType: UserType.ORGANIZATION_OWNER,
                    },
                });

                // 2. Создаём организацию
                const organization = await tx.organization.create({
                    data: {
                        name: organizationName,
                        ownerId: user.id,
                        description: `Organization created by ${userData.firstName} ${userData.lastName}`,
                    },
                });

                // 3. Добавляем владельца как ADMIN в OrganizationMember
                await tx.organizationMember.create({
                    data: {
                        userId: user.id,
                        organizationId: organization.id,
                        role: OrgRole.ADMIN,
                        status: MemberStatus.ACTIVE,
                    },
                });

                return { user, organization };
            });

            // Generate Verification Code
            const code = generateCode();
            await prismaClient.verificationCode.create({
                data: {
                    email: result.user.email,
                    code,
                    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                },
            });

            await sendVarificationCode(result.user.email, code);

            const successUser = {
                id: result.user.id,
                email: result.user.email,
                firstName: result.user.firstName,
                lastName: result.user.lastName,
                institution: result.user.institution,
                address: result.user.address,
                contactPhone: result.user.contactPhone,
                confirmedEmail: result.user.confirmedEmail,
                userType: result.user.userType,
                createdAt: result.user.createdAt,
                organization: {
                    id: result.organization.id,
                    name: result.organization.name,
                },
            };

            return NextResponse.json({ 
                success: true, 
                data: successUser,
                message: 'Organization owner account created successfully',
            }, { status: 201 });
        }

        // ================================================================
        // РЕГИСТРАЦИЯ ОБЫЧНОГО ПОЛЬЗОВАТЕЛЯ (REGULAR) ПО ПРИГЛАШЕНИЮ
        // ================================================================
        if (userType === UserType.REGULAR) {
            if (!invitationCode) {
                return NextResponse.json({
                    success: false,
                    message: 'Invitation code is required for regular user registration',
                }, { status: 400 });
            }

            // Проверяем код приглашения (должен быть PENDING, не использован)
            const invitation = await prismaClient.invitation.findFirst({
                where: {
                    email: userData.email,
                    code: invitationCode,
                    status: InvitationStatus.PENDING,
                    expiresAt: {
                        gt: new Date(),
                    },
                },
                include: {
                    organization: true,
                },
            });

            if (!invitation) {
                return NextResponse.json({
                    success: false,
                    message: 'Invalid or expired invitation code. Please check your email and code.',
                }, { status: 400 });
            }

            // Создаём пользователя и добавляем в организацию в транзакции
            const result = await prismaClient.$transaction(async (tx) => {
                // 1. Создаём пользователя (email уже подтверждён через invitation code!)
                const user = await tx.user.create({
                    data: {
                        ...userData,
                        password: hashedPassword,
                        userType: UserType.REGULAR,
                        confirmedEmail: true, // Email подтверждён через invitation code
                    },
                });

                // 2. Добавляем в OrganizationMember
                await tx.organizationMember.create({
                    data: {
                        userId: user.id,
                        organizationId: invitation.organizationId,
                        role: invitation.orgRole || OrgRole.MEMBER,
                        status: MemberStatus.ACTIVE,
                        invitedBy: invitation.invitedBy,
                    },
                });

                // 3. Если есть vesselId в приглашении, добавляем в UserVessel
                if (invitation.vesselId) {
                    await tx.userVessel.create({
                        data: {
                            userId: user.id,
                            vesselId: invitation.vesselId,
                            role: invitation.role,
                            invitedBy: invitation.invitedBy,
                            accessStatus: 'ACTIVE', // Явно устанавливаем доступ
                        },
                    });
                }

                // 4. Обновляем статус приглашения
                await tx.invitation.update({
                    where: { id: invitation.id },
                    data: {
                        status: InvitationStatus.ACCEPTED,
                        usedAt: new Date(),
                    },
                });

                return { user, organization: invitation.organization };
            });

            // НЕ отправляем verification code — email уже подтверждён через invitation!

            const successUser = {
                id: result.user.id,
                email: result.user.email,
                firstName: result.user.firstName,
                lastName: result.user.lastName,
                confirmedEmail: result.user.confirmedEmail, // true
                userType: result.user.userType,
                createdAt: result.user.createdAt,
                organization: result.organization ? {
                    id: result.organization.id,
                    name: result.organization.name,
                } : null,
            };

            return NextResponse.json({ 
                success: true, 
                data: successUser,
                message: 'Account created and joined organization successfully',
            }, { status: 201 });
        }

        // ================================================================
        // FALLBACK: Если userType не указан (для обратной совместимости)
        // ================================================================
        const user = await prismaClient.user.create({
            data: {
                ...userData,
                password: hashedPassword,
                userType: UserType.REGULAR,
            },
        });

        const code = generateCode();
        await prismaClient.verificationCode.create({
            data: {
                email: user.email,
                code,
                expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            },
        });

        await sendVarificationCode(user.email, code);

        const successUser = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            institution: user.institution,
            address: user.address,
            contactPhone: user.contactPhone,
            confirmedEmail: user.confirmedEmail,
            userType: user.userType,
            createdAt: user.createdAt,
        };

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
