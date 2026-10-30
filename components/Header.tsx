'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import CatalogMenu from './CatalogMenu';
import CartDropdown from './CartDropdown';
import { User, LogOut, Shield, Package, Sun, Moon, Search, Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { cart, user, setUser, openAuthModal, getCartCount, isCartOpen, setCartOpen } = useStore();

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileConfigOpen, setMobileConfigOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Check auth session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error('Check auth error:', err);
      }
    }
    checkAuth();
  }, [setUser]);

  // Handle Dark mode initial state
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsUserMenuOpen(false);
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/igrovye-sborki?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        // If clicking outside, close cart dropdown
        setCartOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setCartOpen]);

  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* Top Header Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-[1480px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
            aria-label="Открыть меню"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="/images/d73d17452d7c7cd96e0f7e1e486fbb64538e33e4a91e9ef39b80a2603bcb2c31.png"
              width="200"
              height="45"
              alt="Upgrade Store Logo"
              className="object-contain"
            />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-1 focus:ring-pink-500 focus:border-pink-500 text-sm bg-gray-50 text-gray-900"
              placeholder="Поиск товаров (мониторы, ПК, ноутбуки)..."
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-[#e5007d]">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Action Icons Right */}
          <div className="flex items-center space-x-3 md:space-x-5">
            {/* Comparison */}
            <div className="hidden sm:flex flex-col items-center cursor-pointer text-gray-600 hover:text-[#e5007d] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="text-[9px] font-bold uppercase mt-1">Сравнение</span>
            </div>

            {/* Theme Toggle */}
            <div className="theme-wrapper">
              <button
                onClick={toggleDarkMode}
                id="theme-toggle"
                className="max-[440px]:hidden theme-btn text-gray-600 hover:text-[#e5007d]"
                title="Переключить тему"
              >
                <div className="sun-icon">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </div>
                <span>{darkMode ? 'Тьма' : 'Тема'}</span>
              </button>
            </div>

            {/* Cart Dropdown Launcher */}
            <div
              ref={cartDropdownRef}
              className="relative inline-block max-[470px]:hidden"
              onMouseEnter={() => setCartOpen(true)}
            >
              <button
                type="button"
                aria-label="Корзина"
                onClick={() => setCartOpen(!isCartOpen)}
                className="flex flex-col items-center cursor-pointer text-gray-600 transition-all duration-300 hover:scale-105 bg-transparent border-0 p-0"
              >
                <div className="relative">
                  <svg
                    className="w-6 h-6 transition-colors hover:text-[#e5007d]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="absolute -top-1.5 -right-2 bg-[#e5007d] text-white text-[9px] font-bold px-1 py-0.5 rounded-full min-w-[16px] h-[16px] flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                </div>
                <span className="text-[9px] font-bold uppercase mt-1 hover:text-[#e5007d]">Корзина</span>
              </button>

              {/* Cart Dropdown Content */}
              {isCartOpen && (
                <div className="absolute right-0 top-full pt-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <CartDropdown onClose={() => setCartOpen(false)} />
                </div>
              )}
            </div>

            {/* User Auth / Account Dropdown */}
            <div ref={userMenuRef} className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 border border-gray-200 p-1.5 px-3 rounded-xl hover:bg-gray-50 transition-all text-xs font-semibold text-gray-800"
                >
                  <div className="w-7 h-7 rounded-lg bg-pink-100 text-[#e5007d] flex items-center justify-center font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline">{user.name || user.email}</span>
                  {user.role === 'ADMIN' && (
                    <span className="bg-[#e5007d] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                      ADMIN
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="border border-gray-200 p-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  type="button"
                  title="Войти в личный кабинет"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="hidden sm:inline text-xs font-bold text-gray-700">Войти</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 z-[100] animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-pink-50 hover:text-[#e5007d] rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span>Мой профиль</span>
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-pink-50 hover:text-[#e5007d] rounded-lg transition-colors"
                    >
                      <Package className="w-4 h-4 text-gray-400" />
                      <span>История заказов</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#e5007d] hover:bg-pink-50 rounded-lg transition-colors"
                      >
                        <Shield className="w-4 h-4 text-[#e5007d]" />
                        <span>Админ-панель</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Выйти из аккаунта</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="hidden md:block bg-white border-t border-gray-100">
          <div className="max-w-[1480px] mx-auto px-4 flex items-center">
            {/* Catalog Button */}
            <div className="flex items-center gap-6">
              <button
                id="catalogBtn"
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className="bg-[#c2005d] hover:bg-[#a0004d] text-white px-5 py-2 flex items-center gap-2 transition-all font-medium rounded-t-sm"
              >
                <span>{isCatalogOpen ? '✕' : '☰'}</span>
                <span>{isCatalogOpen ? 'Закрыть' : 'Каталог'}</span>
              </button>
            </div>

            {/* Navigation Links with Icons */}
            <div className="flex items-center space-x-6 ml-6 text-[13px] font-semibold text-gray-700 py-3">
              <div className="flex items-center gap-2">
                <img
                  src="/images/60408282791fd3a9d468c5bc5e91f9306c8f30a3ce4245fa108f3160ad2dc372.svg"
                  alt="Конфигуратор"
                  className="w-4 h-4"
                />
                <Link href="/configurator" className="hover:text-pink-600 transition-colors">
                  Конфигуратор
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src="/images/867b18a0c147c95b9cd84b784f5be05eea647bbbe7f6d059f4e66db9ae0c015f.svg"
                  alt="Купить компьютер"
                  className="w-4 h-4"
                />
                <Link href="/igrovye-sborki" className="hover:text-pink-600 transition-colors">
                  Купить компьютер
                </Link>
              </div>

              <Link href="/news" className="hover:text-pink-600 transition-colors">
                Новинки
              </Link>

              <Link href="/trademarks" className="hover:text-pink-600 transition-colors border-b-2 border-[#e5007d]">
                Все бренды
              </Link>

              <Link href="/information" className="hover:text-pink-600 transition-colors">
                О компании
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Catalog Mega-Menu Component */}
      <CatalogMenu isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} />

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <img
                  src="/images/d73d17452d7c7cd96e0f7e1e486fbb64538e33e4a91e9ef39b80a2603bcb2c31.png"
                  className="h-8 object-contain"
                  alt="Logo"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск товаров..."
                    className="w-full text-xs py-2 pl-3 pr-8 border border-gray-200 rounded-lg"
                  />
                  <button type="submit" className="absolute right-2.5 top-2 text-gray-400">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <ul className="space-y-2 text-sm font-semibold">
                <li>
                  <Link
                    href="/igrovye-sborki"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2.5 text-gray-900 rounded-lg bg-pink-50 text-[#e5007d]"
                  >
                    <span>Каталог товаров</span>
                  </Link>
                </li>

                <li>
                  <button
                    onClick={() => setMobileConfigOpen(!mobileConfigOpen)}
                    className="flex items-center justify-between w-full px-3 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <span>Конфигуратор и ПК</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileConfigOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileConfigOpen && (
                    <ul className="pl-6 py-2 space-y-1.5 text-xs text-gray-600">
                      <li>
                        <Link href="/configurator" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-[#e5007d]">
                          Конфигуратор ПК
                        </Link>
                      </li>
                      <li>
                        <Link href="/igrovye-sborki" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 hover:text-[#e5007d]">
                          Игровые ПК
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <Link
                    href="/news"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <span>Новинки</span>
                    <span className="bg-[#e5007d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">New</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/trademarks"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <span>Все бренды</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/information"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <span>О компании</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/buynow"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <span>Корзина</span>
                    <span className="bg-pink-100 text-[#e5007d] font-bold text-xs px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-100">
              {user ? (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-800">{user.name} ({user.email})</div>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-xs text-[#e5007d] font-bold py-1"
                  >
                    Перейти в профиль →
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs text-red-500 font-semibold py-1"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full bg-[#e5007d] text-white text-xs font-bold py-2.5 rounded-xl uppercase shadow-md"
                >
                  Войти / Регистрация
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
