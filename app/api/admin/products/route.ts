import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const ProductSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Название товара обязательно'),
  slug: z.string().min(2, 'Slug обязателен'),
  description: z.string().optional(),
  price: z.number().min(0, 'Цена должна быть неотрицательной'),
  oldPrice: z.number().optional().nullable(),
  category: z.string().min(1, 'Категория обязательна'),
  brand: z.string().min(1, 'Бренд обязателен'),
  inStock: z.boolean().default(true),
  stockCount: z.number().default(10),
  rating: z.number().default(5.0),
  image: z.string().min(1, 'Изображение обязательно'),
  images: z.array(z.string()).default([]),
  specs: z.record(z.string()).default({}),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
});

// Admin: Get all products
export async function GET() {
  const user = await getCurrentUser();
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  const rawProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const products = rawProducts.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    specs: JSON.parse(p.specs || '{}'),
  }));

  return NextResponse.json({ products });
}

// Admin: Create new product
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const data = parsed.data;

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        price: data.price,
        oldPrice: data.oldPrice,
        category: data.category,
        brand: data.brand,
        inStock: data.inStock,
        stockCount: data.stockCount,
        rating: data.rating,
        image: data.image,
        images: JSON.stringify(data.images),
        specs: JSON.stringify(data.specs),
        featured: data.featured,
        isNew: data.isNew,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Ошибка сохранения товара' }, { status: 500 });
  }
}

// Admin: Update existing product
export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID товара обязателен' }, { status: 400 });
    }

    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const data = parsed.data;

    const product = await prisma.product.update({
      where: { id: body.id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: data.price,
        oldPrice: data.oldPrice,
        category: data.category,
        brand: data.brand,
        inStock: data.inStock,
        stockCount: data.stockCount,
        image: data.image,
        images: JSON.stringify(data.images),
        specs: JSON.stringify(data.specs),
        featured: data.featured,
        isNew: data.isNew,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Ошибка обновления товара' }, { status: 500 });
  }
}

// Admin: Delete product
export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID товара обязателен' }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Товар удален' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Ошибка удаления товара' }, { status: 500 });
  }
}
