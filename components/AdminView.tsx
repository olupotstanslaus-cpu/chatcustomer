import React, { useState } from 'react';
import { Order, OrderStatus, MenuItem } from '../types';
import ProductManagement from './ProductManagement';

interface AdminViewProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
}

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [OrderStatus.PREPARING]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  [OrderStatus.OUTFORDELIVERY]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const OrderCard: React.FC<{ order: Order, onStatusChange: (orderId: string, newStatus: OrderStatus) => void, isUpdating: boolean }> = ({ order, onStatusChange, isUpdating }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">Order #{order.id}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{order.timestamp.toLocaleString()}</p>
        </div>
        <div className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[order.status]}`}>
          {order.status}
        </div>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Items:</h4>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          {order.items.map((item, index) => (
            <li key={index}>{item.quantity} x {item.name}</li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between items-center border-t pt-4 border-gray-200 dark:border-gray-700">
        <p className="font-bold text-xl text-gray-900 dark:text-white">Total: ${order.total.toFixed(2)}</p>
        <div className="relative flex items-center">
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
              disabled={isUpdating}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {Object.values(OrderStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {isUpdating && (
                <div className="ml-4">
                    <svg className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};


const AdminView: React.FC<AdminViewProps> = ({ orders, updateOrderStatus, menuItems, addMenuItem, updateMenuItem }) => {
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        if (updatingOrderId) return; // Prevent multiple updates at once
        setUpdatingOrderId(orderId);
        try {
            await updateOrderStatus(orderId, newStatus);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const sortedOrders = [...orders].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const TabButton: React.FC<{tabName: 'orders' | 'menu', label: string}> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors focus:outline-none ${
                activeTab === tabName
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-b-2 border-transparent'
            }`}
        >
            {label}
        </button>
    );

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
        <nav className="mt-2 -mb-px flex space-x-4" aria-label="Tabs">
            <TabButton tabName="orders" label={`Orders (${orders.length})`} />
            <TabButton tabName="menu" label={`Menu (${menuItems.length})`} />
        </nav>
      </header>

      {activeTab === 'orders' && (
        <>
            {orders.length === 0 ? (
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No orders yet</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">New orders from customers will appear here.</p>
                    </div>
                </div>
            ) : (
                <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-100 dark:bg-gray-800/50">
                {sortedOrders.map(order => (
                    <OrderCard key={order.id} order={order} onStatusChange={handleStatusUpdate} isUpdating={updatingOrderId === order.id} />
                ))}
                </div>
            )}
        </>
      )}

      {activeTab === 'menu' && (
        <ProductManagement 
            menuItems={menuItems} 
            addMenuItem={addMenuItem}
            updateMenuItem={updateMenuItem}
        />
      )}
    </div>
  );
};

export default AdminView;