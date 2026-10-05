import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { AdminLayout } from './AdminLayout';
import { 
  Bell, 
  History, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Ticket, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

export const AdminNotifikasiRiwayat: React.FC = () => {
  const { notifications, activities, setActiveView, setSelectedBookingId, markNotificationAsRead } = useBooking();
  const [activeTab, setActiveTab] = useState<'notifikasi' | 'riwayat'>('notifikasi');

  return (
    <AdminLayout 
      title="Notifikasi & Riwayat" 
      subtitle="Pantau pemberitahuan sistem dan log aktivitas verifikasi."
    >
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs max-w-4xl mx-auto space-y-6">
        {/* Tabs matching Figma Image 2 Screen 8 */}
        <div className="flex items-center gap-4 border-b border-slate-200 pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('notifikasi')}
            className={`flex items-center gap-2 pb-1.5 transition-colors relative ${
              activeTab === 'notifikasi'
                ? 'text-[#0F292F] border-b-2 border-[#0F292F]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifikasi</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full">
              {notifications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('riwayat')}
            className={`flex items-center gap-2 pb-1.5 transition-colors relative ${
              activeTab === 'riwayat'
                ? 'text-[#0F292F] border-b-2 border-[#0F292F]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat Aktivitas</span>
          </button>
        </div>

        {/* Tab 1: Notifikasi List */}
        {activeTab === 'notifikasi' && (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => {
              const getIcon = () => {
                switch (n.type) {
                  case 'booking_baru':
                    return <Clock className="w-4 h-4 text-amber-600" />;
                  case 'bukti_diterima':
                    return <Bell className="w-4 h-4 text-blue-600" />;
                  case 'pembayaran_ditolak':
                    return <XCircle className="w-4 h-4 text-red-600" />;
                  case 'tiket_terbit':
                    return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
                  default:
                    return <Bell className="w-4 h-4 text-slate-600" />;
                }
              };

              const getBadgeBg = () => {
                switch (n.type) {
                  case 'booking_baru': return 'bg-amber-50';
                  case 'bukti_diterima': return 'bg-blue-50';
                  case 'pembayaran_ditolak': return 'bg-red-50';
                  case 'tiket_terbit': return 'bg-emerald-50';
                  default: return 'bg-slate-50';
                }
              };

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationAsRead(n.id);
                    setSelectedBookingId(n.bookingId);
                    setActiveView('admin-order-detail');
                  }}
                  className={`py-3.5 px-4 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                    n.read ? 'hover:bg-slate-50' : 'bg-emerald-50/40 hover:bg-emerald-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-full ${getBadgeBg()} flex items-center justify-center shrink-0`}>
                      {getIcon()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {n.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        <span className="font-semibold text-[#0F292F]">{n.bookingId}</span> • {n.nama}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {n.time}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Riwayat Aktivitas List */}
        {activeTab === 'riwayat' && (
          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{act.user}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">{act.action}</span>
                  </div>
                  <div className="text-[11px] text-[#0F292F] font-semibold">
                    Target: {act.target}
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-medium">
                  {act.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
