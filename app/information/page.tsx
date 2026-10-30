'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, Phone, Clock, ShieldCheck, Award, ThumbsUp } from 'lucide-react';

export default function InformationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const showroomImages = [
    '/images/d6a1a18062fb3d78e4aa56bcff5d9b41ef3db3c817526693fea539fbded2cd8e.jpg',
    '/images/c564dd0fe3daf8cd733d1b26c03658b68395f92bb8eb0d21b25eecbe679f025e.jpg',
    '/images/aa07f68714c3ae5f3ddeff3f84ee2269c4d9a03364946953ffc90631924c7231.jpg',
  ];

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + showroomImages.length) % showroomImages.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % showroomImages.length);
  };

  return (
    <div className="w-full">
      {/* 1. Team Section */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-[1480px] mx-auto px-4 text-center">
          <span className="bg-pink-50 text-[#e5007d] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            О нас
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4 tracking-tight">
            Наша команда
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Мы — команда профессионалов. Нас объединяет общая страсть к созданию компьютеров мирового класса, надежности и вниманию к каждой детали.
          </p>

          <div className="relative w-full overflow-hidden rounded-3xl bg-black shadow-xl">
            <img
              src="/images/40ccbcedd2faeeb60967eda26c5c7dae0f9d0cddda8f9649afb46d8b07ea7ce1.jpg"
              alt="Команда UPGRADE"
              className="w-full h-auto object-contain mx-auto max-h-[600px]"
            />
          </div>
        </div>
      </section>

      {/* 2. Company Story & Showroom Carousel */}
      <section className="bg-white py-16">
        <div className="max-w-[1480px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-gray-800">
              <span className="text-[#e5007d] font-bold text-xs uppercase tracking-wider">История успеха</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight text-gray-900 mt-1">
                Компания UPGRADE
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600">
                <p>
                  Наша компания успешно работает на рынке Узбекистана с 2009 года, предоставляя нашим клиентам широкий ассортимент компьютерной техники, игровых сборок и профессиональных рабочих станций.
                </p>
                <p>
                  Мы являемся официальным партнером десятков международных технологических лидеров (ASUS, HyperX, Logitech, 2E Gaming, DeepCool, Kingston, Samsung), что гарантирует 100% подлинность и официальное гарантийное обслуживание всей продукции.
                </p>
                <p>
                  Наши специалисты обладают многолетним опытом работы и всегда готовы предоставить профессиональные консультации и квалифицированную помощь при выборе техники. В нашем просторном шоуруме представлен огромный выбор товаров вживую.
                </p>
                <p>
                  Мы предлагаем оперативную доставку по всей республике и поддерживаем все современные способы оплаты для максимального комфорта наших клиентов.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#e5007d] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Гарантия 12+ мес.</p>
                    <p className="text-[11px] text-gray-400">На все сборки и детали</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#e5007d] flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Официальный дилер</p>
                    <p className="text-[11px] text-gray-400">Мировые бренды</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Showroom Interactive Carousel */}
            <div className="relative w-full overflow-hidden rounded-2xl shadow-xl bg-gray-900">
              <div className="relative h-72 md:h-[450px] w-full">
                {showroomImages.map((src, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt={`Шоурум UPGRADE ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* Dots */}
              <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-2.5">
                {showroomImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                      index === currentSlide ? 'bg-[#e5007d] scale-125' : 'bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Слайд ${index + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next buttons */}
              <button
                onClick={prevSlide}
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/40 group-hover:bg-black/70 text-white">
                  <ChevronLeft className="w-5 h-5" />
                </span>
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/40 group-hover:bg-black/70 text-white">
                  <ChevronRight className="w-5 h-5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Showroom Locations & Working Hours */}
      <section className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-[1480px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Наши контакты и локации
            </h2>
            <p className="text-sm text-gray-500 mt-1">Приезжайте в гости и протестируйте любую технику лично!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-pink-50 text-[#e5007d] rounded-2xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Главный шоурум</h3>
              <p className="text-xs text-gray-600 mb-1">г. Ташкент, ул. Навои 37</p>
              <p className="text-xs text-gray-600">г. Ташкент, Трц. Малика, Магазин 24</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-pink-50 text-[#e5007d] rounded-2xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Отдел продаж</h3>
              <p className="text-xs text-gray-600 font-bold mb-1">+998 (99) 124-24-24</p>
              <p className="text-xs text-gray-600 font-bold">+998 (97) 124-24-24</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-pink-50 text-[#e5007d] rounded-2xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Режим работы</h3>
              <p className="text-xs text-gray-600 mb-1">Без выходных</p>
              <p className="text-xs text-gray-600 font-bold text-[#e5007d]">10:00 — 20:00</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
