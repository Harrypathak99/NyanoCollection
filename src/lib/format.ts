// Prices are in Nepali rupees, shown as "Rs. 1,250" (paisa only when not whole).
export const CURRENCY_SYMBOL = "Rs.";
const LOCALE = "en-US";

// Must match the delivery rule in the place_order database function.
export const FREE_SHIPPING_OVER = 1000;
export const DELIVERY_FEE = 100;

// en-IN grouping matches Nepali style: 1,00,000
const whole = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const withPaisa = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatPrice(value: number | string) {
  const n = Number(value);
  return `${CURRENCY_SYMBOL} ${(Number.isInteger(n) ? whole : withPaisa).format(n)}`;
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
