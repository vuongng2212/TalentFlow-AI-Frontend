import axios from 'axios';

const NOTIFICATION_API_URL =
  process.env.NEXT_PUBLIC_NOTIFICATION_API_URL || 'http://localhost:5000/api';

export interface NotificationItem {
  id: string;
  userId: string;
  applicationId?: string;
  type: string;
  channel: string;
  title: string;
  message: string;
  recipient?: string;
  subject?: string;
  status?: string;
  read: boolean;
  isRead: boolean;
  readAt?: string;
  sentAt?: string;
  failedAt?: string;
  createdAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationListResponse {
  success: boolean;
  data: NotificationItem[];
  pagination: NotificationPagination;
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const notificationService = {
  getNotifications: async (
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<NotificationListResponse> => {
    const response = await axios.get<NotificationListResponse>(
      `${NOTIFICATION_API_URL}/notifications/${userId}`,
      {
        params: { page, limit },
        headers: getAuthHeader(),
      },
    );
    return response.data;
  },

  getUnreadCount: async (userId: string): Promise<number> => {
    const response = await axios.get<UnreadCountResponse>(
      `${NOTIFICATION_API_URL}/notifications/${userId}/unread-count`,
      {
        headers: getAuthHeader(),
      },
    );
    return response.data.data.count;
  },

  markAsRead: async (id: string): Promise<NotificationItem> => {
    const response = await axios.put<{ success: boolean; data: NotificationItem }>(
      `${NOTIFICATION_API_URL}/notifications/${id}/read`,
      {},
      {
        headers: getAuthHeader(),
      },
    );
    return response.data.data;
  },

  deleteNotification: async (id: string): Promise<void> => {
    await axios.delete(`${NOTIFICATION_API_URL}/notifications/${id}`, {
      headers: getAuthHeader(),
    });
  },
};
