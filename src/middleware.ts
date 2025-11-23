
import { NextRequest, NextResponse } from 'next/server';

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
    // Validate token via internal API route (use absolute URL for Vercel)
    const protocol = request.nextUrl.protocol;
    const host = request.headers.get('host');
    const apiUrl = `${protocol}//${host}/api/auth/validate`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Token validation failed');
    }
    
    const data = await response.json();
    
    // Add user information to headers for use in pages
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', data.user.userId);
    requestHeaders.set('x-user-email', data.user.email);
    requestHeaders.set('x-user-confirmed-email', data.user.confirmedEmail);
    requestHeaders.set('x-user-created-at', data.user.createdAt);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
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