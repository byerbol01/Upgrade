'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Truck,
  TrendingUp,
  DollarSign,
  X,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  category: string;
  brand: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  image: string;
  images: string[];
  specs: Record<string, string>;
  featured: boolean;
  isNew: boolean;
}

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
  paymentStatus: 'PENDING' | 'PAID';
  paymentMethod: string;
  deliveryMethod: string;
  totalAmount: number;
  city: string;
  address: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [authChecking, setAuthChecking] = useState(true);

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
        console.error('Admin auth check error:', err);
      } finally {
        setAuthChecking(false);
      }
    }
    initAuth();
  }, [setUser]);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Products state
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');

  // Product Create/Edit Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    slug: '',
    category: 'computers',
    brand: 'ASUS',
    price: 0,
    oldPrice: 0,
    stockCount: 10,
    image: '/images/asus.png',
    description: '',
    featured: false,
    isNew: true,
  });

  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchOrders();
      fetchProducts();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
        setActionMessage({ type: 'success', text: `Статус заказа обновлен на ${newStatus}` });
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!window.confirm(`Вы уверены, что хотите удалить товар "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setActionMessage({ type: 'success', text: 'Товар успешно удален' });
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  const handleOpenProductModal = (product?: ProductItem) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        title: product.title,
        slug: product.slug,
        category: product.category,
        brand: product.brand,
        price: product.price,
        oldPrice: product.oldPrice || 0,
        stockCount: product.stockCount,
        image: product.image,
        description: product.description || '',
        featured: product.featured,
        isNew: product.isNew,
      });
    } else {
      setEditingProduct(null);
      const generatedSlug = 'item-' + Math.floor(1000 + Math.random() * 9000);
      setProductForm({
        title: '',
        slug: generatedSlug,
        category: 'computers',
        brand: 'ASUS',
        price: 15000000,
        oldPrice: 16500000,
        stockCount: 5,
        image: '/images/asus.png',
        description: 'Игровой ПК премиального уровня.',
        featured: false,
        isNew: true,
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const body = {
        ...(editingProduct ? { id: editingProduct.id } : {}),
        ...productForm,
        price: Number(productForm.price),
        oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
        stockCount: Number(productForm.stockCount),
      };

      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsProductModalOpen(false);
        fetchProducts();
        setActionMessage({
          type: 'success',
          text: editingProduct ? 'Товар успешно обновлен' : 'Товар успешно добавлен',
        });
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        const data = await res.json();
        alert(data.error || 'Ошибка сохранения');
      }
    } catch (err) {
      console.error('Save product error:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' сум';
  };

  // Auth check in progress
  if (authChecking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#e5007d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Access check
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="bg-[#111116] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Доступ ограничен</h1>
          <p className="text-gray-400 text-sm mb-6">
            Этот раздел доступен исключительно администраторам магазина Upgrade. Войдите под учетной записью администратора.
          </p>
          <div className="p-3 bg-white/5 rounded-xl text-xs text-left mb-6 text-gray-300">
            <p className="font-semibold text-white mb-1">Данные для входа админа:</p>
            <p>Email: <code className="text-[#ff4da6]">admin@upgrade.uz</code></p>
            <p>Пароль: <code className="text-[#ff4da6]">admin12345password</code></p>
          </div>
          <Link
            href="/"
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#e5007d] to-[#c2005d] text-white font-semibold block transition-all"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  // Summary Metrics
  const totalRevenue = orders
    .filter((o) => o.status === 'COMPLETED' || o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'ALL' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#e5007d]/20 text-[#ff4da6] border border-[#e5007d]/40 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Панель управления
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Upgrade Admin</h1>
          <p className="text-gray-400 text-sm">
            Управление заказами клиентов, товарами и каталогом в реальном времени.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-sm transition-all"
          >
            В личный кабинет
          </Link>
          <button
            onClick={() => {
              fetchOrders();
              fetchProducts();
            }}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 flex items-center gap-2 text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Обновить
          </button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-2 animate-fade-in ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {actionMessage.text}
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111116] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400">Общая выручка</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">{formatPrice(totalRevenue)}</p>
          <p className="text-[11px] text-gray-500 mt-1">Оплаченные и завершенные заказы</p>
        </div>

        <div className="bg-[#111116] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400">Всего заказов</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{orders.length}</p>
          <p className="text-[11px] text-gray-500 mt-1">В базе данных</p>
        </div>

        <div className="bg-[#111116] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400">Товаров в каталоге</span>
            <div className="w-8 h-8 rounded-lg bg-[#e5007d]/10 text-[#e5007d] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{products.length}</p>
          <p className="text-[11px] text-gray-500 mt-1">Доступно для покупки</p>
        </div>

        <div className="bg-[#111116] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400">Активных заказов</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {orders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Требуют обработки</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 pb-3 px-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'orders'
              ? 'border-[#e5007d] text-white'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Заказы клиентов ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 pb-3 px-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] ${
            activeTab === 'products'
              ? 'border-[#e5007d] text-white'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Управление товарами ({products.length})
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Поиск по номеру или клиенту..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#e5007d]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-gray-400">Статус:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#111116] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e5007d]"
              >
                <option value="ALL">Все статусы</option>
                <option value="PENDING">В ожидании</option>
                <option value="PROCESSING">В обработке</option>
                <option value="SHIPPED">Отправлен</option>
                <option value="COMPLETED">Выполнен</option>
                <option value="CANCELLED">Отменен</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-[#111116] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.02] border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">№ Заказа</th>
                    <th className="py-3 px-4">Клиент</th>
                    <th className="py-3 px-4">Сумма</th>
                    <th className="py-3 px-4">Оплата</th>
                    <th className="py-3 px-4">Статус</th>
                    <th className="py-3 px-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loadingOrders ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        Загрузка заказов...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        Заказы не найдены
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-white text-xs">
                          {order.orderNumber}
                          <div className="text-[10px] text-gray-500 font-sans">
                            {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <p className="font-semibold text-white">{order.customerName}</p>
                          <p className="text-gray-400 text-[11px]">{order.customerPhone}</p>
                          <p className="text-gray-500 text-[10px]">{order.city}</p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#e5007d] text-xs whitespace-nowrap">
                          {formatPrice(order.totalAmount)}
                          <div className="text-[10px] text-gray-500 font-normal">
                            {order.items.length} поз.
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              order.paymentStatus === 'PAID'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {order.paymentStatus === 'PAID' ? 'Оплачено' : 'Ожидает'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#e5007d]"
                          >
                            <option value="PENDING">В ожидании</option>
                            <option value="PROCESSING">В обработке</option>
                            <option value="SHIPPED">Отправлен</option>
                            <option value="COMPLETED">Выполнен</option>
                            <option value="CANCELLED">Отменен</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                            title="Посмотреть детали"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Поиск по названию или бренду..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#e5007d]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="bg-[#111116] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e5007d]"
              >
                <option value="ALL">Все категории</option>
                <option value="computers">Игровые ПК</option>
                <option value="laptops">Ноутбуки</option>
                <option value="monitors">Мониторы</option>
                <option value="components">Комплектующие</option>
                <option value="accessories">Аксессуары</option>
              </select>

              <button
                onClick={() => handleOpenProductModal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e5007d] to-[#c2005d] text-white font-semibold text-xs shadow-lg hover:shadow-pink-500/25 transition-all"
              >
                <Plus className="w-4 h-4" /> Добавить товар
              </button>
            </div>
          </div>

          {/* Products Grid / Table */}
          <div className="bg-[#111116] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.02] border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Товар</th>
                    <th className="py-3 px-4">Категория</th>
                    <th className="py-3 px-4">Бренд</th>
                    <th className="py-3 px-4">Цена</th>
                    <th className="py-3 px-4">Остаток</th>
                    <th className="py-3 px-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loadingProducts ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        Загрузка товаров...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        Товары не найдены
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image || '/images/default.png'}
                              alt={p.title}
                              className="w-10 h-10 rounded-lg object-contain bg-black/40 p-1 border border-white/10 shrink-0"
                            />
                            <div className="max-w-xs">
                              <p className="font-semibold text-white text-xs truncate">{p.title}</p>
                              <p className="text-gray-500 text-[10px] truncate">{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-300 capitalize">{p.category}</td>
                        <td className="py-3 px-4 text-xs text-gray-300 font-semibold">{p.brand}</td>
                        <td className="py-3 px-4 text-xs font-bold text-[#e5007d] whitespace-nowrap">
                          {formatPrice(p.price)}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-300">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              p.stockCount > 0
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {p.stockCount} шт.
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleOpenProductModal(p)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                              title="Редактировать"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.title)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111116] border border-white/15 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Заказ {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-gray-400">
                  Создан: {new Date(selectedOrder.createdAt).toLocaleString('ru-RU')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs text-gray-300">
              <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Получатель</p>
                <p className="font-semibold text-white">{selectedOrder.customerName}</p>
                <p>{selectedOrder.customerPhone}</p>
                <p>{selectedOrder.customerEmail}</p>
              </div>
              <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Доставка и оплата</p>
                <p>{selectedOrder.city}, {selectedOrder.address}</p>
                <p className="text-gray-400 mt-1">
                  Метод: {selectedOrder.deliveryMethod} | Оплата: {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>

            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Товары в заказе
            </h4>
            <div className="space-y-2 mb-6">
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-9 h-9 rounded object-contain bg-black/40 p-0.5 border border-white/10"
                    />
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-gray-400 text-[11px]">
                        {item.quantity} шт. × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-white">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-sm font-medium text-gray-400">Итоговая сумма:</span>
              <span className="text-xl font-extrabold text-[#e5007d]">
                {formatPrice(selectedOrder.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111116] border border-white/15 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-400 mb-1">Название товара</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="Игровой ПК ASUS ROG Strix..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#e5007d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    required
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#e5007d]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Бренд</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="ASUS, MSI, HyperX..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#e5007d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Категория</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#17171e] border border-white/10 text-white focus:outline-none focus:border-[#e5007d]"
                  >
                    <option value="computers">Игровые ПК</option>
                    <option value="laptops">Ноутбуки</option>
                    <option value="monitors">Мониторы</option>
                    <option value="components">Комплектующие</option>
                    <option value="accessories">Аксессуары</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Количество на складе</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stockCount}
                    onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5007d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Цена (UZS)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5007d]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Старая цена (необязательно)</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5007d]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-400 mb-1">Путь к изображению</label>
                <input
                  type="text"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="/images/asus.png"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#e5007d]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-400 mb-1">Описание</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Подробное описание характеристик товара..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#e5007d] resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="rounded accent-[#e5007d]"
                  />
                  <span>Рекомендованный (Хит)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={productForm.isNew}
                    onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                    className="rounded accent-[#e5007d]"
                  />
                  <span>Новинка</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all text-xs"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e5007d] to-[#c2005d] text-white font-semibold text-xs shadow-lg hover:shadow-pink-500/25 transition-all"
                >
                  {editingProduct ? 'Сохранить изменения' : 'Создать товар'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
