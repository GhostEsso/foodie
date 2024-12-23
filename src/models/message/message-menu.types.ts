import { Message } from "./message.types";

export interface MessageMenuProps {
  className?: string;
}

export interface MessageMenuState {
  unreadCount: number;
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
}

export interface MessageMenuHandlers {
  fetchUnreadCount: () => Promise<void>;
  fetchRecentMessages: () => Promise<void>;
  toggleMenu: () => void;
  closeMenu: () => void;
} 