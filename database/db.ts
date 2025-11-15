import { MenuItem, Order, OrderStatus, User, UserRole } from '../types';

export const INITIAL_MENU: MenuItem[] = [
  { id: 'prod-1', name: 'Margherita Pizza', category: 'Pizza', price: 12.99, description: 'Classic cheese and tomato pizza.' },
  { id: 'prod-2', name: 'Pepperoni Pizza', category: 'Pizza', price: 14.99, description: 'Pizza with pepperoni slices.' },
  { id: 'prod-3', name: 'Vegetable Pizza', category: 'Pizza', price: 13.99, description: 'Pizza with assorted vegetables.' },
  { id: 'prod-4', name: 'Spaghetti Carbonara', category: 'Pasta', price: 15.99, description: 'Pasta with eggs, cheese, and pancetta.' },
  { id: 'prod-5', name: 'Lasagna', category: 'Pasta', price: 16.99, description: 'Layered pasta with meat and cheese.' },
  { id: 'prod-6', name: 'Caesar Salad', category: 'Salads', price: 9.99, description: 'Fresh romaine with Caesar dressing.' },
  { id: 'prod-7', name: 'Tiramisu', category: 'Desserts', price: 7.99, description: 'Coffee-flavoured Italian dessert.' },
  { id: 'prod-8', name: 'Coca-Cola', category: 'Drinks', price: 2.50, description: 'Classic Coca-Cola.' },
  { id: 'prod-9', name: 'Water', category: 'Drinks', price: 1.50, description: 'Bottled mineral water.' },
];

const now = new Date();
export const INITIAL_ORDERS: Order[] = [
    {
        id: 'A5B2C1',
        items: [
            { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
            { name: 'Coca-Cola', quantity: 2, price: 2.50 },
        ],
        total: 17.99,
        status: OrderStatus.DELIVERED,
        customerName: 'Valued Customer',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        estimatedDeliveryTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    },
    {
        id: 'D3E4F5',
        items: [
            { name: 'Pepperoni Pizza', quantity: 1, price: 14.99 },
            { name: 'Lasagna', quantity: 1, price: 16.99 },
            { name: 'Tiramisu', quantity: 1, price: 7.99 },
        ],
        total: 39.97,
        status: OrderStatus.PREPARING,
        customerName: 'Valued Customer',
        timestamp: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
        estimatedDeliveryTime: new Date(now.getTime() + 15 * 60 * 1000),
    },
     {
        id: 'G6H7I8',
        items: [
            { name: 'Spaghetti Carbonara', quantity: 2, price: 15.99 },
        ],
        total: 31.98,
        status: OrderStatus.PENDING,
        customerName: 'Valued Customer',
        timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
        estimatedDeliveryTime: new Date(now.getTime() + 25 * 60 * 1000),
    }
];

export const INITIAL_USERS: User[] = [
  { id: 'user-1', name: 'Stanley Owner', email: 'stanley@restaurant.com', role: UserRole.ADMIN },
  { id: 'user-2', name: 'Jane Staff', email: 'jane.d@restaurant.com', role: UserRole.STAFF },
];
