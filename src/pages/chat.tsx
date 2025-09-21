import { Layout } from "@/components/layout/layout";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatHeader } from "@/components/chat/chat-header";
import { useChat } from "@/hooks/useChat";

interface ChatPageProps {
  userId?: string;
}

export default function ChatPage({ userId }: ChatPageProps) {
  const { messages, sendMessage, isLoading, currentSessionId } = useChat({ userId });

  return (
    <Layout bannerHeight={0} className="bg-warm-brown-50">
      {/* 头部区域 */}
      <ChatHeader />
      
      {/* 消息列表区域，需要为顶部和底部输入框及安全距离预留空间 */}
      <div 
      className="mt-[78px] h-[calc(100dvh-78px-101px-env(safe-area-inset-bottom))] fixed" 
      style={{
        background: 'linear-gradient(180deg, #ddd0b6 0%, #f2f1ed 10%, #f2f1ed 100%)',
      }}>
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onQuestionClick={sendMessage}
          hasSession={!!currentSessionId}
        />
      </div>

      {/* 固定在底部的输入框 */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pb-[env(safe-area-inset-bottom,0px)]" style={{
        background: 'linear-gradient(180deg, #f2f1ed 0%, #CBB486 100%)',
      }}>
        <ChatInput onSubmit={sendMessage} disabled={isLoading} />
      </div>
    </Layout>
  );
}
