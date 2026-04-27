import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, Tag, MailOpen } from 'lucide-react';
import { apiClient } from '../../api/client';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'PROMO' | 'WARNING';
  created_at: string;
  is_read: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiClient.get('/user/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient.post(`/user/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'PROMO': return <Tag className="w-5 h-5 text-purple-500" />;
      case 'WARNING': return <Info className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500">Stay updated with your latest alerts and offers</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl">
          <Bell className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`group relative p-5 bg-white rounded-2xl border transition-all duration-200 hover:shadow-md ${
                notification.is_read ? 'border-slate-100 opacity-80' : 'border-emerald-100 bg-emerald-50/30'
              }`}
            >
              <div className="flex gap-4">
                <div className={`p-2 rounded-lg shrink-0 ${
                  notification.is_read ? 'bg-slate-100' : 'bg-white shadow-sm'
                }`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-semibold truncate ${
                      notification.is_read ? 'text-slate-700' : 'text-slate-900'
                    }`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap mt-1">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                  
                  {!notification.is_read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="mt-3 text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
                    >
                      <MailOpen className="w-3.5 h-3.5" />
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
