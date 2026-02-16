import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Modal } from '../../ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from '../../ui/Table';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Master {
  id: string;
  name: string;
  bio: string;
  photo_url: string;
  specializations: string[];
  active: boolean;
}

export function MastersPage() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    photo_url: '',
    specializations: '',
  });

  useEffect(() => {
    loadMasters();
  }, []);

  const loadMasters = async () => {
    const { data } = await supabase.from('masters').select('*').order('id');
    if (data) setMasters(data);
    setLoading(false);
  };

  const handleOpenModal = (master?: Master) => {
    if (master) {
      setEditingId(master.id);
      setFormData({
        name: master.name,
        bio: master.bio || '',
        photo_url: master.photo_url || '',
        specializations: master.specializations?.join(', ') || '',
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', bio: '', photo_url: '', specializations: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert('Заповніть ім\'я майстра');
      return;
    }

    const masterData = {
      name: formData.name,
      bio: formData.bio,
      photo_url: formData.photo_url,
      specializations: formData.specializations.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (editingId) {
      const { error } = await supabase
        .from('masters')
        .update(masterData)
        .eq('id', editingId);
      if (error) {
        alert('Помилка при оновленні');
        return;
      }
    } else {
      const { error } = await supabase
        .from('masters')
        .insert([masterData]);
      if (error) {
        alert('Помилка при створенні');
        return;
      }
    }

    loadMasters();
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені?')) return;
    const { error } = await supabase.from('masters').delete().eq('id', id);
    if (!error) loadMasters();
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Управління майстрами</CardTitle>
            <Button size="sm" onClick={() => handleOpenModal()}>
              <Plus className="w-4 h-4 mr-2" />
              Додати майстра
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Ім'я</TableHeader>
                <TableHeader>Спеціалізація</TableHeader>
                <TableHeader>Фото</TableHeader>
                <TableHeader>Дії</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {masters.map((master) => (
                <TableRow key={master.id}>
                  <TableCell className="font-medium">{master.name}</TableCell>
                  <TableCell>{master.specializations?.join(', ')}</TableCell>
                  <TableCell>
                    {master.photo_url && (
                      <img
                        src={master.photo_url}
                        alt={master.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal(master)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(master.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Редагувати майстра' : 'Додати майстра'} size="lg">
        <div className="space-y-4">
          <Input
            label="Ім'я майстра"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Textarea
            label="Біографія"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
          />
          <Input
            label="URL фото"
            value={formData.photo_url}
            onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
            placeholder="https://..."
          />
          <Input
            label="Спеціалізація (через кому)"
            value={formData.specializations}
            onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
            placeholder="манікюр, педикюр, гель-лак"
          />
          <Button onClick={handleSave} className="w-full">
            Зберегти
          </Button>
        </div>
      </Modal>
    </div>
  );
}
