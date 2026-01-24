import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

interface Master {
  id: string;
  name: string;
  specialization: string[];
  avatar_url: string | null;
}

export function BookingForm() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedMaster, setSelectedMaster] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadServices();
    loadMasters();
  }, []);

  const loadServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('category', { ascending: true });
    if (data) setServices(data);
  };

  const loadMasters = async () => {
    const { data } = await supabase
      .from('masters')
      .select('*')
      .eq('active', true);
    if (data) setMasters(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase.from('bookings').insert({
        client_id: user?.id || null,
        master_id: selectedMaster,
        service_id: selectedService,
        booking_date: bookingDate,
        booking_time: bookingTime,
        client_name: clientName,
        client_phone: clientPhone,
        notes: notes || null,
        status: 'pending',
      });

      if (error) throw error;

      setSuccess(true);
      setSelectedService('');
      setSelectedMaster('');
      setBookingDate('');
      setBookingTime('');
      setNotes('');

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Помилка при створенні запису. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-cyan-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Записатися на прийом</h2>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          Ваш запис успішно створено! Очікуйте підтвердження.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Оберіть послугу
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="">Оберіть послугу...</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price} грн ({service.duration} хв)
              </option>
            ))}
          </select>
          {selectedServiceData && (
            <p className="mt-2 text-sm text-gray-600">{selectedServiceData.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Оберіть майстра
          </label>
          <select
            value={selectedMaster}
            onChange={(e) => setSelectedMaster(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="">Оберіть майстра...</option>
            {masters.map((master) => (
              <option key={master.id} value={master.id}>
                {master.name} - {master.specialization.join(', ')}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Дата
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Час
            </label>
            <input
              type="time"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
            required
            placeholder="Введіть ваше ім'я"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
            required
            placeholder="+380..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Коментар (необов'язково)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Додаткова інформація..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Обробка...' : 'Записатися'}
        </button>
      </form>
    </div>
  );
}
