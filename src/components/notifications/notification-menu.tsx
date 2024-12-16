"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
// import { useNotifications } from "../../lib/socket";

export function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  // const { notifications, markAsRead } = useNotifications();
  const notifications: any[] = []; // Temporairement vide

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-gray-900"
      >
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
            <div className="max-h-96 overflow-y-auto">
              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                Aucune notification
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 