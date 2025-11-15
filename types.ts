export enum UserType {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export enum MessageSender {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  text: string;
  sender: MessageSender;
  timestamp: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  PREPARING = 'Preparing',
  OUTFORDELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  timestamp: Date;
  estimatedDeliveryTime: Date;
}

export type Page = 'home' | 'contact' | 'order' | 'admin' | 'gallery';

export interface Notification {
  id: string;
  message: string;
  orderId: string;
}

export enum UserRole {
  ADMIN = 'Admin',
  STAFF = 'Staff',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
