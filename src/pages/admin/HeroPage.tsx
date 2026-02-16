import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';

interface HeroSettings {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  background_image_url: string;
}

export function HeroPage() {
  const [hero, setHero] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    const { data } = await supabase.from('hero_settings').select('*').single();
    if (data) setHero(data);
    setLoading(false);
  };

  const handleChange = (field: keyof HeroSettings, value: string) => {
    if (hero) setHero({ ...hero, [field]: value });
  };

  const handleSave = async () => {
    if (!hero) return;
    setSaving(true);

    const { error } = await supabase
      .from('hero_settings')
      .update(hero)
      .eq('id', hero.id);

    if (!error) {
      alert('Герой секція оновлена!');
    } else {
      alert('Помилка при збереженні');
    }
    setSaving(false);
  };

  if (loading) return <div>Завантаження...</div>;
  if (!hero) return <div>Помилка завантаження</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Редагування герой секції</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Головний заголовок"
              value={hero.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <Textarea
              label="Підзаголовок"
              value={hero.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              rows={3}
            />
            <Input
              label="Текст кнопки"
              value={hero.cta_text}
              onChange={(e) => handleChange('cta_text', e.target.value)}
            />
            <Input
              label="URL фонового зображення"
              value={hero.background_image_url || ''}
              onChange={(e) => handleChange('background_image_url', e.target.value)}
              placeholder="https://..."
            />

            {hero.background_image_url && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Попередній перегляд:</p>
                <div
                  className="w-full h-64 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${hero.background_image_url})` }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} loading={saving}>
        Зберегти зміни
      </Button>
    </div>
  );
}
