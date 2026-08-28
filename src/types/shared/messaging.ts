export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'parent' | 'faculty' | 'admin';
  body: string;
  timestamp: string;
  status: MessageStatus;
  attachment?: Attachment;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'student' | 'parent' | 'faculty' | 'admin';
  participantAvatarUrl?: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  subject?: string;
}

export interface MessagingState {
  conversations: Conversation[];
  messages: Message[];
  selectedConversationId: string | null;
  searchQuery: string;
}

export type MessagingAction =
  | { type: 'selectConversation'; id: string }
  | { type: 'setSearchQuery'; query: string }
  | { type: 'sendMessage'; message: Message }
  | { type: 'markAsRead'; conversationId: string }
  | { type: 'setConversations'; conversations: Conversation[] }
  | { type: 'setMessages'; messages: Message[] };

export function messagingReducer(state: MessagingState, action: MessagingAction): MessagingState {
  switch (action.type) {
    case 'selectConversation':
      return { ...state, selectedConversationId: action.id };
    case 'setSearchQuery':
      return { ...state, searchQuery: action.query };
    case 'sendMessage':
      return {
        ...state,
        messages: [...state.messages, action.message],
        conversations: state.conversations.map((c) =>
          c.id === action.message.conversationId
            ? {
                ...c,
                lastMessage: action.message.body,
                lastMessageTimestamp: action.message.timestamp,
              }
            : c
        ),
      };
    case 'markAsRead':
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId ? { ...c, unreadCount: 0 } : c
        ),
      };
    case 'setConversations':
      return { ...state, conversations: action.conversations };
    case 'setMessages':
      return { ...state, messages: action.messages };
    default:
      return state;
  }
}
