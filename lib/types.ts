export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  oldPrice?: number | null;
  category: string;
  brand: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  specs: Record<string, string>;
  featured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  brand?: string;
  quantity: number;
}

export interface UserSession {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  role: 'USER' | 'ADMIN';
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  address: string;
  deliveryNotes?: string | null;
  deliveryMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface PCComponent {
  id: string;
  type: 'cpu' | 'motherboard' | 'ram' | 'gpu' | 'ssd' | 'psu' | 'case';
  name: string;
  price: number;
  image?: string;
  brand: string;
  socket?: string;
  ramType?: string;
  powerUsage?: number;
  wattage?: number;
  capacity?: string;
  inStock: boolean;
}
