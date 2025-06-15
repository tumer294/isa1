import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Moon, Star, Bell, Search } from 'lucide-react';

export default function MobileHeader() {
  const { user } = useAuth();

  return (
    <div className="lg:hidden">
      <div className="flex h-16 items-center justify-between bg-white/80 backdrop-blur-md border-b border-emerald-100 px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Moon className="h-6 w-6 text-emerald-600" />
            <Star className="h-3 w-3 text-amber-500 absolute -top-0.5 -right-0.5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">İslami Paylaşım</h1>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-sm font-medium text-emerald-600">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}