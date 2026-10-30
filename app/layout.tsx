import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import ErbolAI from '@/components/ErbolAI';

export const metadata: Metadata = {
  title: 'UPGRADE — Интернет-магазин компьютеров и геймерской техники в Ташкенте',
  description: 'Купить игровые компьютеры, мощные ноутбуки ASUS, мониторы 144Hz/165Hz, механические клавиатуры и аксессуары в Ташкенте с доставкой по Узбекистану.',
  icons: {
    icon: '/images/867b18a0c147c95b9cd84b784f5be05eea647bbbe7f6d059f4e66db9ae0c015f.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col justify-between bg-gray-50 text-gray-900 antialiased">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <AuthModal />
        <ErbolAI />
      </body>
    </html>
  );
}
