"use client";

import { useEffect } from "react";
import { useStore } from "@/components/store-provider";

export function ClearCart() {
  const { ready, clearCart } = useStore();
  useEffect(() => {
    if (ready) clearCart();
  }, [ready, clearCart]);
  return null;
}
