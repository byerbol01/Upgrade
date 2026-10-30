'use client';

import React from 'react';
import Link from 'next/link';

export default function TrademarksPage() {
  const brandsAlphabet = [
    {
      letter: 'A',
      brands: ['Acer', 'Apple', 'Asus'],
    },
    {
      letter: 'B',
      brands: ['Be Quiet!', 'Brateck', 'BenQ'],
    },
    {
      letter: 'C',
      brands: ['Corsair', 'Cooler Master', 'Canyon'],
    },
    {
      letter: 'D',
      brands: ['Dell', 'DeepCool', 'Dark Project', 'Ducky', 'Dazzle'],
    },
    {
      letter: 'G',
      brands: ['Glorious', 'Grava star', 'Govee', 'GameMax', 'Gigabyte'],
    },
    {
      letter: 'H',
      brands: ['HyperX', 'HP', 'Havit'],
    },
    {
      letter: 'K',
      brands: ['Keychron', 'Kingston', 'Koss', 'Kwumsy'],
    },
    {
      letter: 'L',
      brands: ['Logitech', 'Lian Li', 'LG', 'Lunacy', 'Lumivida', 'Lenovo'],
    },
    {
      letter: 'M',
      brands: ['MSI', 'Microsoft', 'Marsback', 'Montech'],
    },
    {
      letter: 'N',
      brands: ['NVIDIA', 'NZXT', 'Noctua'],
    },
    {
      letter: 'R',
      brands: ['Razer', 'Redragon', 'ROG'],
    },
    {
      letter: 'S',
      brands: ['Samsung', 'SteelSeries', 'Sony', 'Sapphire'],
    },
    {
      letter: 'U',
      brands: ['UPGRADE', 'Ugreen'],
    },
    {
      letter: 'Z',
      brands: ['Zotac', 'Zowie'],
    },
  ];

  return (
    <div className="max-w-[1480px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#e5007d]">Главная</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-bold">Все бренды</span>
      </div>

      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="bg-pink-50 text-[#e5007d] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Каталог брендов
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mt-2 mb-3">
          Торговые марки
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Мы сотрудничаем с ведущими производителями компьютерного железа, геймерских мониторов и периферии со всего мира.
        </p>
      </div>

      {/* A-Z Brand Grid */}
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-12 gap-y-10">
          {brandsAlphabet.map((group) => (
            <div key={group.letter} className="space-y-3">
              <h2 className="text-3xl font-black text-[#e5007d] border-b-2 border-pink-100 pb-2">
                {group.letter}
              </h2>
              <ul className="space-y-2.5">
                {group.brands.map((brand) => (
                  <li key={brand}>
                    <Link
                      href={`/igrovye-sborki?search=${encodeURIComponent(brand)}`}
                      className="text-gray-700 hover:text-[#e5007d] font-medium text-sm transition-colors duration-150 block hover:translate-x-1 transform"
                    >
                      {brand}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
