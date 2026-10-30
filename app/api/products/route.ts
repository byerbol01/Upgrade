import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_PRODUCTS } from '@/lib/products-data';

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
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
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

    if (rawProducts && rawProducts.length > 0) {
      const products = rawProducts.map((p) => ({
        ...p,
        images: JSON.parse(p.images || '[]'),
        specs: JSON.parse(p.specs || '{}'),
      }));
      return NextResponse.json({ products });
    }

    // Fallback if DB is empty or being initialized
    let fallback = [...INITIAL_PRODUCTS];
    if (category) fallback = fallback.filter((p) => p.category === category);
    if (brand) fallback = fallback.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    if (featured === 'true') fallback = fallback.filter((p) => p.featured);
    if (isNew === 'true') fallback = fallback.filter((p) => p.isNew);
    if (search) {
      const q = search.toLowerCase();
      fallback = fallback.filter((p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    return NextResponse.json({ products: fallback });
  } catch (error) {
    console.error('Products DB error, using INITIAL_PRODUCTS fallback:', error);
    return NextResponse.json({ products: INITIAL_PRODUCTS });
  }
}
