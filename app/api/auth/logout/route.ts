import { NextResponse } from 'next/server';
import { TOKEN_COOKIE } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Вы успешно вышли из системы',
  });

  response.cookies.set({
    name: TOKEN_COOKIE,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}
