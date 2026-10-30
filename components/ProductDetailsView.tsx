'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import ProductCard from './ProductCard';
import {
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  Check,
} from 'lucide-react';

interface ProductDetailsViewProps {
  product: Product;
  relatedProducts?: Product[];
}

export default function ProductDetailsView({
  product,
  relatedProducts = [],
}: ProductDetailsViewProps) {
  const router = useRouter();
  const { addToCart, toggleFavorite, isFavorite } = useStore();

  const [activeImage, setActiveImage] = useState<string>(
    product.images?.[0] || product.image
  );
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'reviews'>('specs');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const favorite = isFavorite(product.id);

  const formatPrice = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' UZS';
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/buynow');
  };

  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <div className="max-w-[1480px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#e5007d]">Главная</Link>
        <span>&gt;</span>
        <Link href="/igrovye-sborki" className="hover:text-[#e5007d]">Каталог</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-bold line-clamp-1">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
        {/* Left Column: Image Gallery & Thumbnails */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 items-center">
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] custom-scroll p-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl border-2 p-2 bg-white flex items-center justify-center transition-all cursor-pointer ${
                    activeImage === img
                      ? 'border-[#e5007d] shadow-md scale-105'
                      : 'border-gray-200 hover:border-gray-300 opacity-80'
                  }`}
                >
                  <img src={img} alt={`Превью ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="flex-1 w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-center relative min-h-[400px] md:min-h-[500px]">
            <img
              src={activeImage}
              alt={product.title}
              className="max-h-[420px] max-w-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
            {product.isNew && (
              <span className="absolute top-6 left-6 bg-[#e5007d] text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                Новинка
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Title, Price, Buy Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
            {/* Stock status & Reviews */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-green-600 font-bold text-xs uppercase tracking-wide">
                  {product.inStock ? 'В наличии на складе' : 'Под заказ'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating || 5.0}</span>
                <span className="text-gray-400 font-normal">({product.reviewsCount || 12} отзывов)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Brand badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Производитель:</span>
              <span className="bg-pink-50 text-[#e5007d] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                {product.brand}
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-gray-50 rounded-2xl flex items-baseline justify-between border border-gray-100">
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase">Цена со скидкой:</p>
                <p className="text-2xl md:text-3xl font-black text-[#e5007d]">
                  {formatPrice(product.price)}
                </p>
              </div>
              {product.oldPrice && (
                <div className="text-right">
                  <p className="text-xs text-gray-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </p>
                  <span className="text-[10px] text-green-600 font-bold">
                    Экономия {formatPrice(product.oldPrice - product.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden shadow-xs h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 text-sm font-bold text-gray-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold border-x border-gray-300 text-gray-900 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 text-sm font-bold text-gray-700 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to favorites */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    favorite
                      ? 'border-red-200 bg-red-50 text-red-500 scale-105'
                      : 'border-gray-200 text-gray-400 hover:text-red-500 hover:bg-gray-50'
                  }`}
                  title={favorite ? 'Удалить из избранного' : 'В избранное'}
                >
                  <Heart className={`w-5 h-5 ${favorite ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {addedToast && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Товар успешно добавлен в корзину!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="bg-gray-900 hover:bg-[#e5007d] text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>В корзину</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-[#e5007d] hover:bg-[#c2005d] text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-200 transition-all active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Купить сейчас</span>
                </button>
              </div>
            </div>

            {/* Benefits summary */}
            <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#e5007d]" />
                <span>Быстрая доставка курьером по Ташкенту и в регионы</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#e5007d]" />
                <span>Официальная гарантия магазина UPGRADE 12 месяцев</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-[#e5007d]" />
                <span>Проверка перед покупкой в шоуруме на ул. Навои 37</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specs / Description / Reviews */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xs mb-16">
        <div className="flex border-b border-gray-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-sm font-bold tracking-tight transition-colors border-b-2 ${
              activeTab === 'specs'
                ? 'border-[#e5007d] text-[#e5007d]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Характеристики
          </button>
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-4 text-sm font-bold tracking-tight transition-colors border-b-2 ${
              activeTab === 'desc'
                ? 'border-[#e5007d] text-[#e5007d]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Описание
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold tracking-tight transition-colors border-b-2 ${
              activeTab === 'reviews'
                ? 'border-[#e5007d] text-[#e5007d]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Отзывы ({product.reviewsCount || 12})
          </button>
        </div>

        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specs || {}).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl text-xs"
              >
                <span className="text-gray-500 font-medium">{key}</span>
                <span className="text-gray-900 font-bold text-right">{val}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'desc' && (
          <div className="prose max-w-none text-sm text-gray-600 leading-relaxed space-y-4">
            <p>{product.description || 'Высококачественное игровое оборудование от официального дистрибьютора UPGRADE в Узбекистане. Полная заводская комплектация, официальная гарантия и техническая поддержка.'}</p>
            <p>Купите этот товар онлайн с доставкой или заберите лично в нашем фирменном магазине в Ташкенте.</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-gray-900">Азиз Т.</span>
                <span className="text-amber-400 text-xs">★★★★★</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Отличный товар, полностью соответствует заявленным характеристикам. Курьер доставил в тот же день, проверили на месте. Очень доволен сервисом UPGRADE!
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-gray-900">Сардор М.</span>
                <span className="text-amber-400 text-xs">★★★★★</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Покупал для игр и работы. Качество сборки идеальное, картинка четкая, работает тихо. Рекомендую к покупке!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-6 flex items-center gap-3">
            <span className="w-2 h-6 bg-[#e5007d] inline-block rounded-xs"></span>
            Рекомендуемые товары
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
