import React, { useState } from 'react';
import { MenuItem } from '../types';
import ProductModal from './ProductModal';

interface ProductManagementProps {
    menuItems: MenuItem[];
    addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
    updateMenuItem: (item: MenuItem) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ menuItems, addMenuItem, updateMenuItem }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    const handleAddItem = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEditItem = (item: MenuItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSaveItem = (itemData: Omit<MenuItem, 'id'> | MenuItem) => {
        if ('id' in itemData) {
            updateMenuItem(itemData);
        } else {
            addMenuItem(itemData);
        }
        handleCloseModal();
    };
    
    const sortedMenuItems = [...menuItems].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="flex-grow p-4 overflow-y-auto bg-gray-100 dark:bg-gray-800/50">
            <div className="flex justify-end mb-4">
                <button 
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Item
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedMenuItems.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{item.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                                </div>
                                <p className="font-semibold text-lg text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{item.description}</p>
                        </div>
                        <div className="text-right mt-4">
                             <button
                                onClick={() => handleEditItem(item)}
                                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <ProductModal 
                    item={editingItem} 
                    onClose={handleCloseModal}
                    onSave={handleSaveItem}
                />
            )}
        </div>
    );
};

export default ProductManagement;
