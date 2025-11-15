import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, MessageSender, Order, OrderItem, OrderStatus, MenuItem } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;
  return (
    <div className={`flex items-end ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${isUser ? 'bg-green-100 dark:bg-green-800 text-gray-800 dark:text-gray-100 rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'}`}>
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <p className="text-xs text-right mt-1 opacity-50">{message.timestamp}</p>
      </div>
    </div>
  );
};

interface CustomerViewProps {
  addOrder: (newOrder: Order) => void;
  getOrderById: (orderId: string) => Order | undefined;
  menuItems: MenuItem[];
}

const CustomerView: React.FC<CustomerViewProps> = ({ addOrder, getOrderById, menuItems }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! 👋 Welcome to La Pizzeria del AI. How can I help you today? You can ask for the menu, add items to your order, or place an order.",
      sender: MessageSender.BOT,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [awaitingOrderConfirmation, setAwaitingOrderConfirmation] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const localFunctions = {
    getMenu: useCallback(async () => {
      const categories = [...new Set(menuItems.map(item => item.category))];
      const menuString = categories.map(category => {
          const itemsInCategory = menuItems
              .filter(item => item.category === category)
              .map(item => `${item.name} - $${item.price.toFixed(2)}\n*${item.description}*`)
              .join('\n');
          return `\n**${category}**\n${itemsInCategory}`;
      }).join('\n');
      return { success: true, message: `Here is our menu:\n${menuString}` };
    }, [menuItems]),
    addToOrder: useCallback(async ({ itemName, quantity }: { itemName: string; quantity: number }) => {
        const item = menuItems.find(m => m.name.toLowerCase() === itemName.toLowerCase());
        if (!item) {
            return { success: false, message: `Sorry, we don't have "${itemName}" on our menu.` };
        }
        const newOrderItem: OrderItem = { name: item.name, quantity, price: item.price };
        setCurrentOrder(prev => {
            const existingItemIndex = prev.findIndex(i => i.name === itemName);
            if (existingItemIndex > -1) {
                const updatedOrder = [...prev];
                updatedOrder[existingItemIndex].quantity += quantity;
                return updatedOrder;
            }
            return [...prev, newOrderItem];
        });
        const orderTotal = currentOrder.reduce((sum, i) => sum + i.price * i.quantity, 0) + newOrderItem.price * newOrderItem.quantity;
        return { success: true, message: `Added ${quantity}x ${itemName} to your order. Your current total is $${orderTotal.toFixed(2)}.` };
    }, [currentOrder, menuItems]),
    placeOrder: useCallback(async () => {
        if (currentOrder.length === 0) {
            return { success: false, message: "Your order is empty. Please add some items before placing an order." };
        }
        setAwaitingOrderConfirmation(true);
        const total = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const summary = currentOrder.map(item => `${item.quantity} x ${item.name}`).join('\n');
        return { 
            success: true, 
            message: `🔔 Order Confirmation 🔔\n\nPlease review your order:\n\n${summary}\n\n**Total: $${total.toFixed(2)}**\n\nIs this correct? (yes/no)` 
        };
    }, [currentOrder]),
    finalizeOrder: useCallback(async () => {
        if (!awaitingOrderConfirmation || currentOrder.length === 0) {
            return { success: false, message: "There is no order to confirm. Please add items to your cart first." };
        }
        const total = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const newOrder: Order = {
            id: Math.random().toString(36).substr(2, 6).toUpperCase(),
            items: currentOrder,
            total,
            status: OrderStatus.PENDING,
            customerName: 'Valued Customer',
            timestamp: new Date(),
        };
        addOrder(newOrder);
        setCurrentOrder([]);
        setAwaitingOrderConfirmation(false);
        return { success: true, message: `Your order has been placed successfully! 🎉 Your order ID is #${newOrder.id}.` };
    }, [currentOrder, addOrder, awaitingOrderConfirmation]),
    cancelOrderPlacement: useCallback(async () => {
        if (!awaitingOrderConfirmation) {
            return { success: false, message: "" };
        }
        setAwaitingOrderConfirmation(false);
        return { success: true, message: "Order placement cancelled. You can continue adding items to your order." };
    }, [awaitingOrderConfirmation]),
    getOrderStatus: useCallback(async ({ orderId }: { orderId: string }) => {
        const order = getOrderById(orderId.replace('#', ''));
        if (order) {
            return { success: true, message: `The status of order #${orderId} is: ${order.status}.` };
        }
        return { success: false, message: `Sorry, I couldn't find an order with the ID #${orderId}.` };
    }, [getOrderById]),
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = {
      text: input,
      sender: MessageSender.USER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponseText = await sendMessageToGemini(input, localFunctions);
      const botMessage: Message = {
        text: botResponseText,
        sender: MessageSender.BOT,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: Message = {
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: MessageSender.BOT,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')" }}>
      <header className="bg-green-700 dark:bg-teal-900 text-white p-3 flex items-center shadow-md z-10">
        <img src="https://picsum.photos/40/40?random=1" alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h2 className="font-semibold text-lg">La Pizzeria del AI</h2>
          <p className="text-sm opacity-80">Online</p>
        </div>
      </header>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-3 rounded-2xl rounded-bl-none">
                    <div className="flex items-center">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-4 py-2">
          <input
            type="text"
            className="flex-grow bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading} className="ml-3 text-green-600 dark:text-green-500 disabled:text-gray-400 p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
       <style>{`
        .typing-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #9CA3AF;
          border-radius: 50%;
          margin: 0 2px;
          animation: typing-animation 1.2s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typing-animation {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
};

export default CustomerView;