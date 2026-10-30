'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartDropdownProps {
  onClose?: () => void;
}

export default function CartDropdown({ onClose }: CartDropdownProps) {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useStore();
  const total = getCartTotal();

  const formatPrice = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' UZS';
  };

  return (
    <div className="w-[420px] max-w-[90vw] bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 z-[100] text-gray-900">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <h3 className="font-bold text-gray-900 text-sm uppercase flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#e5007d]" />
          Корзина покупок
        </h3>
        <span className="text-xs text-gray-400 font-medium">
          {cart.length} {cart.length === 1 ? 'товар' : 'товаров'}
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="py-8 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium mb-4">Ваша корзина пуста</p>
          <Link
            href="/igrovye-sborki"
            onClick={onClose}
            className="inline-block bg-[#e5007d] hover:bg-[#c2005d] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-md uppercase"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <>
          <div className="max-h-[320px] overflow-y-auto space-y-4 pr-1 custom-scroll">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-16 h-14 relative bg-gray-50 rounded-lg p-1 flex-shrink-0 flex items-center justify-center border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-[12px] font-bold text-gray-800 leading-tight truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-0.5 hover:bg-gray-100 text-xs font-bold text-gray-600 transition-colors"
                        aria-label="Уменьшить количество"
                      >
                        -
                      </button>
                      <span className="px-3 py-0.5 text-xs font-bold border-x border-gray-300 text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-0.5 hover:bg-gray-100 text-xs font-bold text-gray-600 transition-colors"
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-[13px] font-bold text-[#e5007d]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-[9px] text-gray-400">
                        {formatPrice(item.price)} / 1 шт
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
                  title="Удалить из корзины"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-gray-100"></div>

          <div className="flex items-center justify-between">
            <div className="text-[14px]">
              <span className="text-gray-500 font-medium">Всего :</span>
              <span className="font-extrabold text-gray-900 ml-2">
                {formatPrice(total)}
              </span>
            </div>

            <Link
              href="/buynow"
              onClick={onClose}
              className="bg-[#e5007d] hover:bg-[#c2005d] text-white text-xs font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-pink-200 active:scale-95 uppercase text-center inline-block"
            >
              Перейти к заказу
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
