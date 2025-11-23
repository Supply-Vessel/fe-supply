
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Public pages that don't require authentication
  const publicPaths = ['/signin', '/signup', '/forgot-password', '/'];
  
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  const token = request.cookies.get('auth-token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  try {
    const secret = process.env.NEXT_PUBLIC_KEY?.replace(/\\n/g, '\n');
    
    if (!secret) {
      console.error('NEXT_PUBLIC_KEY is not configured');
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    
    const decoded = jwt.verify(token, secret, { algorithms: ['RS256'] });
    
    if (typeof decoded === 'object' && decoded !== null) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', (decoded as any).userId || '');
      requestHeaders.set('x-user-email', (decoded as any).email || '');
      requestHeaders.set('x-user-confirmed-email', (decoded as any).confirmedEmail || '');
      requestHeaders.set('x-user-created-at', (decoded as any).createdAt || '');
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
    
    throw new Error('Invalid token structure');
    
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Apply middleware to all paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};