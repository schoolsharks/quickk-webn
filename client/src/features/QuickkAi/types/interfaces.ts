import { ReactElement } from "react";
import { ModuleType } from "./enums";

export interface Message {
  id: string;
  sender: "bot" | "user";
  content: string | ReactElement;
  timestamp: Date;
  options?: string[];
  questionType?: "text" | "options" | "date";
  elementType?: 'button' | 'link' | 'component';
  elementData?: {
    moduleId?: string;
    dailyPulseId?: string;
    text?: string;
    action?: string;
    href?: string;
  };
}

export interface ModuleData {
  type?: ModuleType;
  title?: string;
  duration?: string;
  questionsCount?: number;
  assessmentCount?: number;
}

export interface DailyPulseData {
  pulseCount?: number;
  starsAwarded?: number;
  topic?: string;
}


export interface Chat {
  _id: string;
  title: string;
  messages: Message[];
  createdModuleId?: string;
  createdDailyPulseId?: string;
  chatType: "module" | "dailyPulse" | "general";
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ChatHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  chats: Chat[];
  loading: boolean;
  onDeleteChat: (chatId: string) => Promise<void>;
  onArchiveChat: (chatId: string) => Promise<void>;
  onSearchChats: (searchTerm: string) => void;
}