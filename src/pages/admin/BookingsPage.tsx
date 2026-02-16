import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from '../../ui/Table';
import { CheckCircle, XCircle } from 'lucide-react';

interface Booking {
  id: string;
  client_name: string;
  client_phone: string;
  booking_date: string;
  booking_time: string;
  status: string;
  services?: { name: string };
  masters?: { name: string };
}

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: false });
    if (data) setBookings(data as any);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    loadBookings();
  };

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Записи клієнтів</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {['all', 'pending', 'confirmed', 'completed'].map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? 'primary' : 'secondary'}
                onClick={() => setFilter(f as any)}
              >
                {f === 'all' ? 'Всі' : f === 'pending' ? 'Очікують' : f === 'confirmed' ? 'Підтверджено' : 'Завершено'}
              </Button>
            ))}
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Клієнт</TableHeader>
                <TableHeader>Телефон</TableHeader>
                <TableHeader>Дата</TableHeader>
                <TableHeader>Час</TableHeader>
                <TableHeader>Статус</TableHeader>
                <TableHeader>Дії</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.client_name}</TableCell>
                  <TableCell>{booking.client_phone}</TableCell>
                  <TableCell>{booking.booking_date}</TableCell>
                  <TableCell>{booking.booking_time}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status === 'pending' && 'Очікує'}
                      {booking.status === 'confirmed' && 'Підтверджено'}
                      {booking.status === 'completed' && 'Завершено'}
                      {booking.status === 'cancelled' && 'Скасовано'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
