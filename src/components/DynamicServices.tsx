import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Clock, Sparkles } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

export function DynamicServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadData();

    const servSubscription = supabase
      .channel('services_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        void loadData();
      })
      .subscribe();

    return () => {
      void servSubscription.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    const [servRes, catRes] = await Promise.all([
      supabase.from('services').select('*, service_categories(*)').eq('active', true),
      supabase.from('service_categories').select('*').eq('active', true),
    ]);
    if (servRes.data) setServices(servRes.data);
    if (catRes.data) setCategories(catRes.data);
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Наші послуги</h2>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Повний спектр послуг для вашої краси
        </p>

        {categories.map((category) => {
          const categoryServices = services.filter(s => s.category_id === category.id);
          if (categoryServices.length === 0) return null;

          return (
            <div key={category.id} className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">{category.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {service.name}
                      </h4>
                      <Sparkles className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    </div>
                    {service.description && (
                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{service.duration} хв</span>
                      </div>
                      <div className="text-lg font-bold text-cyan-600">
                        {service.price} грн
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
