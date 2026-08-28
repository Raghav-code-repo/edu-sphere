import { Check, CheckCheck, Paperclip } from 'lucide-react';
import type { Message } from '@/types/shared/messaging';

interface ChatWindowProps {
  conversationId: string | null;
  participantName: string;
  messages: Message[];
  currentUserId: string;
}

export function ChatWindow({
  conversationId,
  participantName,
  messages,
  currentUserId,
}: ChatWindowProps) {
  if (!conversationId) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  const conversationMessages = messages.filter((m) => m.conversationId === conversationId);

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{participantName}</h3>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {conversationMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No messages yet</p>
          </div>
        ) : (
          conversationMessages.map((message) => {
            const isOwn = message.senderId === currentUserId;
            return (
              <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] rounded-xl px-4 py-2 ${
                    isOwn
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                  }`}
                >
                  {!isOwn && (
                    <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                      {message.senderName}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                  {message.attachment && (
                    <div
                      className={`mt-2 flex items-center gap-2 rounded-lg border p-2 ${
                        isOwn
                          ? 'border-primary-500/30 bg-primary-700/30'
                          : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-600'
                      }`}
                    >
                      <Paperclip className="h-4 w-4 flex-shrink-0 opacity-70" />
                      <span className="truncate text-xs opacity-80">{message.attachment.name}</span>
                    </div>
                  )}
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-xs ${
                      isOwn ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <span>{message.timestamp}</span>
                    {isOwn && (
                      <span>
                        {message.status === 'read' ? (
                          <CheckCheck className="h-3.5 w-3.5" />
                        ) : message.status === 'delivered' ? (
                          <CheckCheck className="h-3.5 w-3.5" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
