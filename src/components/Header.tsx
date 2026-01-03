// src/components/Header.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';

const Header: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className="flex justify-end items-center">
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Hi, {session?.user?.name || 'User'}!</span>
        <img
          src={session?.user?.image || "https://i.pravatar.cc/40"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-gray-300"
        />
        <button 
          onClick={() => signOut()}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;