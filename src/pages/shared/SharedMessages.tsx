import { useEffect, useReducer, useState } from 'react';
import { Search } from 'lucide-react';
import { ConversationList, ChatWindow, MessageInput } from '@/features/shared';
import { messageApi } from '@/services/api/messageApi';
import { messagingReducer } from '@/types/shared/messaging';
import type { Conversation, Message } from '@/types/shared/messaging';

const initialState = {
  conversations: [] as Conversation[],
  messages: [] as Message[],
  selectedConversationId: null as string | null,
  searchQuery: '',
};

export function SharedMessages() {
  const [state, dispatch] = useReducer(messagingReducer, initialState);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function loadData() {
      const conversations = await messageApi.getConversations();
      dispatch({ type: 'setConversations', conversations });
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      if (!state.selectedConversationId) return;
      const messages = await messageApi.getMessages(state.selectedConversationId);
      dispatch({ type: 'setMessages', messages });
      await messageApi.markAsRead(state.selectedConversationId);
      dispatch({ type: 'markAsRead', conversationId: state.selectedConversationId });
    }
    loadMessages();
  }, [state.selectedConversationId]);

  const selectedConversation = state.conversations.find(
    (c) => c.id === state.selectedConversationId
  );

  const handleSend = async (messageBody: { body: string }) => {
    if (!messageBody.body.trim() || !state.selectedConversationId) return;
    setSending(true);
    const message = await messageApi.sendMessage({
      conversationId: state.selectedConversationId,
      senderId: 'currentUser',
      senderName: 'You',
      senderRole: 'student',
      body: messageBody.body.trim(),
    });
    dispatch({ type: 'sendMessage', message });
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {state.conversations.reduce((sum, c) => sum + c.unreadCount, 0)} unread messages
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <ConversationList
              conversations={state.conversations}
              selectedId={state.selectedConversationId}
              searchQuery={state.searchQuery}
              onSelect={(id: string) => dispatch({ type: 'selectConversation', id })}
              onSearchChange={(query: string) => dispatch({ type: 'setSearchQuery', query })}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedConversation ? (
            <div className="flex h-[600px] flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    {selectedConversation.participantName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedConversation.participantName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedConversation.subject || 'Conversation'}
                    </p>
                  </div>
                </div>
              </div>

              <ChatWindow
                conversationId={state.selectedConversationId}
                participantName={selectedConversation.participantName}
                messages={state.messages}
                currentUserId="currentUser"
              />

              <MessageInput onSend={handleSend} disabled={sending} />
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-center">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Select a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
