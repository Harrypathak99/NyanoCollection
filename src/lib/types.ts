export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  product_count: number;
};

export type ProductImage = {
  url: string;
  alt: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  colors: string[];
  scent: string | null;
  burn_time: string | null;
  weight: string | null;
  is_featured: boolean;
  is_special: boolean;
  special_ends_at: string | null;
  sort_order: number;
  created_at: string;
  category: { name: string; slug: string } | null;
  images: ProductImage[];
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  id?: string;
  product_name: string;
  product_image: string | null;
  color: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export type Order = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  order_items?: OrderItem[];
};

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "name";
