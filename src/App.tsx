import { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServiceCard } from './components/ServiceCard';
import { BookingForm } from './components/BookingForm';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { supabase } from './lib/supabase';
import { LogIn } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

function AppContent() {
  const { user, loading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('client');
  const bookingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('category', { ascending: true });
    if (data) setServices(data);
  };

  const loadUserProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    if (data) setUserRole(data.role);
  };

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-white">
      <Header />

      {!user && (
        <div className="bg-cyan-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center space-x-4">
            <span>Увійдіть до системи для зручного управління записами</span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-2 bg-white text-cyan-600 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-50 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Увійти</span>
            </button>
          </div>
        </div>
      )}

      <Hero onBookNow={scrollToBooking} />

      {user && userRole === 'admin' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AdminDashboard />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Наші послуги</h2>
          <p className="text-xl text-gray-600">
            Професійний догляд за вашими руками та ногами
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>

        <div ref={bookingRef} className="max-w-2xl mx-auto">
          <BookingForm />
        </div>
      </div>

      <footer className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Beauty Pro</h3>
              <p className="text-cyan-100">
                Професійний салон краси з онлайн системою запису.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Контакти</h3>
              <p className="text-cyan-100">Телефон: +380 00 000 00 00</p>
              <p className="text-cyan-100">Email: info@beautypro.ua</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Графік роботи</h3>
              <p className="text-cyan-100">Пн-Пт: 9:00 - 20:00</p>
              <p className="text-cyan-100">Сб-Нд: 10:00 - 18:00</p>
            </div>
          </div>
          <div className="border-t border-cyan-500 pt-8 text-center text-cyan-100">
            <p>&copy; 2024 Beauty Pro. Всі права захищено.</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
