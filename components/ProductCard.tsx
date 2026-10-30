'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Heart, ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const favorite = isFavorite(product.id);

  const formatPrice = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' UZS';
  };

  const productUrl = `/products/${product.slug || product.id}`;

  return (
    <div
      data-product-card="true"
      className="product-card bg-white rounded-xl p-4 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 relative flex flex-col justify-between group"
    >
      {/* Favorite Button */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          title={favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          className={`p-2 rounded-full border transition-all ${
            favorite
              ? 'border-red-200 bg-red-50 text-red-500 scale-105'
              : 'border-gray-200 bg-white/80 hover:bg-gray-50 text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${favorite ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <Link href={productUrl} className="block overflow-hidden rounded-lg mb-4">
        <div className="h-48 flex items-center justify-center bg-white p-2">
          <img
            src={product.image}
            alt={product.title}
            className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Product Title */}
      <Link href={productUrl}>
        <h3 className="text-sm text-gray-800 font-semibold h-10 overflow-hidden line-clamp-2 mb-2 hover:text-[#e5007d] transition-colors leading-snug">
          {product.title}
        </h3>
      </Link>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(product.rating || 5)
                  ? 'fill-amber-400'
                  : 'text-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] text-gray-400 ml-1">
          ({product.reviewsCount || 10})
        </span>
      </div>

      {/* Price & Brand & Add Button */}
      <div className="mt-auto pt-2 border-t border-gray-50 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-semibold">Цена:</p>
            <p className="text-base font-extrabold text-[#e5007d]">
              {formatPrice(product.price)}
            </p>
          </div>
          <span className="bg-[#ffebf7] text-[#e5007d] text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            {product.brand}
          </span>
        </div>

        <button
          onClick={() => addToCart(product, 1)}
          className="w-full mt-1 bg-gray-900 hover:bg-[#e5007d] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>В корзину</span>
        </button>
      </div>
    </div>
  );
}
