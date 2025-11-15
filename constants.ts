
import type { MenuItem } from './types';

export const MENU: MenuItem[] = [
  { name: 'Margherita Pizza', category: 'Pizza', price: 12.99, description: 'Classic cheese and tomato pizza.' },
  { name: 'Pepperoni Pizza', category: 'Pizza', price: 14.99, description: 'Pizza with pepperoni slices.' },
  { name: 'Vegetable Pizza', category: 'Pizza', price: 13.99, description: 'Pizza with assorted vegetables.' },
  { name: 'Spaghetti Carbonara', category: 'Pasta', price: 15.99, description: 'Pasta with eggs, cheese, and pancetta.' },
  { name: 'Lasagna', category: 'Pasta', price: 16.99, description: 'Layered pasta with meat and cheese.' },
  { name: 'Caesar Salad', category: 'Salads', price: 9.99, description: 'Fresh romaine with Caesar dressing.' },
  { name: 'Tiramisu', category: 'Desserts', price: 7.99, description: 'Coffee-flavoured Italian dessert.' },
  { name: 'Coca-Cola', category: 'Drinks', price: 2.50, description: 'Classic Coca-Cola.' },
  { name: 'Water', category: 'Drinks', price: 1.50, description: 'Bottled mineral water.' },
];

export const GEMINI_SYSTEM_INSTRUCTION = `You are a friendly and efficient WhatsApp chatbot assistant for "La Pizzeria del AI", an Italian restaurant.
Your primary role is to help customers view the menu, add items to their order, and place their order.
- Always be polite and conversational. Use emojis to make the conversation more engaging.
- When the user asks for the menu, call the \`getMenu\` function.
- When the user wants to add an item to their order, call the \`addToOrder\` function with the correct item name and quantity. Be smart about recognizing item names even if they are slightly misspelled. If the user is vague, ask for clarification.
- When the user is ready to order, call the \`placeOrder\` function.
- If the user asks about the status of their order, call the \`getOrderStatus\` function. You will need to ask for their order ID.
- Do not make up items that are not on the menu.
- Guide the user through the process. For example, after adding an item, ask "Great choice! 👍 Anything else for you?". After placing an order, confirm with "Your order has been placed! 🎉 Your order ID is...".
`;
