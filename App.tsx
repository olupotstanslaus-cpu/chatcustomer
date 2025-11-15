import React, { useState, useCallback } from 'react';
import { Order, OrderStatus, MenuItem, Notification, Page } from './types';
import CustomerView from './components/CustomerView';
import AdminView from './components/AdminView';
import Header from './components/Header';
import { INITIAL_MENU } from './constants';
import VideoBackground from './components/VideoBackground';
import HomePage from './components/HomePage';
import GalleryPage from './components/GalleryPage';
import ContactPage from './components/ContactPage';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addOrder = useCallback((newOrderData: Omit<Order, 'estimatedDeliveryTime'>) => {
    const newOrder: Order = {
      ...newOrderData,
      estimatedDeliveryTime: new Date(newOrderData.timestamp.getTime() + 30 * 60 * 1000), // 30 minutes from order time
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    // Simulate network latency to provide better user feedback for the loading indicator
    await new Promise(resolve => setTimeout(resolve, 500));
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    // Create a notification for the customer
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      message: `Great news! The status of your order #${orderId} has been updated to "${newStatus}".`,
      orderId: orderId,
    };
    setNotifications(prev => [...prev, newNotification]);
  }, []);
  
  const getOrderById = useCallback((orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  const addMenuItem = useCallback((newItemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      id: `prod-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...newItemData,
    };
    setMenuItems(prev => [...prev, newItem]);
  }, []);

  const updateMenuItem = useCallback((updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'gallery':
        return <GalleryPage />;
      case 'contact':
        return <ContactPage />;
      case 'order':
        return (
          <CustomerView 
            addOrder={addOrder} 
            getOrderById={getOrderById} 
            menuItems={menuItems} 
            orders={orders}
            updateOrderStatus={updateOrderStatus}
            notifications={notifications}
            removeNotification={removeNotification}
          />
        );
      case 'admin':
        return (
          <AdminView 
            orders={orders} 
            updateOrderStatus={updateOrderStatus} 
            menuItems={menuItems}
            addMenuItem={addMenuItem}
            updateMenuItem={updateMenuItem}
          />
        );
      case 'home':
      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-900">
      <VideoBackground />
      <Header currentPage={page} navigateTo={setPage} />
      <main className="flex-grow flex items-center justify-center p-4">
        {page === 'home' ? (
          <HomePage navigateTo={setPage} />
        ) : (
          <div className="w-full max-w-4xl h-full max-h-[calc(100vh-100px)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex overflow-hidden">
            {renderPage()}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;