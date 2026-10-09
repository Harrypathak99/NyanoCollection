"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  color: string | null;
  quantity: number;
};

export type SavedProduct = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
};

type StoreState = {
  ready: boolean;
  cart: CartItem[];
  wishlist: SavedProduct[];
  compare: SavedProduct[];
  cartCount: number;
  cartSubtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: string, color: string | null, quantity: number) => void;
  removeFromCart: (productId: string, color: string | null) => void;
  clearCart: () => void;
  toggleWishlist: (item: SavedProduct) => void;
  inWishlist: (productId: string) => boolean;
  toggleCompare: (item: SavedProduct) => void;
  inCompare: (productId: string) => boolean;
};

const StoreContext = createContext<StoreState | null>(null);

const KEYS = { cart: "nyano-cart", wishlist: "nyano-wishlist", compare: "nyano-compare" };
const MAX_COMPARE = 4;

function load<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be blocked (private mode); the cart still works for this visit.
  }
}

const sameLine = (item: CartItem, productId: string, color: string | null) =>
  item.productId === productId && item.color === color;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<SavedProduct[]>([]);
  const [compare, setCompare] = useState<SavedProduct[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read browser storage after hydration
    setCart(load<CartItem>(KEYS.cart));
    setWishlist(load<SavedProduct>(KEYS.wishlist));
    setCompare(load<SavedProduct>(KEYS.compare));
    setReady(true);

    // Keep tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEYS.cart) setCart(load(KEYS.cart));
      if (e.key === KEYS.wishlist) setWishlist(load(KEYS.wishlist));
      if (e.key === KEYS.compare) setCompare(load(KEYS.compare));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (ready) save(KEYS.cart, cart);
  }, [cart, ready]);
  useEffect(() => {
    if (ready) save(KEYS.wishlist, wishlist);
  }, [wishlist, ready]);
  useEffect(() => {
    if (ready) save(KEYS.compare, compare);
  }, [compare, ready]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => sameLine(i, item.productId, item.color));
      if (existing) {
        return prev.map((i) =>
          sameLine(i, item.productId, item.color) ? { ...i, quantity: Math.min(99, i.quantity + quantity) } : i,
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setCartOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, color: string | null, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => !sameLine(i, productId, color))
        : prev.map((i) => (sameLine(i, productId, color) ? { ...i, quantity: Math.min(99, quantity) } : i)),
    );
  }, []);

  const removeFromCart = useCallback((productId: string, color: string | null) => {
    setCart((prev) => prev.filter((i) => !sameLine(i, productId, color)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((item: SavedProduct) => {
    setWishlist((prev) =>
      prev.some((i) => i.productId === item.productId)
        ? prev.filter((i) => i.productId !== item.productId)
        : [...prev, item],
    );
  }, []);

  const toggleCompare = useCallback((item: SavedProduct) => {
    setCompare((prev) => {
      if (prev.some((i) => i.productId === item.productId)) return prev.filter((i) => i.productId !== item.productId);
      return [...prev, item].slice(-MAX_COMPARE);
    });
  }, []);

  const value = useMemo<StoreState>(
    () => ({
      ready,
      cart,
      wishlist,
      compare,
      cartCount: cart.reduce((n, i) => n + i.quantity, 0),
      cartSubtotal: cart.reduce((n, i) => n + i.price * i.quantity, 0),
      cartOpen,
      setCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      inWishlist: (id) => wishlist.some((i) => i.productId === id),
      toggleCompare,
      inCompare: (id) => compare.some((i) => i.productId === id),
    }),
    [ready, cart, wishlist, compare, cartOpen, addToCart, updateQuantity, removeFromCart, clearCart, toggleWishlist, toggleCompare],
  );

  return <StoreContext value={value}>{children}</StoreContext>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
