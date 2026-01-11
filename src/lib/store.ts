import { create } from 'zustand';
import { Chat, Message, sampleChats, sampleMessages } from './data';

interface AppState {
  isConnected: boolean;
  chats: Chat[];
  messages: Message[];
  selectedDate: Date;
  selectedChatId: string | null;
  filterMode: 'all' | 'groups' | 'top5';
  setConnected: (connected: boolean) => void;
  setChats: (chats: Chat[]) => void;
  setMessages: (messages: Message[]) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedChatId: (chatId: string | null) => void;
  setFilterMode: (mode: 'all' | 'groups' | 'top5') => void;
  loadSampleData: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isConnected: false,
  chats: [],
  messages: [],
  selectedDate: new Date(),
  selectedChatId: null,
  filterMode: 'all',
  setConnected: (connected) => set({ isConnected: connected }),
  setChats: (chats) => set({ chats }),
  setMessages: (messages) => set({ messages }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedChatId: (chatId) => set({ selectedChatId: chatId }),
  setFilterMode: (mode) => set({ filterMode: mode }),
  loadSampleData: () => set({ 
    chats: sampleChats, 
    messages: sampleMessages, 
    isConnected: true 
  }),
}));
