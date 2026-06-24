export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviews: Review[];
  images: string[];
  inventory: number;
  material?: string;
  style?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  billingAddress: Address;
  paymentMethod: 'Credit Card' | 'UPI' | 'Net Banking' | 'Cash on Delivery';
  status: 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';
  trackingNumber?: string;
  date: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Customer' | 'Admin';
  addresses?: Address[];
  wishlist?: string[]; // IDs of products
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  active: boolean;
  description: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
