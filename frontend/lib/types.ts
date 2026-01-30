export type Role = "ADMIN" | "VENDOR" | "CUSTOMER";

export type User = {
  id: string;
  email: string;
  role: Role;
};

export type ApiResponse<T> = {
  ok?: boolean;
  data: T;
  message?: string;
};

export type Vendor = {
  id: string;
  name: string;
  slug: string;
  status: "PENDING" | "APPROVED" | "SUSPENDED";
};

export type Product = {
  id: string;
  title: string;
  description?: string | null;
  sku?: string | null;
  price: number;
  currency?: string;
  stock: number;
  status: "DRAFT" | "ACTIVE" | "BLOCKED";
  vendor?: { id: string; name: string; slug: string };
};

export type OrderItemInput = { productId: string; qty: number };

export type Order = {
  id: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED" | "REFUNDED";
  totalAmount: number;
  currency: string;
  shippingAddressJson?: any;
  createdAt: string;
};
