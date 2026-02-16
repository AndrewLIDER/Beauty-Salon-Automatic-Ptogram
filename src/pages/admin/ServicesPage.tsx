import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Textarea } from '../../ui/Textarea';
import { Modal } from '../../ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from '../../ui/Table';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  active: boolean;
}

export function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    duration: '60',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [catsRes, servRes] = await Promise.all([
      supabase.from('service_categories').select('*'),
      supabase.from('services').select('*'),
    ]);
    if (catsRes.data) setCategories(catsRes.data);
    if (servRes.data) setServices(servRes.data);
    setLoading(false);
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingId(service.id);
      setFormData({
        name: service.name,
        description: service.description || '',
        category_id: service.category_id,
        price: service.price.toString(),
        duration: service.duration.toString(),
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', category_id: '', price: '', duration: '60' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category_id) {
      alert('Заповніть необхідні поля');
      return;
    }

    const serviceData = {
      name: formData.name,
      description: formData.description,
      category_id: formData.category_id,
      price: parseFloat(formData.price) || 0,
      duration: parseInt(formData.duration) || 60,
    };

    if (editingId) {
      await supabase.from('services').update(serviceData).eq('id', editingId);
    } else {
      await supabase.from('services').insert([serviceData]);
    }

    loadData();
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені?')) return;
    await supabase.from('services').delete().eq('id', id);
    loadData();
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Управління послугами</CardTitle>
            <Button size="sm" onClick={() => handleOpenModal()}>
              <Plus className="w-4 h-4 mr-2" />
              Додати послугу
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Послуга</TableHeader>
                <TableHeader>Категорія</TableHeader>
                <TableHeader>Ціна</TableHeader>
                <TableHeader>Тривалість</TableHeader>
                <TableHeader>Дії</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => {
                const category = categories.find(c => c.id === service.category_id);
                return (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{category?.name}</TableCell>
                    <TableCell>{service.price} грн</TableCell>
                    <TableCell>{service.duration} хв</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenModal(service)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Редагувати послугу' : 'Додати послугу'} size="lg">
        <div className="space-y-4">
          <Input
            label="Назва послуги"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Select
            label="Категорія"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            options={categories.map(c => ({ value: c.id, label: c.name }))}
          />
          <Textarea
            label="Опис"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ціна (грн)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <Input
              label="Тривалість (хв)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Зберегти
          </Button>
        </div>
      </Modal>
    </div>
  );
}
