import React from 'react';
import { prisma } from '@/lib/prisma';
import ProductDetailsView from '@/components/ProductDetailsView';
import { Product } from '@/lib/types';
import { notFound } from 'next/navigation';

export default async function Asus3Page() {
  const rawProduct = await prisma.product.findFirst({
    where: { slug: 'asus3' },
  });

  if (!rawProduct) notFound();

  const product: Product = {
    ...rawProduct,
    images: JSON.parse(rawProduct.images || '[]'),
    specs: JSON.parse(rawProduct.specs || '{}'),
  };

  const rawRelated = await prisma.product.findMany({
    where: { id: { not: product.id } },
    take: 4,
  });

  const relatedProducts: Product[] = rawRelated.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    specs: JSON.parse(p.specs || '{}'),
  }));

  return <ProductDetailsView product={product} relatedProducts={relatedProducts} />;
}
