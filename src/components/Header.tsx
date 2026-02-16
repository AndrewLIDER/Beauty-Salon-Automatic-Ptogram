import { Link, useNavigate } from 'react-router-dom';
import { Calendar, LogOut, LogIn, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Nails.S. Studio
              </h1>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/admin/settings"
                  className="flex items-center space-x-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Адмін</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Вийти</span>
                </button>
              </>
            ) : (
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  window.location.hash = 'auth-modal';
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Увійти</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
