'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    '/images/corusel1.png',
    '/images/corusel2.png',
    '/images/corusel3.png',
    '/images/corusel4.png',
    '/images/corusel5.png',
  ];

  // Fetch products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    }
    loadProducts();
  }, []);

  // Auto slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const categories = [
    { name: 'Клавиатуры', image: '/images/d32348b36c863e6fbcec18f69f0d2274d898db0eceda1675e89fd0ed08b7db0c.png', href: '/products?category=keyboards' },
    { name: 'Мышки', image: '/images/mishka.png', href: '/products?category=mice' },
    { name: 'Микрофоны', image: '/images/96079505d678680959dc0583173ee6aec88d410293eceeac98f3d586b263bab3.png', href: '/products?category=accessories' },
    { name: 'Наушники', image: '/images/ce7ad3f5d18ab3247d08fcb5d54c6f0f4fcf1d2fb358cd58e7645a051f18b527.png', href: '/products?category=accessories' },
    { name: 'Мониторы', image: '/images/7e0ae5bd85f152a83a95341d111b6fe0e3b6e2153059db0eefc9e8a30c8871ca.png', href: '/products?category=monitors' },
    { name: 'Кронштейны', image: '/images/be1738133cab1f5a7f60d6aedbdb67e08f5315c4c613d83e742fd3b25b9a7553.png', href: '/products?category=accessories' },
    { name: 'Колонки', image: '/images/2ebffa53825ced446e5868fc9f51accfb1b41c77b0ebbfb5799ef620b33d741e.png', href: '/products?category=accessories' },
    { name: 'Коврики', image: '/images/44d4917eb0aae08938709e5201034f2cf8046f9b9d3f105c0accc763d8a0dcd6.png', href: '/products?category=accessories' },
  ];

  return (
    <div className="w-full">
      {/* 1. Hero Carousel */}
      <section id="corusel" className="mt-[5px]">
        <div className="max-w-[1480px] mx-auto px-4">
          <div className="relative w-full overflow-hidden rounded-xl bg-gray-900 shadow-md">
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-[500px] w-full">
              {carouselImages.map((src, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover object-center"
                    alt={`Slide ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Carousel Dots */}
            <div className="absolute z-30 flex -translate-x-1/2 bottom-3 md:bottom-5 left-1/2 space-x-2.5">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all cursor-pointer ${
                    index === currentSlide
                      ? 'bg-[#e5007d] scale-125'
                      : 'bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>

            {/* Carousel Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-2 md:px-4 cursor-pointer group focus:outline-none"
              aria-label="Предыдущий слайд"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors">
                <ChevronLeft className="w-5 h-5 text-white" />
              </span>
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-2 md:px-4 cursor-pointer group focus:outline-none"
              aria-label="Следующий слайд"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors">
                <ChevronRight className="w-5 h-5 text-white" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. НОВИНКИ (Catalog Grid) */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-[1480px] mx-auto p-4 font-sans">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-gray-900 italic tracking-tight flex items-center gap-3">
              <span className="w-2.5 h-7 bg-[#e5007d] inline-block rounded-xs"></span>
              НОВИНКИ
            </h2>
            <Link
              href="/igrovye-sborki"
              className="text-xs font-bold text-[#e5007d] hover:text-[#c2005d] uppercase tracking-wider flex items-center gap-1"
            >
              Смотреть все →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Конфигуратор Promo Banner */}
      <section className="max-w-[1480px] mx-auto w-full py-12 px-4">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="w-full md:w-1/2 space-y-6 text-left z-10">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
              Конфигуратор ПК
            </h2>

            <p className="text-gray-700 text-sm md:text-base leading-relaxed max-w-lg">
              Конфигуратор системного блока UPGRADE поможет подобрать комплектацию ПК и проверить комплектующие на совместимость. Выбирайте процессор, видеокарту, материнскую плату, заказывайте сборку своей мечты!
            </p>

            <Link href="/configurator">
              <button className="bg-[#e5007d] mt-2 hover:bg-[#c2005d] text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 flex items-center group shadow-lg shadow-pink-200 active:scale-95">
                Подобрать ПК
              </button>
            </Link>
          </div>

          <div className="w-full md:w-1/2 flex justify-center relative">
            <div className="absolute bg-pink-400 opacity-20 blur-[100px] rounded-full w-[300px] h-[300px]"></div>
            <img
              src="/images/keys.png"
              alt="Конфигуратор"
              className="relative w-full max-w-[500px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* 4. Комплектующие Category Grid */}
      <section className="max-w-[1480px] mx-auto p-6">
        <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-3">
          <span className="w-2.5 h-7 bg-[#e5007d] inline-block rounded-xs"></span>
          Комплектующие и периферия
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-between transition-all duration-300 hover:shadow-xl hover:border-pink-200 cursor-pointer"
            >
              <div className="h-40 flex items-center justify-center p-2">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="mt-4 text-gray-800 font-bold text-center">
                <span className="group-hover:text-[#e5007d] transition-colors">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. О КОМПАНИИ Block */}
      <section className="max-w-[1480px] mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold uppercase mb-8 flex items-center gap-3">
          <span className="text-[#e5007d]">◧</span> О КОМПАНИИ
        </h2>

        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="w-full h-full min-h-[350px]">
              <img
                src="/images/company.jpg"
                alt="Команда UPGRADE"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Компания UPGRADE
              </h3>

              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                С 2009 года мы успешно поставляем и собираем компьютерную технику в Узбекистане. Мы являемся официальными партнерами мировых технологических брендов ASUS, HyperX, Logitech, 2E Gaming, что гарантирует 100% качество и официальную гарантию.
              </p>

              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                Наши инженеры и консультанты с многолетним стажем всегда помогут подобрать конфигурацию под ваш бюджет. В нашем шоуруме на ул. Навои 37 представлен огромный выбор техники в наличии.
              </p>

              <p className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base">
                Мы предлагаем быструю доставку по всей республике и поддерживаем удобные способы оплаты.
              </p>

              <Link href="/information">
                <button className="border-2 border-[#e5007d] text-[#e5007d] px-8 py-3 rounded-xl font-bold hover:bg-[#e5007d] hover:text-white transition duration-300 w-fit">
                  Узнать больше о нас
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-gray-200 text-center">
            <div className="p-8 border-b sm:border-b-0 sm:border-r border-gray-200">
              <h4 className="text-[#e5007d] font-bold mb-2">Лидеры</h4>
              <p className="text-gray-600 text-xs">на игровом рынке</p>
              <div className="mt-4 text-2xl text-gray-400">→</div>
            </div>

            <div className="p-8 border-b sm:border-b-0 sm:border-r border-gray-200">
              <h4 className="text-[#e5007d] font-bold mb-2">Более 500</h4>
              <p className="text-gray-600 text-xs">положительных отзывов</p>
              <div className="mt-4 text-2xl text-gray-400">→</div>
            </div>

            <div className="p-8 border-b sm:border-b-0 sm:border-r border-gray-200">
              <h4 className="text-[#e5007d] font-bold mb-2">Провели 32</h4>
              <p className="text-gray-600 text-xs">киберспортивных турнира</p>
              <div className="mt-4 text-2xl text-gray-400">→</div>
            </div>

            <div className="p-8 border-b sm:border-b-0 sm:border-r border-gray-200">
              <h4 className="text-[#e5007d] font-bold mb-2">Топовые блогеры</h4>
              <p className="text-gray-600 text-xs">выбирают UPGRADE</p>
              <div className="mt-4 text-2xl text-gray-400">→</div>
            </div>

            <div className="p-8">
              <h4 className="text-[#e5007d] font-bold mb-2">Оборудовали 60</h4>
              <p className="text-gray-600 text-xs">компьютерных клубов</p>
              <div className="mt-4 text-2xl text-gray-400">→</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ПОДДЕРЖКА */}
      <section className="max-w-[1480px] mx-auto px-4 py-10">
        <h2 className="text-3xl font-black mb-8 text-gray-900 tracking-tight flex items-center gap-3">
          <span className="w-2.5 h-7 bg-[#e5007d] inline-block rounded-xs"></span>
          ПОДДЕРЖКА
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 p-8 text-center space-y-4 hover:shadow-lg transition-all rounded-2xl">
            <div className="flex justify-center">
              <img src="/images/dollor.png" alt="Оплата" className="w-16 h-16 object-contain" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Способы оплаты</h3>
            <p className="text-gray-600 text-xs">Наличными при получении, картами Uzcard/Humo, Visa/Mastercard</p>
            <span className="text-2xl text-[#e5007d] block font-bold">→</span>
          </div>

          <div className="bg-white border border-gray-200 p-8 text-center space-y-4 hover:shadow-lg transition-all rounded-2xl">
            <div className="flex justify-center">
              <img src="/images/soroq.png" alt="FAQ" className="w-16 h-16 object-contain" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Частые вопросы (FAQ)</h3>
            <p className="text-gray-600 text-xs">Ответы на популярные вопросы о гарантии, сборках и замене деталей</p>
            <span className="text-2xl text-[#e5007d] block font-bold">→</span>
          </div>

          <div className="bg-white border border-gray-200 p-8 text-center space-y-4 hover:shadow-lg transition-all rounded-2xl">
            <div className="flex justify-center">
              <img src="/images/box.png" alt="Доставка" className="w-16 h-16 object-contain" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Быстрая доставка</h3>
            <p className="text-gray-600 text-xs">Курьерская доставка по Ташкенту и надежная отправка в регионы</p>
            <span className="text-2xl text-[#e5007d] block font-bold">→</span>
          </div>
        </div>

        {/* 7. ОТЗЫВЫ КЛИЕНТОВ */}
        <h2 className="text-3xl font-black mt-14 mb-8 text-gray-900 tracking-tight flex items-center gap-3">
          <span className="w-2.5 h-7 bg-[#e5007d] inline-block rounded-xs"></span>
          ОТЗЫВЫ КЛИЕНТОВ
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 hover:shadow-md transition-all">
            <p className="text-[#e5007d] font-bold text-sm">Общий рейтинг</p>
            <h3 className="text-5xl font-black text-gray-900">95%</h3>
            <p className="text-xs text-gray-400">На основе более 800 оценок</p>
          </div>

          <a
            href="https://yandex.uz/maps"
            target="_blank"
            rel="noreferrer"
            className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 hover:shadow-md hover:border-pink-200 transition-all block group"
          >
            <p className="text-[#e5007d] font-bold text-sm">Яндекс Карты</p>
            <p className="text-gray-700 font-semibold group-hover:text-[#e5007d] transition-colors">
              Оставить свой отзыв →
            </p>
            <p className="text-xs text-gray-400">Проверенные отзывы клиентов</p>
          </a>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 hover:shadow-md transition-all">
            <div className="text-amber-400 text-xl font-bold">★★★★★</div>
            <p className="text-gray-800 text-sm font-semibold">93% покупателей</p>
            <p className="text-xs text-gray-400">Купили бы у нас технику снова</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 hover:shadow-md transition-all">
            <p className="text-[#e5007d] text-2xl font-black">800+</p>
            <p className="text-gray-800 text-sm font-semibold">Довольных геймеров</p>
            <p className="text-xs text-gray-400">За все время работы с 2009 года</p>
          </div>
        </div>
      </section>
    </div>
  );
}
