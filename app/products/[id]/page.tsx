import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailsView from '@/components/ProductDetailsView';
import { Product } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/products-data';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export default async function DynamicProductPage({ params }: PageProps) {
  const { id } = params;
  let product: Product | null = null;
  let relatedProducts: Product[] = [];

  try {
    const rawProduct = await prisma.product.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
    });

    if (rawProduct) {
      product = {
        ...rawProduct,
        images: JSON.parse(rawProduct.images || '[]'),
        specs: JSON.parse(rawProduct.specs || '{}'),
      };

      const rawRelated = await prisma.product.findMany({
        where: {
          id: { not: product.id },
          category: product.category,
        },
        take: 4,
      });

      relatedProducts = rawRelated.map((p) => ({
        ...p,
        images: JSON.parse(p.images || '[]'),
        specs: JSON.parse(p.specs || '{}'),
      }));
    }
  } catch (error) {
    console.warn('Prisma dynamic product error, using fallback:', error);
  }

  if (!product) {
    product = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id) || null;
    if (product) {
      relatedProducts = INITIAL_PRODUCTS.filter((p) => p.id !== product!.id && p.category === product!.category).slice(0, 4);
    }
  }

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailsView
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
