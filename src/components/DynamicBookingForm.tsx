import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, User, Phone } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category_id: string;
  active: boolean;
}

interface Master {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

export function DynamicBookingForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedMaster, setSelectedMaster] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [catRes, servRes, mastRes] = await Promise.all([
        supabase.from('service_categories').select('*').eq('active', true),
        supabase.from('services').select('*').eq('active', true),
        supabase.from('masters').select('*').eq('active', true),
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (servRes.data) setServices(servRes.data);
      if (mastRes.data) setMasters(mastRes.data);
    };

    loadData();

    const subscription = supabase
      .channel('booking_form_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'masters' }, () => loadData())
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredServices = selectedCategory
    ? services.filter(s => s.category_id === selectedCategory)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('bookings').insert([
        {
          service_id: selectedService,
          master_id: selectedMaster,
          booking_date: selectedDate,
          booking_time: selectedTime,
          client_name: clientName,
          client_phone: clientPhone,
          client_email: clientEmail,
          status: 'pending',
        },
      ]);

      if (!error) {
        setSuccess(true);
        setSelectedCategory('');
        setSelectedService('');
        setSelectedMaster('');
        setSelectedDate('');
        setSelectedTime('');
        setClientName('');
        setClientPhone('');
        setClientEmail('');

        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Записатися онлайн</h2>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Виберіть зручний час і майстра
        </p>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            Спасибо! Ваш запис отримано. Ми скоро з вами зв'яжемось.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Категорія послуги
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedService('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">Виберіть категорію...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {filteredServices.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Послуга
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                required
              >
                <option value="">Виберіть послугу...</option>
                {filteredServices.map((serv) => (
                  <option key={serv.id} value={serv.id}>
                    {serv.name} - {serv.price} грн
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Майстер
            </label>
            <select
              value={selectedMaster}
              onChange={(e) => setSelectedMaster(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">Виберіть майстра...</option>
              {masters.map((master) => (
                <option key={master.id} value={master.id}>
                  {master.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Дата
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Час
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Ваше ім'я
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Телефон
            </label>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (опціонально)
            </label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Обробка...' : 'Записатися'}
          </button>
        </form>
      </div>
    </div>
  );
}
