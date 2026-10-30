import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort'); // "price-asc" | "price-desc" | "title"
    const featured = searchParams.get('featured');
    const isNew = searchParams.get('isNew');

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (brand) {
      where.brand = {
        equals: brand,
      };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (isNew === 'true') {
      where.isNew = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'title') {
      orderBy = { title: 'asc' };
    }

    const rawProducts = await prisma.product.findMany({
      where,
      orderBy,
    });

    const products = rawProducts.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      specs: JSON.parse(p.specs || '{}'),
    }));

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Products error:', error);
    return NextResponse.json({ error: 'Не удалось загрузить товары' }, { status: 500 });
  }
}
