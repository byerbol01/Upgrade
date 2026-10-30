'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Package,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  LogOut,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: string;
  paymentMethod: string;
  deliveryMethod: string;
  totalAmount: number;
  city: string;
  address: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, openAuthModal } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [authChecking, setAuthChecking] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Profile form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function initAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error('Profile auth check error:', err);
      } finally {
        setAuthChecking(false);
      }
    }
    initAuth();
  }, [setUser]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка обновления данных');
      }

      setUser(data.user);
      setProfileMessage({ type: 'success', text: 'Данные профиля успешно сохранены' });
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.message || 'Не удалось сохранить данные' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' сум';
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> В ожидании
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <AlertCircle className="w-3.5 h-3.5" /> В обработке
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Truck className="w-3.5 h-3.5" /> Отправлен в доставку
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Выполнен
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5" /> Отменен
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-300">
            {status}
          </span>
        );
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#e5007d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="bg-[#111116] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-pink-500/10 flex items-center justify-center text-[#e5007d] mb-4">
            <UserIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Личный кабинет</h1>
          <p className="text-gray-400 text-sm mb-6">
            Для просмотра истории заказов и управления профилем выполните вход в свой аккаунт Upgrade.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#e5007d] to-[#c2005d] text-white font-semibold shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              Войти в аккаунт
            </button>
            <Link
              href="/"
              className="w-full py-3 px-6 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-[#17171e] via-[#1f1f2a] to-[#17171e] border border-white/10 rounded-2xl p-6 md:p-8 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-[#e5007d] to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-pink-500/20">
              {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  {user.name || 'Пользователь Upgrade'}
                </h1>
                {user.role === 'ADMIN' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e5007d]/20 text-[#ff4da6] border border-[#e5007d]/40">
                    <ShieldCheck className="w-3.5 h-3.5" /> ADMIN
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#e5007d] text-white font-medium text-sm shadow-lg hover:brightness-110 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                Панель администратора
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
            >
              <LogOut className="w-4 h-4 text-gray-400" />
              Выйти
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 pb-4 px-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'orders'
              ? 'border-[#e5007d] text-white'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Мои заказы
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/10 text-gray-300 font-mono">
            {orders.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 pb-4 px-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'profile'
              ? 'border-[#e5007d] text-white'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          Личные данные
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          {loadingOrders ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#e5007d] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400 text-sm">Загружаем список ваших заказов...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-[#111116] border border-white/10 rounded-2xl p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">У вас пока нет заказов</h3>
              <p className="text-gray-400 text-sm mb-6">
                Выберите понравившиеся игровые ПК, мониторы или комплектующие в нашем каталоге.
              </p>
              <Link
                href="/igrovye-sborki"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#e5007d] to-[#c2005d] text-white font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all text-sm"
              >
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                return (
                  <div
                    key={order.id}
                    className="bg-[#111116] border border-white/10 rounded-2xl overflow-hidden transition-all duration-200 hover:border-white/20"
                  >
                    {/* Order summary header */}
                    <div
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="p-5 md:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-white/[0.02]"
                    >
                      <div className="flex items-start md:items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#e5007d]/10 border border-[#e5007d]/30 flex items-center justify-center text-[#e5007d] shrink-0">
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-white text-base">
                              {order.orderNumber}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-gray-400 text-xs">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                        <div className="text-left md:text-right">
                          <p className="text-xs text-gray-400">Сумма заказа</p>
                          <p className="text-lg font-extrabold text-[#e5007d]">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Details (Expandable) */}
                    {isExpanded && (
                      <div className="px-5 md:px-6 pb-6 pt-2 border-t border-white/10 bg-[#0d0d12]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 p-4 rounded-xl bg-white/[0.03] text-sm text-gray-300">
                          <div>
                            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#e5007d]" /> Доставка
                            </h4>
                            <p className="text-xs text-gray-400">
                              <span className="text-gray-200">Получатель:</span> {order.customerName}
                            </p>
                            <p className="text-xs text-gray-400">
                              <span className="text-gray-200">Телефон:</span> {order.customerPhone}
                            </p>
                            <p className="text-xs text-gray-400">
                              <span className="text-gray-200">Город / Адрес:</span> {order.city},{' '}
                              {order.address}
                            </p>
                            <p className="text-xs text-gray-400">
                              <span className="text-gray-200">Способ:</span>{' '}
                              {order.deliveryMethod === 'EXPRESS'
                                ? 'Срочная доставка'
                                : order.deliveryMethod === 'PICKUP'
                                ? 'Самовывоз из шоурума'
                                : 'Стандартная доставка'}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-2">Оплата</h4>
                            <p className="text-xs text-gray-400">
                              <span className="text-gray-200">Способ оплаты:</span>{' '}
                              {order.paymentMethod === 'COD'
                                ? 'Оплата при получении'
                                : order.paymentMethod}
                            </p>
                            <p className="text-xs text-gray-400">
                              <span className="text-gray-200">Статус оплаты:</span>{' '}
                              <span className="text-amber-400 font-medium">
                                {order.paymentStatus === 'PAID' ? 'Оплачено' : 'Ожидает оплаты'}
                              </span>
                            </p>
                          </div>
                        </div>

                        <h4 className="text-sm font-semibold text-white mb-3">Состав заказа</h4>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image || '/images/default.png'}
                                  alt={item.title}
                                  className="w-12 h-12 rounded-lg object-contain bg-[#111116] p-1 border border-white/10"
                                />
                                <div>
                                  <p className="text-sm font-medium text-white line-clamp-1">
                                    {item.title}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {item.quantity} шт. × {formatPrice(item.price)}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-white whitespace-nowrap">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Profile Form Tab */}
      {activeTab === 'profile' && (
        <div className="bg-[#111116] border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto shadow-xl">
          <h2 className="text-xl font-bold text-white mb-1">Личные данные</h2>
          <p className="text-gray-400 text-sm mb-6">
            Управляйте своими контактными данными для быстрого оформления заказов в Upgrade.
          </p>

          {profileMessage && (
            <div
              className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-2 ${
                profileMessage.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {profileMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              {profileMessage.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Ваше Имя
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Иванов"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#e5007d] transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 cursor-not-allowed text-sm"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Email привязан к вашей учетной записи</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Номер телефона
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#e5007d] transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Адрес доставки по умолчанию
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="г. Ташкент, ул. Амира Темура, д. 45"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#e5007d] transition-colors text-sm resize-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#e5007d] to-[#c2005d] text-white font-semibold shadow-lg hover:shadow-pink-500/25 transition-all disabled:opacity-50 text-sm"
              >
                {savingProfile ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
