import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Hero {
  title: string;
  subtitle: string;
  cta_text: string;
  background_image_url: string;
}

export function DynamicHero() {
  const [hero, setHero] = useState<Hero | null>(null);

  useEffect(() => {
    loadHero();

    const subscription = supabase
      .channel('hero_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hero_settings' }, () => {
        loadHero();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadHero = async () => {
    const { data } = await supabase.from('hero_settings').select('*').single();
    if (data) setHero(data);
  };

  if (!hero) return <div>Завантаження...</div>;

  return (
    <div
      className="relative h-96 bg-cover bg-center flex items-center justify-center text-white"
      style={{
        backgroundImage: hero.background_image_url
          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${hero.background_image_url})`
          : 'linear-gradient(to right, #06b6d4, #0891b2)',
      }}
    >
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-4">{hero.title}</h1>
        <p className="text-xl mb-8">{hero.subtitle}</p>
        <button className="bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          {hero.cta_text}
        </button>
      </div>
    </div>
  );
}
