'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../features/workspace/RoleContext';
import { toast } from 'sonner';

interface NotificationSocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
}

const NotificationSocketContext = createContext<NotificationSocketContextProps>({
  socket: null,
  isConnected: false,
});

export const useNotificationSocket = () => useContext(NotificationSocketContext);

export const NotificationSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect if the user is authenticated and user data is loaded
    if (!isAuthenticated || !user) {
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL || 'http://localhost:5000/notifications';

    // Connect to the gateway running on Notification service
    const socketInstance = io(socketUrl, {
      withCredentials: true, // Crucial: forces browser to attach access_token httpOnly cookie
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketInstance.on('connect', () => {
      console.log('⚡ Socket.IO connected with ID:', socketInstance.id);
      setIsConnected(true);
      // Join the user-specific room
      socketInstance.emit('joinUserRoom');
    });

    // Listen to push notifications from the backend
    socketInstance.on('receiveNotification', (notification: {
      type: string;
      title: string;
      message: string;
    }) => {
      console.log('🔔 Received real-time notification:', notification);

      // Trigger toast based on type
      if (notification.type === 'cv_failed') {
        toast.error(notification.title || 'CV Processing Failed', {
          description: notification.message,
          duration: 6000,
        });
      } else {
        toast.success(notification.title || 'Notification', {
          description: notification.message,
          duration: 5000,
        });
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error.message);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Socket.IO disconnected:', reason);
      setIsConnected(false);
    });

    // Defer state update to next microtask to avoid react-hooks/set-state-in-effect warning
    queueMicrotask(() => {
      setSocket(socketInstance);
    });

    // Clean up when user logs out or component unmounts
    return () => {
      console.log('🔌 Cleaning up socket connection...');
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [isAuthenticated, user]);

  return (
    <NotificationSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </NotificationSocketContext.Provider>
  );
};
