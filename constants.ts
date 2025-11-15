import type { MenuItem } from './types';
import { OrderStatus } from './types';

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

export const GEMINI_SYSTEM_INSTRUCTION = `You are a friendly and efficient WhatsApp chatbot assistant for "Welcome to stanleys restaurant", an Italian restaurant.
Your primary role is to help customers view the menu, add items to their order, and place their order.
- Always be polite and conversational. Use emojis to make the conversation more engaging.
- When the user asks for the menu, call the \`getMenu\` function.
- When the user wants to add an item to their order, call the \`addToOrder\` function with the correct item name and quantity. Be smart about recognizing item names even if they are slightly misspelled. If the user is vague, ask for clarification.
- When the user is ready to order, call the \`placeOrder\` function. This will show them a summary of their order for confirmation.
- After presenting the order summary, if the user confirms, you MUST call the \`finalizeOrder\` function to complete the purchase.
- If the user wants to cancel the order placement after seeing the summary, call the \`cancelOrderPlacement\` function.
- If the user asks about the status of their order, call the \`getOrderStatus\` function. You will need to ask for their order ID. When reporting an order's status, if an estimated delivery time is available, please include it in your response.
- If a customer wants to cancel their order, you must first ask for their order ID. Then, call the \`requestCancelOrder\` function. This will start the cancellation process and ask the user for confirmation.
- If the user confirms the cancellation (e.g., by saying "yes"), you must then call the \`confirmCancelOrder\` function.
- If the user decides not to cancel (e.g., by saying "no"), you must call the \`abortCancelOrder\` function.
- Do not make up items that are not on the menu.
- Guide the user through the process. For example, after adding an item, ask "Great choice! 👍 Anything else for you?". After placing an order, confirm with "Your order has been placed! 🎉 Your order ID is...".
`;

export const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [OrderStatus.PREPARING]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  [OrderStatus.OUTFORDELIVERY]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};