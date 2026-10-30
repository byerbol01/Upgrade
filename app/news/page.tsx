'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

export default function NewsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('price-desc');

  const allBrands = ['2E Gaming', 'Asus', 'HyperX', 'Logitech', 'UPGRADE', 'Grava star'];

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        const res = await fetch('/api/products?isNew=true');
        if (res.ok) {
          const data = await res.json();
          let prods: Product[] = data.products || [];

          if (selectedBrands.length > 0) {
            prods = prods.filter((p) => selectedBrands.includes(p.brand));
          }

          if (sortBy === 'price-asc') {
            prods.sort((a, b) => a.price - b.price);
          } else if (sortBy === 'price-desc') {
            prods.sort((a, b) => b.price - a.price);
          } else {
            prods.sort((a, b) => a.title.localeCompare(b.title));
          }

          setProducts(prods);
        }
      } catch (err) {
        console.error('Failed to load news:', err);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [selectedBrands, sortBy]);

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
    );
  };

  return (
    <div className="max-w-[1480px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#e5007d]">Главная</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-bold">Новинки</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <span className="w-2.5 h-8 bg-[#e5007d] inline-block rounded-xs"></span>
            Новинки поступлений
            <span className="bg-[#e5007d] text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase ml-1">
              New
            </span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Свежие поступления игрового оборудования, ультрабуков и периферии в Ташкенте
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Сортировка:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 text-gray-800 text-xs font-semibold rounded-xl px-3 py-2"
          >
            <option value="price-desc">Сначала дороже</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="title">По названию (А - Я)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Aside Filter */}
        <aside className="w-full md:w-64 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-sm uppercase text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#e5007d]" />
              Игровая марка
            </h3>
            {selectedBrands.length > 0 && (
              <button
                onClick={() => setSelectedBrands([])}
                className="text-[11px] text-[#e5007d] hover:underline font-semibold"
              >
                Сбросить
              </button>
            )}
          </div>

          <div className="space-y-2 text-xs">
            {allBrands.map((b) => (
              <label
                key={b}
                className="flex items-center gap-2.5 cursor-pointer hover:text-[#e5007d] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b)}
                  onChange={() => toggleBrand(b)}
                  className="w-4 h-4 rounded text-[#e5007d] border-gray-300 focus:ring-[#e5007d]"
                />
                <span className="text-gray-700">{b}</span>
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
            <p className="font-bold text-gray-800 uppercase text-[11px]">Тип устройства</p>
            <div className="space-y-1">
              <p className="cursor-pointer hover:text-[#e5007d]">Ноутбуки 2026</p>
              <p className="cursor-pointer hover:text-[#e5007d]">Игровые ПК серии Extreme</p>
              <p className="cursor-pointer hover:text-[#e5007d]">Гаджеты и декор Grava star</p>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1 w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
