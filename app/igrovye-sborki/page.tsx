'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { SlidersHorizontal, ChevronDown, Filter, X } from 'lucide-react';

function GamingBuildsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [search, setSearch] = useState<string>(initialSearch);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Collapsible accordion states
  const [brandOpen, setBrandOpen] = useState(true);
  const [catOpen, setCatOpen] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let url = '/api/products?';
        if (selectedCategory) url += `category=${selectedCategory}&`;
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (sortBy === 'price-asc') url += 'sort=price-asc&';
        if (sortBy === 'price-desc') url += 'sort=price-desc&';
        if (sortBy === 'name-asc') url += 'sort=title&';

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          let prods: Product[] = data.products || [];

          if (selectedBrands.length > 0) {
            prods = prods.filter((p) => selectedBrands.includes(p.brand));
          }

          setProducts(prods);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedCategory, selectedBrands, sortBy, search]);

  const allBrands = ['2E Gaming', 'Asus', 'HyperX', 'Logitech', 'UPGRADE', 'Zotac', 'Grava star', 'Brateck'];

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategory('');
    setSearch('');
    setSortBy('name-asc');
  };

  return (
    <div className="max-w-[1480px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#e5007d]">Главная</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-bold">Каталог компьютеров и техники</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <span className="w-2.5 h-8 bg-[#e5007d] inline-block rounded-xs"></span>
            Каталог UPGRADE
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Найдено {products.length} {products.length === 1 ? 'товар' : 'товаров'}
          </p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="md:hidden flex items-center gap-2 text-xs font-bold text-white bg-[#e5007d] px-4 py-2.5 rounded-xl shadow-sm w-fit"
        >
          <Filter className="w-4 h-4" />
          <span>Фильтры ({selectedBrands.length + (selectedCategory ? 1 : 0)})</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <aside
          className={`w-full md:w-64 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-6 ${
            isMobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-sm uppercase text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#e5007d]" />
              Фильтры
            </h3>
            {(selectedBrands.length > 0 || selectedCategory || search) && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-[#e5007d] hover:underline font-semibold"
              >
                Сбросить
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="w-full flex items-center justify-between text-xs font-bold uppercase text-gray-800 mb-2"
            >
              <span>Категория</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <div className="space-y-1.5 text-xs text-gray-600 pt-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                    selectedCategory === '' ? 'bg-pink-50 text-[#e5007d] font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  Все товары
                </button>
                <button
                  onClick={() => setSelectedCategory('gaming-pc')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                    selectedCategory === 'gaming-pc' ? 'bg-pink-50 text-[#e5007d] font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  Игровые ПК
                </button>
                <button
                  onClick={() => setSelectedCategory('laptops')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                    selectedCategory === 'laptops' ? 'bg-pink-50 text-[#e5007d] font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  Ноутбуки
                </button>
                <button
                  onClick={() => setSelectedCategory('monitors')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                    selectedCategory === 'monitors' ? 'bg-pink-50 text-[#e5007d] font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  Мониторы
                </button>
                <button
                  onClick={() => setSelectedCategory('keyboards')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                    selectedCategory === 'keyboards' ? 'bg-pink-50 text-[#e5007d] font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  Клавиатуры
                </button>
                <button
                  onClick={() => setSelectedCategory('mice')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                    selectedCategory === 'mice' ? 'bg-pink-50 text-[#e5007d] font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  Мыши
                </button>
                <button
                  onClick={() => setSelectedCategory('accessories')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                    selectedCategory === 'accessories' ? 'bg-pink-50 text-[#e5007d] font-bold' : 'hover:bg-gray-50'
                  }`}
                >
                  Аксессуары
                </button>
              </div>
            )}
          </div>

          {/* Brand Filter */}
          <div>
            <button
              onClick={() => setBrandOpen(!brandOpen)}
              className="w-full flex items-center justify-between text-xs font-bold uppercase text-gray-800 mb-2"
            >
              <span>Торговая марка</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${brandOpen ? 'rotate-180' : ''}`} />
            </button>
            {brandOpen && (
              <div className="space-y-2 pt-1 text-xs">
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
            )}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Link
              href="/configurator"
              className="block p-3 rounded-xl bg-pink-50 text-[#e5007d] text-xs font-bold text-center hover:bg-[#e5007d] hover:text-white transition-all shadow-xs"
            >
              Собрать свой ПК в Конфигураторе →
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 w-full space-y-6">
          {/* Sorting and Category Tab Bar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  selectedCategory === ''
                    ? 'bg-[#e5007d] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Все товары
              </button>
              <button
                onClick={() => setSelectedCategory('gaming-pc')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  selectedCategory === 'gaming-pc'
                    ? 'bg-[#e5007d] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Игровые ПК
              </button>
              <button
                onClick={() => setSelectedCategory('monitors')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  selectedCategory === 'monitors'
                    ? 'bg-[#e5007d] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Мониторы
              </button>
              <button
                onClick={() => setSelectedCategory('laptops')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  selectedCategory === 'laptops'
                    ? 'bg-[#e5007d] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ноутбуки
              </button>
              <button
                onClick={() => setSelectedCategory('accessories')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  selectedCategory === 'accessories'
                    ? 'bg-[#e5007d] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Периферия
              </button>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">Сортировка:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-800 text-xs font-semibold rounded-xl px-3 py-2 focus:ring-1 focus:ring-[#e5007d]"
              >
                <option value="name-asc">По названию (А - Я)</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
              </select>
            </div>
          </div>

          {/* Active search filter tag */}
          {search && (
            <div className="flex items-center gap-2 text-xs bg-pink-50 text-[#e5007d] font-bold p-3 rounded-xl border border-pink-100">
              <span>Результаты поиска по запросу: «{search}»</span>
              <button onClick={() => setSearch('')} className="p-0.5 hover:bg-pink-100 rounded">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 h-80 animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-base font-bold text-gray-800 mb-2">Товары не найдены</p>
              <p className="text-xs text-gray-500 mb-6">Попробуйте изменить параметры фильтрации или поисковый запрос</p>
              <button
                onClick={clearAllFilters}
                className="bg-[#e5007d] text-white text-xs font-bold py-2.5 px-6 rounded-xl uppercase"
              >
                Сбросить все фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function GamingBuildsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#e5007d] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GamingBuildsContent />
    </Suspense>
  );
}

