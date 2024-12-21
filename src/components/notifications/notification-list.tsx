"use client";

import React from 'react';
import { Bell, MessageSquare, ShoppingBag, Info } from 'lucide-react';
import { Notification, NotificationType } from '../../models/notification/notification.types';

interface NotificationListProps {
  userId: string;
  onNotificationClick?: (notification: Notification) => void;
}

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'MESSAGE':
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case 'BOOKING':
      return <ShoppingBag className="h-5 w-5 text-green-500" />;
    case 'DISH':
      return <Bell className="h-5 w-5 text-yellow-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};