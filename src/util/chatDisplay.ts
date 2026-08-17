import type { Chat } from '../types/types';
import { avatarUrl } from '../api/user';

export function getChatDisplayInfo(chat: Chat, currentUserId: number | undefined) {
  if (chat.isGroup) {
    return {
      title: chat.name || `Group Chat #${chat.id}`,
      subtitle: `${chat.members.length} members`,
      src: avatarUrl(chat.imageUrl),
    };
  }

  const otherMember = chat.members.find((m) => m.userId !== currentUserId);

  if (!otherMember) {
    const selfMember = chat.members.find((m) => m.userId === currentUserId);
    const selfUsername = selfMember?.user?.username || 'You';
    return {
      title: `${selfUsername} (You)`,
      subtitle: 'Direct Message',
      src: avatarUrl(selfMember?.user?.avatarUrl ?? null),
    };
  }

  return {
    title: otherMember.user?.username || 'Direct Message',
    subtitle: 'Direct Message',
    src: avatarUrl(otherMember.user?.avatarUrl ?? null),
  };
}
