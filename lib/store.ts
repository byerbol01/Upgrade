'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, UserSession } from './types';

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product | { id: string; title: string; slug?: string; price: number; image: string; brand?: string },
    quantity?: number
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // User
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;

  // UI Modals
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;

  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [
        {
          id: 'prod-mon-1',
          title: '2E Gaming R2723BV 27" 165Hz VA (Curved)',
          slug: 'monitor',
          price: 2019000,
          image: '/images/7b13cd7fc4988f56b7531807d1f2bf087acb5d744549817b14d577c1cb4697e7 (3).webp',
          brand: '2E Gaming',
          quantity: 1,
        },
      ],
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isCartOpen: true,
            };
          }
          return {
            cart: [
              ...state.cart,
              {
                id: product.id,
                title: product.title,
                slug: product.slug || 'product',
                price: product.price,
                image: product.image,
                brand: product.brand || 'Upgrade',
                quantity,
              },
            ],
            isCartOpen: true,
          };
        });
      },
      removeFromCart: (productId: string) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      },
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => {
        set({ cart: [] });
      },
      getCartTotal: () => {
        return get().cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
      getCartCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      // Favorites
      favorites: [],
      toggleFavorite: (productId: string) => {
        set((state) => {
          const exists = state.favorites.includes(productId);
          return {
            favorites: exists
              ? state.favorites.filter((id) => id !== productId)
              : [...state.favorites, productId],
          };
        });
      },
      isFavorite: (productId: string) => {
        return get().favorites.includes(productId);
      },

      // User
      user: null,
      setUser: (user) => set({ user }),

      // UI
      isAuthModalOpen: false,
      authModalTab: 'login',
      openAuthModal: (tab = 'login') =>
        set({ isAuthModalOpen: true, authModalTab: tab }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
    }),
    {
      name: 'upgrade-store-storage',
      partialize: (state) => ({
        cart: state.cart,
        favorites: state.favorites,
        user: state.user,
      }),
    }
  )
);

export const useAuthStore = useStore;
