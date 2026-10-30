import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const ForgotSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ForgotSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // For security reasons, don't disclose whether user exists
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Если указанный адрес зарегистрирован, ссылка для сброса пароля отправлена на почту.',
      });
    }

    // In local development / demo environment without an external SMTP server:
    return NextResponse.json({
      success: true,
      message: `Инструкция по сбросу пароля подготовлена для ${email}. Для завершения настройки в production укажите SMTP параметры в .env.`,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Ошибка при отправке запроса' }, { status: 500 });
  }
}
