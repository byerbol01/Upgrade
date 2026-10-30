import React from 'react';
import { prisma } from '@/lib/prisma';
import ProductDetailsView from '@/components/ProductDetailsView';
import { Product } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/products-data';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Asus2Page() {
  let product: Product | null = null;
  let relatedProducts: Product[] = [];

  try {
    const rawProduct = await prisma.product.findFirst({
      where: { slug: 'asus2' },
    });

    if (rawProduct) {
      product = {
        ...rawProduct,
        images: JSON.parse(rawProduct.images || '[]'),
        specs: JSON.parse(rawProduct.specs || '{}'),
      };

      const rawRelated = await prisma.product.findMany({
        where: { id: { not: product.id } },
        take: 4,
      });

      relatedProducts = rawRelated.map((p) => ({
        ...p,
        images: JSON.parse(p.images || '[]'),
        specs: JSON.parse(p.specs || '{}'),
      }));
    }
  } catch (error) {
    console.warn('Prisma lookup error on asus2 page, using fallback:', error);
  }

  if (!product) {
    product = INITIAL_PRODUCTS.find((p) => p.slug === 'asus2') || null;
    relatedProducts = INITIAL_PRODUCTS.filter((p) => p.slug !== 'asus2').slice(0, 4);
  }

  if (!product) notFound();

  return <ProductDetailsView product={product} relatedProducts={relatedProducts} />;
}
