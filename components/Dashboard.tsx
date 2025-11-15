import React, { useMemo } from 'react';
import { Order, OrderStatus } from '../types';
import { statusColors } from '../constants';

// A reusable card component for displaying stats
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

// Icons for the stat cards
const RevenueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const AvgValueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const PendingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


interface DashboardProps {
    orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {

    const stats = useMemo(() => {
        const deliveredOrders = orders.filter(o => o.status === OrderStatus.DELIVERED);
        const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
        const totalOrders = orders.length;
        const avgOrderValue = deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0;
        const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;

        const statusDistribution = Object.values(OrderStatus).map(status => {
            const count = orders.filter(o => o.status === status).length;
            return {
                status,
                count,
                percentage: totalOrders > 0 ? (count / totalOrders) * 100 : 0,
            };
        });

        return {
            totalRevenue,
            totalOrders,
            avgOrderValue,
            pendingOrders,
            statusDistribution,
        };
    }, [orders]);

    const recentOrders = useMemo(() => {
        return [...orders].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5);
    }, [orders]);

    const getBgColors = (classString: string) => classString.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('dark:bg-')).join(' ');

    return (
        <div className="flex-grow p-6 overflow-y-auto bg-gray-100 dark:bg-gray-800/50 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={<RevenueIcon />} />
                <StatCard title="Total Orders" value={stats.totalOrders.toString()} icon={<OrdersIcon />} />
                <StatCard title="Avg. Order Value" value={`$${stats.avgOrderValue.toFixed(2)}`} icon={<AvgValueIcon />} />
                <StatCard title="Pending Orders" value={stats.pendingOrders.toString()} icon={<PendingIcon />} />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Status Distribution */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Status Distribution</h3>
                    <div className="space-y-4">
                        {stats.statusDistribution.map(({ status, count, percentage }) => (
                            <div key={status}>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{status}</span>
                                    <span className="text-gray-500 dark:text-gray-400">{count} {count === 1 ? 'Order' : 'Orders'}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div 
                                        className={`${getBgColors(statusColors[status])} h-2.5 rounded-full transition-all duration-500`}
                                        style={{ width: `${percentage}%` }}
                                        title={`${percentage.toFixed(1)}%`}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
                     {recentOrders.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentOrders.map(order => (
                                <li key={order.id} className="py-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Order #{order.id}</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{order.timestamp.toLocaleDateString()}</p>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                     ) : (
                         <p className="text-sm text-gray-500 dark:text-gray-400">No recent orders to display.</p>
                     )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;