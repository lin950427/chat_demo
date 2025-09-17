import { useRef, useEffect } from 'react'
import { Message } from './message'
import { Welcome } from './welcome'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import type { Message as MessageType } from '@/lib/api/types'

interface MessageListProps {
    messages: MessageType[]
    isLoading?: boolean
    onQuestionClick?: (question: string) => void
    hasSession?: boolean
}

export function MessageList({ messages, isLoading, onQuestionClick, hasSession }: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const prevMessagesLengthRef = useRef(0)

    useEffect(() => {
        requestAnimationFrame(() => {
            if (bottomRef.current) {
                // 如果是从 0 变为多个消息，说明是加载了历史记录
                const isLoadingHistory = prevMessagesLengthRef.current === 0 && messages.length > 1

                bottomRef.current.scrollIntoView({
                    behavior: isLoadingHistory ? 'instant' : 'smooth'
                })

                prevMessagesLengthRef.current = messages.length
            }
        })
    }, [messages])

    return (
        <ScrollArea.Root className="h-full w-full">
            <ScrollArea.Viewport className="h-full w-full" ref={scrollRef}>
                <div className="flex flex-col gap-4 p-4">
                    {!hasSession ? (
                        <Welcome onQuestionClick={onQuestionClick} />
                    ) : (
                        <>
                            {/* 消息列表 */}
                            {messages.map((message, index) => (
                                <Message
                                    key={index}
                                    message={message}
                                    isLoading={false}
                                />
                            ))}
                            
                            {/* Loading效果 */}
                            {isLoading && messages[messages.length - 1].role === 'user' && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2">
                                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                                </div>
                            )}
                        </>
                    )}
                    
                    {/* 用于滚动的锚点元素 */}
                    <div ref={bottomRef} className="h-px w-full" />
                </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    )
}
