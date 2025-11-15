import React from 'react';

const galleryImages = [
    { seed: 'MargheritaPizza', alt: 'Classic Margherita Pizza' },
    { seed: 'SpaghettiCarbonara', alt: 'Creamy Spaghetti Carbonara' },
    { seed: 'GourmetSalad', alt: 'A fresh gourmet salad' },
    { seed: 'ItalianLasagna', alt: 'Rich and cheesy lasagna' },
    { seed: 'PepperoniFeast', alt: 'A delicious pepperoni pizza' },
    { seed: 'TiramisuDessert', alt: 'Elegant Tiramisu dessert' },
    { seed: 'RestaurantInterior', alt: 'Cozy interior of the restaurant' },
    { seed: 'HappyCustomers', alt: 'Customers enjoying their meal' },
    { seed: 'WoodFiredOven', alt: 'Pizza being cooked in a wood-fired oven' },
];

const GalleryPage: React.FC = () => {
    return (
        <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900">
            <header className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Our Gallery</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">A glimpse into the heart of our kitchen.</p>
            </header>
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg">
                            <img 
                                src={`https://picsum.photos/seed/${image.seed}/400/400`} 
                                alt={image.alt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-500 flex items-end p-4">
                                <p className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    {image.alt}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GalleryPage;