import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return NextResponse.json({
            success: false,
            error: 'No token is defined',
        }, { status: 401 });
    }

    const secret = process.env.NEXT_PUBLIC_KEY;
    if (!secret || typeof secret !== 'string' || secret.trim() === '') {
        return NextResponse.json({
            success: false,
            error: 'Server configuration error: PUBLIC_KEY missing',
        }, { status: 500 });
    }

    try {
        const decoded = jwt.verify(token, secret, { algorithms: ['RS256'] });

        if (typeof decoded === 'object' && decoded !== null) {
            return NextResponse.json({
                success: true,
                user: {
                    userId: (decoded as any).userId,
                    email: (decoded as any).email,
                    confirmedEmail: (decoded as any).confirmedEmail,
                    createdAt: (decoded as any).createdAt,
                    firstName: (decoded as any).firstName,
                    lastName: (decoded as any).lastName,
                    institution: (decoded as any).institution,
                    contactPhone: (decoded as any).contactPhone,
                    address: (decoded as any).address,
                },
            }, { status: 200 });
        }
    } catch (err) {
        return NextResponse.json({ 
            success: false,
            error: 'Token is invalid' 
        }, { status: 401 });
    }

    return NextResponse.json({ 
        success: false,
        error: 'Token validation failed' 
    }, { status: 401 });
}

