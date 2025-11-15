import React, { useState, useCallback } from 'react';
import { UserType, Order, OrderStatus, MenuItem } from './types';
import CustomerView from './components/CustomerView';
import AdminView from './components/AdminView';
import Header from './components/Header';
import { INITIAL_MENU } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType>(UserType.CUSTOMER);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);

  const addOrder = useCallback((newOrder: Order) => {
    setOrders(prevOrders => [...prevOrders, newOrder]);
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    // Simulate network latency to provide better user feedback for the loading indicator
    await new Promise(resolve => setTimeout(resolve, 500));
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
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


  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col font-sans">
      <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-full max-h-[calc(100vh-100px)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex overflow-hidden">
          {currentUser === UserType.CUSTOMER ? (
            <CustomerView addOrder={addOrder} getOrderById={getOrderById} menuItems={menuItems} />
          ) : (
            <AdminView 
              orders={orders} 
              updateOrderStatus={updateOrderStatus} 
              menuItems={menuItems}
              addMenuItem={addMenuItem}
              updateMenuItem={updateMenuItem}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;