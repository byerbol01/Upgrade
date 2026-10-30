'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8 mt-12 text-gray-700">
      <div className="max-w-[1480px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Logo & Info */}
          <div className="lg:col-span-1">
            <Link href="/">
              <img
                src="/images/d73d17452d7c7cd96e0f7e1e486fbb64538e33e4a91e9ef39b80a2603bcb2c31.png"
                className="w-48 mb-6 object-contain"
                alt="Upgrade Logo"
              />
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed">
              Интернет-магазин мощных игровых компьютеров, профессиональных рабочих станций, мониторов и геймерских аксессуаров в Ташкенте с доставкой по всему Узбекистану.
            </p>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:col-span-3 gap-8 text-sm">
            <div>
              <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Компания</h3>
              <ul className="space-y-2.5 text-gray-600 text-xs">
                <li><Link href="/information" className="hover:text-pink-600 transition-colors">О нас</Link></li>
                <li><Link href="/information" className="hover:text-pink-600 transition-colors">Контакты</Link></li>
                <li><Link href="/information" className="hover:text-pink-600 transition-colors">Почему мы?</Link></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Публичная оферта</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Услуги</h3>
              <ul className="space-y-2.5 text-gray-600 text-xs">
                <li><Link href="/configurator" className="hover:text-pink-600 transition-colors">Конфигуратор ПК</Link></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Апгрейд компьютеров</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Чистка и обслуживание</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Поддержка</h3>
              <ul className="space-y-2.5 text-gray-600 text-xs">
                <li><a href="#" className="hover:text-pink-600 transition-colors">Доставка по Узбекистану</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Способы оплаты</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Гарантия и возврат</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Проекты</h3>
              <ul className="space-y-2.5 text-gray-600 text-xs">
                <li><a href="#" className="hover:text-pink-600 transition-colors">Сборки для блогеров</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Игровые клубы</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Киберспорт</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Details */}
          <div className="text-xs space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5 text-gray-900 font-bold uppercase tracking-wider text-[11px]">
                Телефоны
              </div>
              <div className="text-gray-600 space-y-1 font-semibold">
                <p>+ 998 (99) 124-24-24</p>
                <p>+ 998 (97) 124-24-24</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5 text-gray-900 font-bold uppercase tracking-wider text-[11px]">
                Адреса
              </div>
              <div className="text-gray-600 space-y-1">
                <p>г. Ташкент, ул. Навои 37</p>
                <p>г. Ташкент, Трц. Малика, Магазин 24</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5 text-gray-900 font-bold uppercase tracking-wider text-[11px]">
                Режим работы
              </div>
              <p className="text-gray-600">Ежедневно с 10:00 до 20:00</p>
            </div>
          </div>
        </div>

        {/* Brand Accent Line */}
        <div className="h-0.5 bg-[#e5007d] w-full mb-6"></div>

        {/* Bottom copyright & socials */}
        <div className="sm:flex sm:items-center sm:justify-between text-xs text-gray-500">
          <span>
            © 2009 <span className="text-[#e5007d] font-bold">UPGRADE™</span>. Все права защищены.
          </span>

          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-4">
            <a href="#" className="text-gray-400 hover:text-[#e5007d] transition-colors" title="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clipRule="evenodd"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#e5007d] transition-colors" title="Discord">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.942 5.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.586 11.586 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3 17.392 17.392 0 0 0-2.868 11.662 15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.638 10.638 0 0 1-1.706-.83c.143-.106.283-.217.418-.331a11.664 11.664 0 0 0 10.118 0c.137.114.277.225.418.331-.544.328-1.116.606-1.71.832a12.58 12.58 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM8.678 14.813a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.929 1.929 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#e5007d] transition-colors" title="Twitter">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#e5007d] transition-colors" title="GitHub">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clipRule="evenodd"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
