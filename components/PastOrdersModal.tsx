import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { statusColors } from '../constants';

interface PastOrdersModalProps {
    orders: Order[];
    onClose: () => void;
    updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

const PastOrdersModal: React.FC<PastOrdersModalProps> = ({ orders, onClose, updateOrderStatus }) => {
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ startDate: string; endDate: string }>({
        startDate: '',
        endDate: '',
    });
    const [isCancelling, setIsCancelling] = useState<string | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateFilter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const clearDateFilters = () => {
        setDateFilter({ startDate: '', endDate: '' });
    };
    
    const handleCancelOrder = async (order: Order) => {
        if (order.status !== OrderStatus.PENDING) {
            alert("This order can no longer be cancelled as it is already being processed.");
            return;
        }

        if (window.confirm(`Are you sure you want to cancel order #${order.id}? This action cannot be undone.`)) {
            setIsCancelling(order.id);
            try {
                await updateOrderStatus(order.id, OrderStatus.CANCELLED);
            } catch (error) {
                console.error("Failed to cancel order:", error);
                alert("An error occurred while trying to cancel your order. Please try again.");
            } finally {
                setIsCancelling(null);
            }
        }
    };

    useEffect(() => {
        setIsFiltering(true);
        const timerId = setTimeout(() => {
            let result = [...orders];

            if (searchQuery.trim() !== '') {
                const lowercasedQuery = searchQuery.toLowerCase();
                result = result.filter(order => 
                    order.id.toLowerCase().includes(lowercasedQuery) ||
                    order.items.some(item => item.name.toLowerCase().includes(lowercasedQuery))
                );
            }
    
            if (statusFilter !== 'All') {
                result = result.filter(order => order.status === statusFilter);
            }
    
            if (dateFilter.startDate) {
                const startDate = new Date(dateFilter.startDate + 'T00:00:00');
                result = result.filter(order => order.timestamp >= startDate);
            }
    
            if (dateFilter.endDate) {
                const endDate = new Date(dateFilter.endDate + 'T23:59:59');
                result = result.filter(order => order.timestamp <= endDate);
            }
    
            setFilteredOrders(result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
            setIsFiltering(false);
        }, 300);

        return () => clearTimeout(timerId);
    }, [orders, statusFilter, dateFilter, searchQuery]);


    const showEta = (status: OrderStatus) => [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.OUTFORDELIVERY].includes(status);
    
    const filterControls = (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
             <div>
                <label htmlFor="order-search" className="sr-only">Search Orders</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        name="order-search"
                        id="order-search"
                        className="bg-white dark:bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search by Order ID or Item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2 shrink-0">Status:</span>
                {['All', ...Object.values(OrderStatus)].map(status => (
                    <button 
                        key={status} 
                        onClick={() => setStatusFilter(status as OrderStatus | 'All')} 
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            statusFilter === status 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2 shrink-0">Date Range:</span>
                <div className="flex items-center gap-2">
                    <label htmlFor="startDate" className="text-sm text-gray-500 dark:text-gray-400">From</label>
                    <input 
                        type="date" 
                        name="startDate" 
                        id="startDate" 
                        value={dateFilter.startDate} 
                        onChange={handleDateChange} 
                        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm p-1.5 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white" 
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="endDate" className="text-sm text-gray-500 dark:text-gray-400">To</label>
                    <input 
                        type="date" 
                        name="endDate" 
                        id="endDate" 
                        value={dateFilter.endDate} 
                        onChange={handleDateChange}
                        min={dateFilter.startDate}
                        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm p-1.5 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white" 
                    />
                </div>
                {(dateFilter.startDate || dateFilter.endDate) && (
                    <button onClick={clearDateFilters} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Clear</button>
                )}
            </div>
        </div>
    );
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center"
            onClick={onClose}
        >
            <div 
                className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl m-4 transform transition-all flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Past Orders</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                {orders.length > 0 && filterControls}
                <div className="p-6 flex-grow overflow-y-auto relative min-h-[200px]">
                    {isFiltering ? (
                         <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No orders yet</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start a conversation to place your first order!</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Orders Found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters to find what you're looking for.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map(order => (
                                <div key={order.id} className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-md text-gray-800 dark:text-white">Order #{order.id}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{order.timestamp.toLocaleString()}</p>
                                        </div>
                                        <div className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                                            {order.status}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                            {order.items.map((item, index) => (
                                                <li key={index}>{item.quantity} x {item.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex justify-between items-end border-t pt-2 border-gray-200 dark:border-gray-700">
                                        {showEta(order.status) ? (
                                             <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Est. Delivery: {order.estimatedDeliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        ) : <div />}
                                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                                            Total: ${order.total.toFixed(2)}
                                        </p>
                                    </div>
                                    {order.status === OrderStatus.PENDING && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-right">
                                            <button
                                                onClick={() => handleCancelOrder(order)}
                                                disabled={isCancelling === order.id}
                                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-wait"
                                            >
                                                {isCancelling === order.id ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Cancelling...
                                                    </>
                                                ) : (
                                                    'Cancel Order'
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PastOrdersModal;
