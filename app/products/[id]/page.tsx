import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailsView from '@/components/ProductDetailsView';
import { Product } from '@/lib/types';

interface PageProps {
  params: { id: string };
}

export default async function DynamicProductPage({ params }: PageProps) {
  const { id } = params;

  const rawProduct = await prisma.product.findFirst({
    where: {
      OR: [{ id: id }, { slug: id }],
    },
  });

  if (!rawProduct) {
    notFound();
  }

  const product: Product = {
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

  const relatedProducts: Product[] = rawRelated.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    specs: JSON.parse(p.specs || '{}'),
  }));

  return (
    <ProductDetailsView
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
