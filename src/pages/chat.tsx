import { Layout } from "@/components/layout/layout";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { useChat } from "@/lib/api/hooks";

export default function ChatPage() {
  const { messages, sendMessage, isLoading, currentSessionId } = useChat();

  return (
    <Layout bannerHeight={0}>
      {/* 消息列表区域，需要为底部输入框预留空间 */}
      <div className="pb-32">
        {" "}
        {/* 为底部输入框预留足够空间 */}
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onQuestionClick={sendMessage}
          hasSession={!!currentSessionId}
        />
      </div>

      {/* 固定在底部的输入框 */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-200">
        <ChatInput onSubmit={sendMessage} disabled={isLoading} />
      </div>
    </Layout>
  );
}
