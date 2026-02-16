import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Plus, Trash2 } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  active: boolean;
}

export function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    category: '',
  });

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    const { data } = await supabase.from('portfolio').select('*').eq('active', true);
    if (data) setItems(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.image_url) {
      alert('Додайте URL зображення');
      return;
    }

    const { error } = await supabase.from('portfolio').insert([
      {
        title: formData.title,
        image_url: formData.image_url,
        category: formData.category,
        active: true,
      },
    ]);

    if (!error) {
      loadPortfolio();
      setIsModalOpen(false);
      setFormData({ title: '', image_url: '', category: '' });
    } else {
      alert('Помилка при додаванні');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені?')) return;
    const { error } = await supabase.from('portfolio').delete().eq('id', id);
    if (!error) loadPortfolio();
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Портфоліо / Галерея</CardTitle>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Додати фото
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="relative group">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg flex items-center justify-center transition-all">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {item.title && <p className="text-sm text-gray-600 mt-2">{item.title}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Додати фото в портфоліо">
        <div className="space-y-4">
          <Input
            label="Назва роботи"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Input
            label="Категорія"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="манікюр, педикюр, дизайн"
          />
          <Input
            label="URL зображення"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://..."
          />
          {formData.image_url && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Попередній перегляд:</p>
              <img
                src={formData.image_url}
                alt="preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          <Button onClick={handleSave} className="w-full">
            Додати фото
          </Button>
        </div>
      </Modal>
    </div>
  );
}
