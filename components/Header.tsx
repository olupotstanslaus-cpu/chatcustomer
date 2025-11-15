import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, navigateTo }) => {
  const NavLink: React.FC<{ pageName: Page; children: React.ReactNode }> = ({ pageName, children }) => {
    const isActive = currentPage === pageName;
    return (
      <button
        onClick={() => navigateTo(pageName)}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive ? 'text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
      >
        {children}
      </button>
    );
  };

  return (
    <header className="p-4 flex justify-between items-center bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20 text-white">
      <button onClick={() => navigateTo('home')} className="text-xl font-bold">
        Welcome to stanleys restaurant 🍕
      </button>
      <nav className="hidden md:flex items-center space-x-2">
        <NavLink pageName="home">Home</NavLink>
        <NavLink pageName="gallery">Gallery</NavLink>
        <NavLink pageName="contact">Contact Us</NavLink>
      </nav>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigateTo('order')}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition-all transform hover:scale-105"
        >
          Order Online
        </button>
        <button onClick={() => navigateTo('admin')} className="text-sm text-gray-300 hover:text-white transition-colors">Admin</button>
      </div>
    </header>
  );
};

export default Header;