import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';

interface SiteSettings {
  id: string;
  salon_name: string;
  address: string;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  work_hours_mon_fri: string;
  work_hours_sat_sun: string;
  instagram: string;
  facebook: string;
  telegram: string;
  whatsapp: string;
}

export function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').single();
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    if (settings) setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    const { error } = await supabase
      .from('site_settings')
      .update(settings)
      .eq('id', settings.id);

    if (!error) {
      alert('Налаштування збережено!');
    } else {
      alert('Помилка при збереженні');
    }
    setSaving(false);
  };

  if (loading) return <div>Завантаження...</div>;
  if (!settings) return <div>Помилка завантаження налаштувань</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Основні налаштування салону</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Назва салону"
              value={settings.salon_name}
              onChange={(e) => handleChange('salon_name', e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={settings.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            <Input
              label="Адреса"
              value={settings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
            />
            <Input
              label="Телефон (основний)"
              value={settings.phone_primary || ''}
              onChange={(e) => handleChange('phone_primary', e.target.value)}
            />
            <Input
              label="Телефон (додатковий)"
              value={settings.phone_secondary || ''}
              onChange={(e) => handleChange('phone_secondary', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Графік роботи</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Пн-Пт"
              value={settings.work_hours_mon_fri || ''}
              onChange={(e) => handleChange('work_hours_mon_fri', e.target.value)}
              rows={3}
            />
            <Textarea
              label="Сб-Нд"
              value={settings.work_hours_sat_sun || ''}
              onChange={(e) => handleChange('work_hours_sat_sun', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Соціальні мережі</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Instagram"
              value={settings.instagram || ''}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="https://instagram.com/..."
            />
            <Input
              label="Facebook"
              value={settings.facebook || ''}
              onChange={(e) => handleChange('facebook', e.target.value)}
              placeholder="https://facebook.com/..."
            />
            <Input
              label="Telegram"
              value={settings.telegram || ''}
              onChange={(e) => handleChange('telegram', e.target.value)}
              placeholder="https://t.me/..."
            />
            <Input
              label="WhatsApp"
              value={settings.whatsapp || ''}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="+380..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSave} loading={saving}>
          Зберегти налаштування
        </Button>
      </div>
    </div>
  );
}
