import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../hooks/useAuth';
import { 
  Home, 
  Compass, 
  Users, 
  BookOpen, 
  Heart, 
  Calendar,
  Clock,
  User,
  Settings,
  Shield,
  Moon,
  Star,
  LogOut
} from 'lucide-react';

const navigation = [
  { name: 'Ana Sayfa', href: '/', icon: Home },
  { name: 'Keşfet', href: '/explore', icon: Compass },
  { name: 'Topluluklar', href: '/communities', icon: Users },
  { name: 'Kur\'an & Hadis', href: '/quran-hadith', icon: BookOpen },
  { name: 'Dua İstekleri', href: '/dua-requests', icon: Heart },
  { name: 'Etkinlikler', href: '/events', icon: Calendar },
  { name: 'Namaz Vakitleri', href: '/prayer-times', icon: Clock },
  { name: 'Günlük Hikmet', href: '/daily-wisdom', icon: Star },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/80 backdrop-blur-md border-r border-emerald-100 px-6 pb-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Moon className="h-8 w-8 text-emerald-600" />
              <Star className="h-4 w-4 text-amber-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">İslami Paylaşım</h1>
              <p className="text-xs text-emerald-600">Sosyal Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => setLocation(item.href)}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left transition-all ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-600'
                          }`}
                        />
                        {item.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>

            {/* User Section */}
            <li className="mt-auto">
              <div className="border-t border-gray-200 pt-4">
                {/* Profile */}
                <button
                  onClick={() => setLocation('/profile')}
                  className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                >
                  <User className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-emerald-600" />
                  Profilim
                </button>

                {/* Admin Panel */}
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setLocation('/admin')}
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                  >
                    <Shield className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-emerald-600" />
                    Admin Panel
                  </button>
                )}

                {/* Settings */}
                <button className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                  <Settings className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-emerald-600" />
                  Ayarlar
                </button>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="h-6 w-6 shrink-0 text-red-500" />
                  Çıkış Yap
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}