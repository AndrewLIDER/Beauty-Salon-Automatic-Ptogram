import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Master {
  id: string;
  name: string;
  bio: string;
  photo_url: string;
  specializations: string[];
}

export function DynamicMasters() {
  const [masters, setMasters] = useState<Master[]>([]);

  useEffect(() => {
    loadMasters();

    const subscription = supabase
      .channel('masters_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'masters' }, () => {
        loadMasters();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadMasters = async () => {
    const { data } = await supabase
      .from('masters')
      .select('*')
      .eq('active', true)
      .order('id');
    if (data) setMasters(data);
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Наші майстри</h2>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Професійні спеціалісти з багаторічним досвідом
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {masters.map((master) => (
            <div key={master.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              {master.photo_url && (
                <div className="h-64 overflow-hidden">
                  <img
                    src={master.photo_url}
                    alt={master.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{master.name}</h3>
                <p className="text-sm text-cyan-600 mb-3">
                  {master.specializations?.join(', ')}
                </p>
                <p className="text-gray-600 text-sm">{master.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
