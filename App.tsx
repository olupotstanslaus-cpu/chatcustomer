
import React, { useState, useCallback } from 'react';
import { UserType, Order, OrderStatus } from './types';
import CustomerView from './components/CustomerView';
import AdminView from './components/AdminView';
import Header from './components/Header';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType>(UserType.CUSTOMER);
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = useCallback((newOrder: Order) => {
    setOrders(prevOrders => [...prevOrders, newOrder]);
  }, []);

  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  }, []);
  
  const getOrderById = useCallback((orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  }, [orders]);


  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col font-sans">
      <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-full max-h-[calc(100vh-100px)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex overflow-hidden">
          {currentUser === UserType.CUSTOMER ? (
            <CustomerView addOrder={addOrder} getOrderById={getOrderById} />
          ) : (
            <AdminView orders={orders} updateOrderStatus={updateOrderStatus} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
