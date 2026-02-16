import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { label: 'Налаштування салону', href: '/admin/settings', icon: Settings },
    { label: 'Майстри', href: '/admin/masters', icon: 'Users' },
    { label: 'Послуги', href: '/admin/services', icon: 'ShoppingCart' },
    { label: 'Портфоліо', href: '/admin/portfolio', icon: 'Image' },
    { label: 'Записи', href: '/admin/bookings', icon: 'Calendar' },
    { label: 'Герой секція', href: '/admin/hero', icon: 'Sparkles' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white p-6 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Nails.S.</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-4">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span>Вийти</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Адмін-панель</h2>
          <div />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
