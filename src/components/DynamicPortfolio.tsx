import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface PortfolioItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
}

export function DynamicPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    loadPortfolio();

    const subscription = supabase
      .channel('portfolio_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio' }, () => {
        loadPortfolio();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadPortfolio = async () => {
    const { data } = await supabase
      .from('portfolio')
      .select('*')
      .eq('active', true)
      .order('sort_order');
    if (data) setItems(data);
  };

  if (items.length === 0) return null;

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Наші роботи</h2>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Галерея найбільш вдалих проектів
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg aspect-square">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                {item.title && (
                  <p className="text-white text-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.title}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
