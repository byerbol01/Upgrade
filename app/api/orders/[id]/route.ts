import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getCurrentUser();

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: id }, { orderNumber: id }],
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    // Security check: non-admin can only view their own order
    if (user?.role !== 'ADMIN' && order.userId && order.userId !== user?.id) {
      return NextResponse.json({ error: 'Доступ ограничен' }, { status: 403 });
    }

    return NextResponse.json({
      order: {
        ...order,
        items: JSON.parse(order.itemsJson || '[]'),
      },
    });
  } catch (error) {
    console.error('Order detail error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
