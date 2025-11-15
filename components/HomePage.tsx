import React from 'react';
import { Page } from '../types';

interface HomePageProps {
    navigateTo: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center text-center text-white z-10 p-4">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in-down" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
                Welcome to stanleys restaurant
            </h1>
            <p className="text-lg md:text-2xl mb-8 max-w-2xl animate-fade-in-up" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>
                Authentic Italian pizza, crafted with passion and delivered by AI. Your next delicious meal is just a conversation away.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                 <button
                    onClick={() => navigateTo('order')}
                    className="px-10 py-4 bg-green-600 text-white font-bold text-lg rounded-full shadow-xl hover:bg-green-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 animate-fade-in"
                    style={{animationDelay: '0.5s'}}
                >
                    Order Online Now
                </button>
                 <button
                    onClick={() => navigateTo('gallery')}
                    className="px-10 py-4 bg-white/20 backdrop-blur-sm text-white font-bold text-lg rounded-full shadow-xl hover:bg-white/30 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 animate-fade-in"
                     style={{animationDelay: '0.7s'}}
                >
                    View Our Gallery
                </button>
            </div>
            <style>{`
              @keyframes fade-in-down {
                0% { opacity: 0; transform: translateY(-20px); }
                100% { opacity: 1; transform: translateY(0); }
              }
              @keyframes fade-in-up {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
              }
               @keyframes fade-in {
                0% { opacity: 0; }
                100% { opacity: 1; }
              }
              .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
              .animate-fade-in-up { animation: fade-in-up 0.8s ease-out 0.3s forwards; }
              .animate-fade-in { opacity: 0; animation: fade-in 0.8s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default HomePage;