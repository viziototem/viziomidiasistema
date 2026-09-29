import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, Clock, Info } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markAllNotificationsRead, markNotificationRead } = useApp();

  return (
    <div id="notifications-view" className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
            Central de Notificações
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Histórico completo de alertas, aprovações, novos arquivos e prazos
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all self-start sm:self-auto cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-[#FF6A00]" />
          <span>Marcar todas como lidas</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              Nenhuma notificação no momento.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-4 flex items-start gap-4 transition-colors cursor-pointer ${
                  notif.read ? 'bg-white hover:bg-gray-50/60' : 'bg-orange-50/40 hover:bg-orange-50/70'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.read ? 'bg-gray-100 text-gray-400' : 'bg-[#FF6A00] text-white shadow-2xs'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900">{notif.title}</h4>
                    <span className="text-[10px] text-gray-400">{notif.createdAt}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
