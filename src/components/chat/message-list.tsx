import { useRef, useEffect, useState } from 'react'
import { Message } from './message'
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
    const [showScrollBottom, setShowScrollBottom] = useState(false)

    // 监听滚动事件
    const handleScroll = () => {
        if (!scrollRef.current) return
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight
        // 如果距离底部超过200px就显示按钮
        setShowScrollBottom(distanceFromBottom > 200)
    }

    // 滚动到底部的函数
    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        const scrollElement = scrollRef.current
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll)
            return () => scrollElement.removeEventListener('scroll', handleScroll)
        }
    }, [])

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

    console.log('MessageList Rendered, messages:', messages)

    return (
        <ScrollArea.Root className="h-full w-screen">
            <ScrollArea.Viewport className="h-full w-full" ref={scrollRef}>
                <div className="flex flex-col gap-4 px-4 pt-7 pb-4">
                    {!hasSession ? (
                        null
                    ) : (
                        <>
                            {/* 消息列表 */}
                            {messages.map((message, index) => (
                                <Message
                                    key={index}
                                    message={message}
                                    isLoading={false}
                                    isWelcomeMessage={messages.length === 1 && message.role !== 'user'}
                                    onQuestionClick={onQuestionClick}
                                />
                            ))}

                            {/* Loading效果 */}
                            {isLoading && messages[messages.length - 1].role === 'user' && (
                                <Message
                                    message={{
                                        role: 'assistant',
                                        content: '正在输入'
                                    }}
                                    isLoading={true}
                                />
                            )}
                        </>
                    )}

                    {/* 用于滚动的锚点元素 */}
                    <div ref={bottomRef} className="h-px w-full" />
                </div>

                {/* 返回底部按钮 */}
                {showScrollBottom && (
                    <button
                        onClick={scrollToBottom}
                        className="w-[30px] h-[30px] bg-white left-1/2 -translate-x-1/2 flex justify-center border border-solid border-[#D8C9A9] items-center fixed bottom-28 right-4 z-[20] p-2 rounded-full transition-colors"
                        aria-label="返回底部"
                    >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.2178 5.78217C11.5107 6.07506 11.5107 6.54994 11.2178 6.84283L6.53033 11.5303C6.23744 11.8232 5.76256 11.8232 5.46967 11.5303L0.782169 6.84283C0.489276 6.54994 0.489276 6.07506 0.782169 5.78217C1.07506 5.48928 1.54994 5.48928 1.84283 5.78217L5.25 9.18934L5.25 1C5.25 0.585786 5.58579 0.25 6 0.25C6.41421 0.25 6.75 0.585786 6.75 1L6.75 9.18934L10.1572 5.78217C10.4501 5.48928 10.9249 5.48928 11.2178 5.78217Z" fill="#333333" />
                        </svg>

                    </button>
                )}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    )
}
