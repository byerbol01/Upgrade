'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { CheckCircle2, ShoppingBag, Truck, CreditCard, MapPin, Phone, User, Mail, ShieldCheck } from 'lucide-react';

export default function BuyNowPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart, user } = useStore();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+998 ');
  const [city, setCity] = useState('г. Ташкент');
  const [address, setAddress] = useState(user?.address || '');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'STANDARD' | 'EXPRESS' | 'PICKUP'>('STANDARD');
  const [paymentOption, setPaymentOption] = useState<'cod' | 'card' | 'paypal' | 'apple-pay' | 'google-pay'>('cod');

  // Card demo fields
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Sync with user session if available
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name || '');
      if (!customerEmail) setCustomerEmail(user.email || '');
      if (!customerPhone || customerPhone === '+998 ') setCustomerPhone(user.phone || '+998 ');
      if (!address) setAddress(user.address || '');
    }
  }, [user]);

  const cartTotal = getCartTotal();

  const deliveryCost = deliveryMethod === 'EXPRESS' ? 50000 : deliveryMethod === 'STANDARD' ? 0 : 0;
  const finalTotal = cartTotal + deliveryCost;

  const formatPrice = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' UZS';
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cart.length === 0) {
      setError('Ваша корзина пуста. Добавьте товары перед оформлением.');
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !address.trim()) {
      setError('Пожалуйста, заполните все обязательные поля (Имя, Email, Телефон, Адрес).');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName,
        customerEmail,
        customerPhone,
        city,
        address,
        deliveryNotes,
        deliveryMethod,
        paymentMethod: paymentOption === 'cod' ? 'Оплата при получении' : `Карта/Онлайн (${paymentOption})`,
        items: cart.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка при сохранении заказа');
      }

      setCompletedOrder(data.order);
      clearCart();
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при оформлении заказа');
    } finally {
      setLoading(false);
    }
  };

  // Order Confirmed Screen
  if (completedOrder) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <span className="bg-pink-50 text-[#e5007d] font-bold text-xs uppercase px-3 py-1 rounded-full">
            Заказ принят
          </span>

          <h1 className="text-3xl font-black text-gray-900 mt-3 mb-2 tracking-tight">
            Спасибо за ваш заказ!
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Ваш заказ успешно зарегистрирован в базе данных. Наш менеджер свяжется с вами по указанному телефону для подтверждения доставки.
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 text-left max-w-lg mx-auto mb-8 space-y-3 border border-gray-100">
            <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
              <span className="text-gray-500">Номер заказа:</span>
              <span className="font-extrabold text-[#e5007d] text-base">{completedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Получатель:</span>
              <span className="font-bold text-gray-800">{completedOrder.customerName}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Телефон:</span>
              <span className="font-bold text-gray-800">{completedOrder.customerPhone}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Адрес доставки:</span>
              <span className="font-bold text-gray-800">{completedOrder.city}, {completedOrder.address}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Способ оплаты:</span>
              <span className="font-bold text-gray-800">{completedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-900">Итоговая сумма:</span>
              <span className="font-black text-[#e5007d] text-lg">{formatPrice(completedOrder.totalAmount)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile"
              className="bg-gray-900 hover:bg-[#e5007d] text-white text-xs font-bold py-3.5 px-8 rounded-xl transition-all uppercase shadow-md"
            >
              Смотреть мои заказы
            </Link>
            <Link
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-3.5 px-8 rounded-xl transition-all uppercase"
            >
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1480px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#e5007d]">Главная</Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-bold">Оформление заказа</span>
      </div>

      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">
        Оформление заказа
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-semibold max-w-4xl">
          {error}
        </div>
      )}

      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact info & Delivery */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Contact Information */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
              <User className="w-5 h-5 text-[#e5007d]" />
              1. Контактные данные
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ФИО получателя *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Иван Иванов"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-11 px-3 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#e5007d] focus:border-[#e5007d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Номер телефона *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123-45-67"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full h-11 px-3 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#e5007d] focus:border-[#e5007d]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email для уведомлений *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full h-11 px-3 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#e5007d] focus:border-[#e5007d]"
                />
              </div>
            </div>
          </div>

          {/* 2. Delivery Options */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
              <Truck className="w-5 h-5 text-[#e5007d]" />
              2. Способ доставки
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label
                onClick={() => setDeliveryMethod('STANDARD')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  deliveryMethod === 'STANDARD'
                    ? 'border-[#e5007d] bg-pink-50/40 text-gray-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <p className="font-bold text-sm">Стандартная</p>
                  <p className="text-[11px] text-gray-500 mt-1">1-2 дня по Ташкенту</p>
                </div>
                <p className="text-xs font-extrabold text-[#e5007d] mt-3">Бесплатно</p>
              </label>

              <label
                onClick={() => setDeliveryMethod('EXPRESS')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  deliveryMethod === 'EXPRESS'
                    ? 'border-[#e5007d] bg-pink-50/40 text-gray-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <p className="font-bold text-sm">Экспресс</p>
                  <p className="text-[11px] text-gray-500 mt-1">В течение 2 часов</p>
                </div>
                <p className="text-xs font-extrabold text-[#e5007d] mt-3">50 000 UZS</p>
              </label>

              <label
                onClick={() => setDeliveryMethod('PICKUP')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  deliveryMethod === 'PICKUP'
                    ? 'border-[#e5007d] bg-pink-50/40 text-gray-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <p className="font-bold text-sm">Самовывоз</p>
                  <p className="text-[11px] text-gray-500 mt-1">ул. Навои 37, Магазин 24</p>
                </div>
                <p className="text-xs font-extrabold text-green-600 mt-3">Сегодня</p>
              </label>
            </div>

            {deliveryMethod !== 'PICKUP' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Город *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-11 px-3 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#e5007d] focus:border-[#e5007d]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Адрес (улица, дом, квартира) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ул. Амира Темура, д. 15, кв. 42"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-11 px-3 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#e5007d] focus:border-[#e5007d]"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Комментарий для курьера (домофон, этаж, ориентир)
                  </label>
                  <input
                    type="text"
                    placeholder="Например: подъезд 2, этаж 4, позвонить за час"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full h-11 px-3 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-[#e5007d] focus:border-[#e5007d]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Items Summary in Order */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#e5007d]" />
                Товары в заказе ({cart.length})
              </span>
              <Link href="/igrovye-sborki" className="text-xs text-[#e5007d] hover:underline font-semibold lowercase">
                + добавить еще
              </Link>
            </h2>

            {cart.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">Корзина пуста</p>
            ) : (
              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto custom-scroll pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg p-1 flex items-center justify-center border border-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 line-clamp-1">{item.title}</p>
                        <p className="text-gray-400 mt-0.5">{item.quantity} шт. × {formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Original Payment Modal Card Preserved 1:1! */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="modal modal121 w-full mx-auto p-6 md:p-8">
            <h3 className="font-extrabold text-base uppercase text-gray-900 mb-3 flex items-center justify-between">
              <span>Способ оплаты</span>
              <ShieldCheck className="w-5 h-5 text-green-500" />
            </h3>

            {/* Original Payment Provider Buttons */}
            <div className="payment--options">
              <button
                type="button"
                onClick={() => setPaymentOption('paypal')}
                className={paymentOption === 'paypal' ? 'active' : ''}
                title="PayPal"
              >
                <span className="font-bold text-blue-900 text-xs">PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentOption('apple-pay')}
                className={paymentOption === 'apple-pay' ? 'active' : ''}
                title="Apple Pay"
              >
                <span className="font-bold text-gray-900 text-xs">Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentOption('google-pay')}
                className={paymentOption === 'google-pay' ? 'active' : ''}
                title="Google Pay"
              >
                <span className="font-bold text-gray-700 text-xs">G Pay</span>
              </button>
            </div>

            {/* Cash on delivery button option */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setPaymentOption('cod')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-between ${
                  paymentOption === 'cod'
                    ? 'border-[#e5007d] bg-pink-50 text-[#e5007d]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>Оплата при получении (Наличные / Терминал)</span>
                <span className="text-base">✓</span>
              </button>
            </div>

            <div className="separator my-4">
              <hr className="line" />
              <p>или банковской картой</p>
              <hr className="line" />
            </div>

            {/* Original Credit Card Info Form */}
            <div className="credit-card-info--form">
              <div className="input_container">
                <label className="input_label">Имя на карте</label>
                <input
                  className="input_field"
                  type="text"
                  placeholder="IVAN IVANOV"
                  value={cardHolder}
                  onChange={(e) => {
                    setCardHolder(e.target.value);
                    if (paymentOption === 'cod') setPaymentOption('card');
                  }}
                />
              </div>

              <div className="input_container">
                <label className="input_label">Номер карты</label>
                <input
                  className="input_field"
                  type="text"
                  placeholder="8600 0000 0000 0000"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => {
                    setCardNumber(e.target.value);
                    if (paymentOption === 'cod') setPaymentOption('card');
                  }}
                />
              </div>

              <div className="split">
                <div className="input_container">
                  <label className="input_label">Срок действия</label>
                  <input
                    className="input_field"
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
                <div className="input_container">
                  <label className="input_label">CVV / CVC</label>
                  <input
                    className="input_field"
                    type="password"
                    placeholder="123"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Total calculation summary */}
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Товары ({cart.length}):</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Доставка:</span>
                <span>{deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                <span>К оплате:</span>
                <span className="text-[#e5007d] text-base">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="purchase--btn w-full"
              >
                {loading ? 'Оформление заказа...' : `Подтвердить заказ • ${formatPrice(finalTotal)}`}
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-3 leading-tight">
              Нажимая «Подтвердить заказ», вы соглашаетесь с условиями публичной оферты UPGRADE.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
