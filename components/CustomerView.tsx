import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, MessageSender, Order, OrderItem, OrderStatus, MenuItem, Notification } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import PastOrdersModal from './PastOrdersModal';

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

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(notification.id);
        }, 7000); // Auto-dismiss after 7 seconds

        return () => clearTimeout(timer);
    }, [notification.id, onDismiss]);

    return (
        <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 w-full max-w-sm pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden animate-toast-in">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Order Update</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button onClick={() => onDismiss(notification.id)} className="inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                        <span className="sr-only">Close</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};


interface CustomerViewProps {
  addOrder: (newOrder: Omit<Order, 'estimatedDeliveryTime'>) => void;
  getOrderById: (orderId: string) => Order | undefined;
  menuItems: MenuItem[];
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const CustomerView: React.FC<CustomerViewProps> = ({ addOrder, getOrderById, menuItems, orders, updateOrderStatus, notifications, removeNotification }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! 👋 Welcome to stanleys restaurant. How can I help you today? You can ask for the menu, add items to your order, or place an order.",
      sender: MessageSender.BOT,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [awaitingOrderConfirmation, setAwaitingOrderConfirmation] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [isPastOrdersModalOpen, setIsPastOrdersModalOpen] = useState(false);
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
        const newOrder: Omit<Order, 'estimatedDeliveryTime'> = {
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
            let message = `The status of order #${orderId} is: ${order.status}.`;
            if ([OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.OUTFORDELIVERY].includes(order.status)) {
                const eta = order.estimatedDeliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                message += ` Estimated delivery is around ${eta}. 🛵`;
            }
            return { success: true, message };
        }
        return { success: false, message: `Sorry, I couldn't find an order with the ID #${orderId}.` };
    }, [getOrderById]),
    requestCancelOrder: useCallback(async ({ orderId }: { orderId: string }) => {
        const cleanOrderId = orderId.replace('#', '').toUpperCase();
        const order = getOrderById(cleanOrderId);
        if (!order) {
            return { success: false, message: `Sorry, I couldn't find an order with the ID #${cleanOrderId}.` };
        }
        if (order.status !== OrderStatus.PENDING) {
            return { success: false, message: `Order #${cleanOrderId} cannot be cancelled because it is already in status "${order.status}". Only pending orders can be cancelled.` };
        }
        setOrderToCancel(order.id);
        return { success: true, message: `Are you sure you want to cancel order #${order.id}? This action cannot be undone. Please reply with "yes" to confirm or "no" to abort.` };
    }, [getOrderById]),
    confirmCancelOrder: useCallback(async () => {
        if (!orderToCancel) {
            return { success: false, message: "There's no active order cancellation to confirm. Please start by requesting to cancel an order first." };
        }
        await updateOrderStatus(orderToCancel, OrderStatus.CANCELLED);
        const cancelledOrderId = orderToCancel;
        setOrderToCancel(null);
        return { success: true, message: `Order #${cancelledOrderId} has been successfully cancelled. We're sorry to see you go!` };
    }, [orderToCancel, updateOrderStatus]),
    abortCancelOrder: useCallback(async () => {
        if (!orderToCancel) {
             return { success: false, message: "" }; // silent failure if no cancellation is pending
        }
        setOrderToCancel(null);
        return { success: true, message: "Cancellation aborted. Your order will proceed as planned." };
    }, [orderToCancel]),
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
    <div className="relative h-full w-full">
        <div className="flex flex-col h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')" }}>
        <header className="bg-green-700 dark:bg-teal-900 text-white p-3 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center">
                <img src="https://picsum.photos/40/40?random=1" alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
                <div>
                <h2 className="font-semibold text-lg">Welcome to stanleys restaurant</h2>
                <p className="text-sm opacity-80">Online</p>
                </div>
            </div>
            <button
            onClick={() => setIsPastOrdersModalOpen(true)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="View past orders"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            </button>
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
        </div>
        {isPastOrdersModalOpen && (
            <PastOrdersModal
            orders={orders}
            onClose={() => setIsPastOrdersModalOpen(false)}
            updateOrderStatus={updateOrderStatus}
            />
        )}
         {/* Notifications Area */}
        <div aria-live="assertive" className="fixed inset-0 top-4 right-4 flex items-end px-4 py-6 sm:p-6 items-start pointer-events-none z-50">
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {notifications.map(notification => (
                    <NotificationToast key={notification.id} notification={notification} onDismiss={removeNotification} />
                ))}
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
        @keyframes toast-in {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .animate-toast-in {
            animation: toast-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CustomerView;