// Change these to switch the shop currency (e.g. "NPR" / "en-NP").
export const CURRENCY = "USD";
const LOCALE = "en-US";

// Must match the delivery rule in the place_order database function.
export const FREE_SHIPPING_OVER = 50;
export const DELIVERY_FEE = 5;

const formatter = new Intl.NumberFormat(LOCALE, { style: "currency", currency: CURRENCY });

export function formatPrice(value: number | string) {
  return formatter.format(Number(value));
}

export function deliveryFeeFor(subtotal: number) {
  return subtotal >= FREE_SHIPPING_OVER || subtotal === 0 ? 0 : DELIVERY_FEE;
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString(LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
