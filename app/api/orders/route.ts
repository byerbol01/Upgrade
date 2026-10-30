import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const CreateOrderSchema = z.object({
  customerName: z.string().min(2, 'Укажите ваше имя'),
  customerEmail: z.string().email('Некорректный email адрес'),
  customerPhone: z.string().min(7, 'Укажите контактный телефон'),
  city: z.string().min(2, 'Укажите город'),
  address: z.string().min(3, 'Укажите адрес доставки'),
  deliveryNotes: z.string().optional(),
  deliveryMethod: z.enum(['STANDARD', 'EXPRESS', 'PICKUP']).default('STANDARD'),
  paymentMethod: z.string().default('COD'),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      price: z.number(),
      quantity: z.number().min(1),
      image: z.string(),
    })
  ).min(1, 'Корзина не должна быть пустой'),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Ошибка валидации формы' },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      city,
      address,
      deliveryNotes,
      deliveryMethod,
      paymentMethod,
      items,
    } = parsed.data;

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Generate unique order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `UPG-2026-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user ? user.id : null,
        customerName,
        customerEmail,
        customerPhone,
        city,
        address,
        deliveryNotes: deliveryNotes || '',
        deliveryMethod,
        paymentMethod,
        paymentStatus: 'PENDING',
        status: 'PENDING',
        totalAmount,
        itemsJson: JSON.stringify(items),
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items: JSON.parse(order.itemsJson),
      },
      message: 'Заказ успешно оформлен!',
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка при сохранении заказа' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Необходима авторизация для просмотра заказов' },
        { status: 401 }
      );
    }

    const rawOrders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: user.id },
          { customerEmail: user.email },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    const orders = rawOrders.map((o) => ({
      ...o,
      items: JSON.parse(o.itemsJson || '[]'),
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
