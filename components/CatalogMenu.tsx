'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CatalogMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuData: Record<string, { name: string; items: { label: string; href: string }[] }> = {
  accessories: {
    name: 'Аксессуары',
    items: [
      { label: 'Декоративное освещение', href: '/products?category=accessories' },
      { label: 'Футболка UPGRADE', href: '/products?category=accessories' },
      { label: 'Студийный свет Grava star', href: '/products?category=accessories' },
      { label: 'Очки для геймеров', href: '/products?category=accessories' },
      { label: 'Зарядные устройства', href: '/products?category=accessories' },
      { label: 'Кейкапы PBT', href: '/products?category=accessories' },
    ],
  },
  monitors: {
    name: 'Мониторы',
    items: [
      { label: 'Игровые мониторы 144Hz / 165Hz', href: '/products?category=monitors' },
      { label: 'Кронштейны для мониторов', href: '/products?category=accessories' },
      { label: '4K Мониторы UltraWide', href: '/products?category=monitors' },
      { label: 'Чистящие средства', href: '/products?category=accessories' },
    ],
  },
  laptops: {
    name: 'Ноутбуки',
    items: [
      { label: 'Игровые ноутбуки ASUS', href: '/products?category=laptops' },
      { label: 'Ультрабуки Zenbook OLED', href: '/products?category=laptops' },
      { label: 'Ноутбуки для работы и дизайна', href: '/products?category=laptops' },
    ],
  },
  gaming_pc: {
    name: 'Игровые ПК',
    items: [
      { label: 'Компьютеры серии GAMING MASTER', href: '/igrovye-sborki' },
      { label: 'Компьютеры серии GAMING PRO', href: '/igrovye-sborki' },
      { label: 'Компактные ПК ZOTAC MAGNUS', href: '/igrovye-sborki' },
      { label: 'Собрать свой ПК в Конфигураторе', href: '/configurator' },
    ],
  },
  headphones: {
    name: 'Наушники',
    items: [
      { label: 'Беспроводные гарнитуры HyperX', href: '/products?category=accessories' },
      { label: 'Игровые гарнитуры 2E Gaming 7.1', href: '/products?category=accessories' },
      { label: 'Подставки для наушников', href: '/products?category=accessories' },
    ],
  },
  keyboards: {
    name: 'Клавиатуры и Мыши',
    items: [
      { label: 'Механические клавиатуры', href: '/products?category=keyboards' },
      { label: 'Беспроводные мыши Logitech', href: '/products?category=mice' },
      { label: 'Игровые мыши Grava star', href: '/products?category=mice' },
      { label: 'Большие коврики XL', href: '/products?category=accessories' },
    ],
  },
};

export default function CatalogMenu({ isOpen, onClose }: CatalogMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>('accessories');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 top-[115px] bg-black/40 z-[999] backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl h-[500px] mx-auto mt-2 flex shadow-2xl overflow-hidden rounded-b-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Main Categories */}
        <div className="w-1/3 border-r border-gray-100 bg-gray-50 overflow-y-auto custom-scroll">
          <ul>
            {Object.entries(menuData).map(([key, data]) => {
              const isActive = activeCategory === key;
              return (
                <li
                  key={key}
                  onMouseEnter={() => setActiveCategory(key)}
                  onClick={() => setActiveCategory(key)}
                  className={`px-6 py-4 border-b border-gray-100 flex justify-between items-center cursor-pointer transition-all ${
                    isActive
                      ? 'bg-white text-[#c2005d] font-bold shadow-sm'
                      : 'hover:bg-white text-gray-700 hover:text-[#c2005d]'
                  }`}
                >
                  <span>{data.name}</span>
                  <span className={isActive ? 'text-[#c2005d]' : 'text-gray-300'}>▶</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Side: Subcategories */}
        <div className="w-2/3 p-8 bg-white overflow-y-auto custom-scroll flex flex-col justify-between">
          <div>
            <h2 className="text-[#c2005d] font-bold text-xl mb-6 border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>{menuData[activeCategory]?.name}</span>
              <span className="text-xs text-gray-400 font-normal">
                {menuData[activeCategory]?.items.length} категорий
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {menuData[activeCategory]?.items.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className="hover:bg-pink-50 p-3 rounded-lg transition-colors hover:text-[#c2005d] border-l-4 border-transparent hover:border-[#c2005d] text-gray-700 font-medium flex items-center justify-between group"
                >
                  <span>{item.label}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-xs text-[#c2005d] transition-opacity">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Гарантия лучшей цены в Ташкенте</span>
            <Link
              href="/igrovye-sborki"
              onClick={onClose}
              className="text-[#c2005d] font-semibold hover:underline"
            >
              Смотреть все товары →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
