// 1. As-const Object
export const MessageStatusType = {
  Sent: 'SENT',
  Delivered: 'DELIVERED',
  Seen: 'SEEN',
} as const;


export type MessageStatusType = (typeof MessageStatusType)[keyof typeof MessageStatusType];

export const MESSAGE_STATUS_VALUES = Object.values(MessageStatusType);


export interface UserProfile {
  id: number;
  username: string;
  avatarUrl?: string | null;
}

export interface ChatMember {
  id: number;
  userId: number;
  user: UserProfile;
}

export interface Chat {
  id: number;
  name: string | null;
  isGroup: boolean;
  imageUrl: string | null;
  members: ChatMember[];
}

export interface Message {
  id: number;
  content: string;
  senderId: number;
  chatId: number;
  createdAt: string;
  sender: UserProfile;
  statuses: MessageStatus[];
}

export interface MessageStatus {
  id: number; 
  messageId: number; 
  userId: number; 
  status: MessageStatusType;
}