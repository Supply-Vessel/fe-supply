// frontend/middleware.js (в корне проекта Next.js)
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Публичные страницы, которые не требуют авторизации
  const publicPaths = ['/signin', '/signup', '/forgot-password', '/'];
  
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Получаем токен из cookies или headers
  const token = request.cookies.get('auth-token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  try {
    // Проверяем токен на бекенде (используем origin текущего запроса)
    const apiUrl = new URL('/api/auth/validate', request.nextUrl.origin);
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
    
    // Добавляем информацию о пользователе в headers для использования в страницах
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', data.user.userId);
    requestHeaders.set('x-user-email', data.user.email);
    requestHeaders.set('x-user-role', data.user.role);
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
     * Применяем middleware ко всем путям кроме:
     * - api routes
     * - _next/static (статические файлы)
     * - _next/image (оптимизация изображений)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};