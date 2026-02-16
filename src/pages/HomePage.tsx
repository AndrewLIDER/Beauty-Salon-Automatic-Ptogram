import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Header } from '../components/Header';
import { DynamicHero } from '../components/DynamicHero';
import { DynamicServices } from '../components/DynamicServices';
import { DynamicMasters } from '../components/DynamicMasters';
import { DynamicPortfolio } from '../components/DynamicPortfolio';
import { DynamicBookingForm } from '../components/DynamicBookingForm';

interface SiteSettings {
  salon_name: string;
  phone_primary: string;
  instagram?: string;
  facebook?: string;
}

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*').single();
      if (data) setSettings(data);
    };

    loadSettings();

    const subscription = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        loadSettings();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <DynamicHero />
      <DynamicMasters />
      <DynamicServices />
      <DynamicPortfolio />
      <DynamicBookingForm />

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{settings?.salon_name || 'Nails.S. Studio'}</h3>
              <p className="text-gray-400">Ваш салон красы з професійними майстрами.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Контакти</h3>
              <p className="text-gray-400">Телефон: {settings?.phone_primary}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Слідкуйте за нами</h3>
              <div className="flex gap-4">
                {settings?.instagram && (
                  <a href={settings.instagram} className="text-gray-400 hover:text-white">
                    Instagram
                  </a>
                )}
                {settings?.facebook && (
                  <a href={settings.facebook} className="text-gray-400 hover:text-white">
                    Facebook
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {settings?.salon_name || 'Nails.S. Studio'}. Всі права захищено.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
