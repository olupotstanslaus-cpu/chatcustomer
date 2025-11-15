import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, MenuItem, User } from '../types';
import ProductManagement from './ProductManagement';
import Dashboard from './Dashboard';
import { statusColors } from '../constants';
import UserManagement from './UserManagement';

type SortKey = 'timestamp' | 'status' | 'total';
type SortOrder = 'asc' | 'desc';
type AdminTab = 'dashboard' | 'orders' | 'menu' | 'users';

interface AdminViewProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
}

const OrderCard: React.FC<{ order: Order, onStatusChange: (orderId: string, newStatus: OrderStatus) => void, isUpdating: boolean }> = ({ order, onStatusChange, isUpdating }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all hover:shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">Order #{order.id}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{order.timestamp.toLocaleString()}</p>
           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Est. Delivery: {order.estimatedDeliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
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

const AdminView: React.FC<AdminViewProps> = ({ orders, updateOrderStatus, menuItems, addMenuItem, updateMenuItem, users, addUser, updateUser }) => {
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [sortKey, setSortKey] = useState<SortKey>('timestamp');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [searchQuery, setSearchQuery] = useState('');

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        if (updatingOrderId) return;
        setUpdatingOrderId(orderId);
        try {
            await updateOrderStatus(orderId, newStatus);
        } finally {
            setUpdatingOrderId(null);
        }
    };
    
    const handleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const sortedOrders = useMemo(() => {
        const filtered = orders.filter(order => {
            const query = searchQuery.toLowerCase();
            return (
                order.id.toLowerCase().includes(query) ||
                order.customerName.toLowerCase().includes(query)
            );
        });

        return [...filtered].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];

            let comparison = 0;
            if (aVal > bVal) {
                comparison = 1;
            } else if (aVal < bVal) {
                comparison = -1;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [orders, sortKey, sortOrder, searchQuery]);

    const getPageTitle = () => {
        switch (activeTab) {
            case 'dashboard': return 'Dashboard';
            case 'orders': return `Live Orders (${orders.length})`;
            case 'menu': return `Menu Management (${menuItems.length})`;
            case 'users': return `User Management (${users.length})`;
            default: return 'Admin';
        }
    };

    const SortButton: React.FC<{ sortKeyName: SortKey, label: string }> = ({ sortKeyName, label }) => {
        const isActive = sortKey === sortKeyName;
        const Icon = () => {
            if (!isActive) return <span className="w-4 h-4 inline-block" />;
            return <span className="w-4 h-4 inline-block">{sortOrder === 'asc' ? '▲' : '▼'}</span>;
        };
        return (
            <button
                onClick={() => handleSort(sortKeyName)}
                className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-md transition-colors ${
                    isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
                <span>{label}</span>
                <Icon />
            </button>
        );
    };

    const SidebarButton: React.FC<{tabName: AdminTab, label: string, icon: React.ReactNode}> = ({ tabName, label, icon }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors focus:outline-none ${
                activeTab === tabName
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            {label}
        </button>
    );

    const icons = {
        dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM11 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" /></svg>,
        orders: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h4a1 1 0 100-2H7zm0 4a1 1 0 100 2h4a1 1 0 100-2H7z" clipRule="evenodd" /></svg>,
        menu: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
        users: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>,
    };

  return (
    <div className="flex h-full w-full bg-gray-100 dark:bg-gray-900">
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 flex flex-col shadow-lg">
            <div className="h-16 flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <span className="mr-2">🍕</span> Admin Panel
                </h1>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                <SidebarButton tabName="dashboard" label="Dashboard" icon={icons.dashboard} />
                <SidebarButton tabName="orders" label="Live Orders" icon={icons.orders} />
                <SidebarButton tabName="menu" label="Menu Management" icon={icons.menu} />
                <SidebarButton tabName="users" label="User Management" icon={icons.users} />
            </nav>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
            <header className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {getPageTitle()}
                </h2>
                {activeTab === 'orders' && orders.length > 0 && (
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by ID or Name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white dark:bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                            <SortButton sortKeyName="timestamp" label="Date" />
                            <SortButton sortKeyName="status" label="Status" />
                            <SortButton sortKeyName="total" label="Total" />
                        </div>
                    </div>
                )}
            </header>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'dashboard' && <Dashboard orders={orders} />}
                
                {activeTab === 'orders' && (
                    orders.length === 0 ? (
                        <div className="flex-grow flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800/50">
                            <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No orders yet</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">New orders from customers will appear here.</p>
                            </div>
                        </div>
                    ) : sortedOrders.length === 0 ? (
                         <div className="flex-grow flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800/50">
                            <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No Orders Found</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your search for "{searchQuery}" did not match any orders.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 space-y-4 bg-gray-100 dark:bg-gray-800/50">
                            {sortedOrders.map(order => (
                                <OrderCard key={order.id} order={order} onStatusChange={handleStatusUpdate} isUpdating={updatingOrderId === order.id} />
                            ))}
                        </div>
                    )
                )}

                {activeTab === 'menu' && (
                    <ProductManagement 
                        menuItems={menuItems} 
                        addMenuItem={addMenuItem}
                        updateMenuItem={updateMenuItem}
                    />
                )}
                
                {activeTab === 'users' && (
                    <UserManagement 
                        users={users} 
                        addUser={addUser}
                        updateUser={updateUser}
                    />
                )}
            </div>
        </main>
    </div>
  );
};

export default AdminView;