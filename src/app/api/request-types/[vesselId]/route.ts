import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/src/lib/server/prisma';

type RouteParams = {
    params: {
        vesselId: string;
    };
};

// GET /api/request-types/:vesselId - получить типы запросов для vessel
export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { vesselId } = await params;

        // Find vessel by name
        const vessel = await prismaClient.vessel.findFirst({
            where: { name: vesselId }
        });

        if (!vessel) {
            return NextResponse.json({
                success: false,
                message: 'Vessel not found'
            }, { status: 404 });
        }

        const requestTypes = await prismaClient.requestTypeModel.findMany({
            where: {
                vesselId: vessel.id
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        
        return NextResponse.json({
            success: true,
            data: requestTypes,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching request types:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch request types',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST /api/request-types/:vesselId - создать новый тип запроса
export async function POST(req: NextRequest, { params }: RouteParams) {
    try {
        const { vesselId } = await params;
        const body = await req.json();
        const { name, displayName, description, color } = body;

        if (!name || !displayName) {
            return NextResponse.json({
                success: false,
                message: 'Name and displayName are required'
            }, { status: 400 });
        }

        // Find vessel by name
        const vessel = await prismaClient.vessel.findFirst({
            where: { name: vesselId }
        });

        if (!vessel) {
            return NextResponse.json({
                success: false,
                message: 'Vessel not found'
            }, { status: 404 });
        }

        // Check if type with this name already exists for this vessel
        const existingType = await prismaClient.requestTypeModel.findFirst({
            where: {
                name: name.toUpperCase(),
                vesselId: vessel.id
            }
        });

        if (existingType) {
            return NextResponse.json({
                success: false,
                message: 'Request type with this name already exists'
            }, { status: 400 });
        }

        const requestType = await prismaClient.requestTypeModel.create({
            data: {
                name: name.toUpperCase(),
                displayName,
                description,
                color,
                vesselId: vessel.id
            }
        });
        
        return NextResponse.json({
            success: true,
            data: requestType,
            message: 'Request type created successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating request type:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create request type',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
