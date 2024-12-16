import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { getClientSession } from './auth-client';

interface Notification {
  id: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

let socket: Socket | null = null;

export const initializeSocket = async () => {
  if (!socket) {
    console.log("Initialisation du client Socket.IO");
    
    // Récupérer l'ID de l'utilisateur
    const session = await getClientSession();
    if (!session) {
      console.error("Pas de session utilisateur");
      return null;
    }

    // S'assurer que le serveur Socket.IO est initialisé
    await fetch('/api/socketio');

    socket = io({
      path: '/api/socketio',
      addTrailingSlash: false,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 120000,
      autoConnect: true,
      auth: {
        userId: session.id
      }
    });

    socket.on('connect', () => {
      console.log('Connecté au serveur Socket.IO, ID:', socket?.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Erreur de connexion Socket.IO:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('Déconnecté du serveur Socket.IO:', reason);
    });

    socket.on('error', (error) => {
      console.error('Erreur Socket.IO:', error);
    });
  }
  return socket;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let mounted = true;

    const setupSocket = async () => {
      console.log("Configuration des notifications...");
      const socket = await initializeSocket();
      
      if (!socket) {
        console.error("Impossible d'initialiser Socket.IO");
        return;
      }

      try {
        console.log("Chargement des notifications existantes...");
        const response = await fetch('/api/notifications');
        const data = await response.json();
        if (mounted && data.notifications) {
          console.log("Notifications chargées:", data.notifications.length);
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      }

      socket.on('notification', (notification: Notification) => {
        console.log("Nouvelle notification reçue:", notification);
        if (mounted) {
          setNotifications(prev => [notification, ...prev]);
        }
      });
    };

    setupSocket();

    return () => {
      console.log("Nettoyage des notifications...");
      mounted = false;
      if (socket) {
        socket.off('notification');
      }
    };
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      console.log("Marquage de la notification comme lue:", notificationId);
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  return { notifications, markAsRead };
}; 