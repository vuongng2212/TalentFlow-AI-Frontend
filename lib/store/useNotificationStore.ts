import { create } from 'zustand';
import {
  NotificationItem,
  notificationService,
} from '@/services/api/notification.service';

export interface NotificationStoreState {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchNotifications: (userId: string) => Promise<void>;
  fetchUnreadCount: (userId: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addRealtimeNotification: (item: Partial<NotificationItem>) => void;
}

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  isOpen: false,

  setIsOpen: (isOpen) => set({ isOpen }),

  fetchNotifications: async (userId: string) => {
    if (!userId) return;
    set({ loading: true });
    try {
      const response = await notificationService.getNotifications(userId, 1, 20);
      set({
        notifications: response.data || [],
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ loading: false });
    }
  },

  fetchUnreadCount: async (userId: string) => {
    if (!userId) return;
    try {
      const count = await notificationService.getUnreadCount(userId);
      set({ unreadCount: count });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true, read: true, readAt: new Date().toISOString() } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      const target = get().notifications.find((n) => n.id === id);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount:
          target && !target.isRead ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      }));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  },

  addRealtimeNotification: (item: Partial<NotificationItem>) => {
    const newItem: NotificationItem = {
      id: item.id || `realtime-${Date.now()}`,
      userId: item.userId || '',
      applicationId: item.applicationId,
      type: item.type || 'system',
      channel: item.channel || 'in_app',
      title: item.title || 'New Notification',
      message: item.message || '',
      recipient: item.recipient,
      subject: item.subject,
      status: item.status || 'sent',
      read: false,
      isRead: false,
      createdAt: item.createdAt || new Date().toISOString(),
    };

    set((state) => ({
      notifications: [newItem, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
