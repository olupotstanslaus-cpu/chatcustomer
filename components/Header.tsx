
import React from 'react';
import { UserType } from '../types';

interface HeaderProps {
  currentUser: UserType;
  setCurrentUser: (user: UserType) => void;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const AdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ currentUser, setCurrentUser }) => {
  const baseButtonClasses = "px-4 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-300";
  const activeButtonClasses = "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md";
  const inactiveButtonClasses = "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600";
  
  return (
    <header className="p-4 flex justify-between items-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        La Pizzeria del AI 🍕
      </h1>
      <div className="flex items-center bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setCurrentUser(UserType.CUSTOMER)}
          className={`${baseButtonClasses} ${currentUser === UserType.CUSTOMER ? activeButtonClasses : inactiveButtonClasses}`}
        >
          <UserIcon /> Customer View
        </button>
        <button
          onClick={() => setCurrentUser(UserType.ADMIN)}
          className={`${baseButtonClasses} ${currentUser === UserType.ADMIN ? activeButtonClasses : inactiveButtonClasses}`}
        >
          <AdminIcon /> Admin View
        </button>
      </div>
    </header>
  );
};

export default Header;
