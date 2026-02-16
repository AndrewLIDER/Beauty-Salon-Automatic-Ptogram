import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminLayout } from './pages/admin/AdminLayout';
import { SettingsPage } from './pages/admin/SettingsPage';
import { MastersPage } from './pages/admin/MastersPage';
import { ServicesPage } from './pages/admin/ServicesPage';
import { PortfolioPage } from './pages/admin/PortfolioPage';
import { HeroPage } from './pages/admin/HeroPage';
import { BookingsPage } from './pages/admin/BookingsPage';
import HomePage from './pages/HomePage';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Завантаження...</div>;
  if (!user) return <Navigate to="/" />;

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route path="settings" element={<SettingsPage />} />
        <Route path="masters" element={<MastersPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="hero" element={<HeroPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route index element={<Navigate to="settings" />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
