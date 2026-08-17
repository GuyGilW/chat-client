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
  sender: { id: number; username: string; avatarUrl: string | null };
}