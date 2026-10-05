import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { AdminLayout } from './AdminLayout';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { ModernTicketPass } from '../common/ModernTicketPass';

export const AdminTiketKunjungan: React.FC = () => {
  const { bookings, selectedBookingId, setActiveView } = useBooking();
  const booking = 
    bookings.find((b) => b.id === selectedBookingId) || 
    bookings.find((b) => b.status === 'Terverifikasi') || 
    bookings[0];

  return (
    <AdminLayout 
      title="Pratinjau Tiket Resmi" 
      subtitle="Tiket digital siap cetak dan validasi gate Museum Blambangan."
    >
      <div className="space-y-5 max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button 
              onClick={() => setActiveView('admin-orders')}
              className="hover:text-[#0F292F] transition-colors"
            >
              Pesanan Kunjungan
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">Tiket Digital</span>
            {booking && <span className="text-slate-400 font-mono">({booking.id})</span>}
          </div>

          <button
            onClick={() => setActiveView('admin-orders')}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Pesanan</span>
          </button>
        </div>

        {/* Stunning Ticket Card */}
        {booking ? (
          <div className="flex justify-center">
            <ModernTicketPass
              booking={booking}
              onBack={() => setActiveView('admin-orders')}
              showActions={true}
            />
          </div>
        ) : (
          <div className="p-8 bg-white rounded-2xl text-center text-slate-400 border border-slate-200">
            Tidak ada tiket yang dapat ditampilkan.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
