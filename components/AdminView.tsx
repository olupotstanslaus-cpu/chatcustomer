
import React from 'react';
import { Order, OrderStatus } from '../types';

interface AdminViewProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [OrderStatus.PREPARING]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  [OrderStatus.OUTFORDELIVERY]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const OrderCard: React.FC<{ order: Order, updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void }> = ({ order, updateOrderStatus }) => {
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
        <select
          value={order.status}
          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
          className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        >
          {Object.values(OrderStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>
  );
};


const AdminView: React.FC<AdminViewProps> = ({ orders, updateOrderStatus }) => {
    const sortedOrders = [...orders].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Order Management</h1>
        <p className="text-gray-500 dark:text-gray-400">Viewing {orders.length} active order(s)</p>
      </header>
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
            <OrderCard key={order.id} order={order} updateOrderStatus={updateOrderStatus} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminView;
