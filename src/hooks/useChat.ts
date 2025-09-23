import { useCallback, useEffect, useState } from 'react'
import type { Message, Session } from '../lib/api/types'
import * as chatApi from '../lib/api/chat'
import { useSessionStorageState } from 'ahooks'

const SESSION_ID_KEY = 'chat_session_id'

interface UseChat {
    messages: Message[]
    sendMessage: (message: string) => Promise<void>
    isLoading: boolean
    resetChat: () => Promise<void>
    sessions: Session[]
    loadSessions: () => Promise<void>
    deleteSession: (sessionId: string) => Promise<void>
    currentSessionId?: string
}

interface UseChatProps {
    userId?: string
}

export function useChat({ userId }: UseChatProps = {}): UseChat {
    console.log(`useChat 中的 userId: ${userId}`)
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [sessions, setSessions] = useState<Session[]>([])
    const [currentChatId, setCurrentChatId] = useState<string>()
    const [currentSessionId, setCurrentSessionId] = useSessionStorageState<string | undefined>(
        SESSION_ID_KEY,
        { defaultValue: undefined }
    )


    // 加载会话列表
    const loadSessions = useCallback(async () => {
        try {
            if (!currentChatId) return
            const response = await chatApi.listSessions(currentChatId)
            if (response.code === 0) {
                setSessions(response.data)
            }
        } catch (error) {
            console.error('Failed to load sessions:', error)
        }
    }, [currentChatId])

    // 初始化会话
    const initSession = useCallback(async (chatId: string, sessionId?: string) => {
        if (sessionId && chatId) {
            try {
                // 查询指定会话的消息
                const response = await chatApi.listSessions(chatId, { id: sessionId })
                if (response.code === 0 && response.data.length > 0) {
                    const session = response.data[0]
                    // 处理历史消息中的 reference 字段格式
                    const formattedMessages = (session.messages || []).map((msg) => {
                        if (msg.role === 'assistant' && msg.reference) {
                            // 如果是从 session 获取的消息，reference 字段直接就是 Reference 类型
                            return {
                                ...msg,
                                references: msg.reference // 转换为 references 字段
                            }
                        }
                        return msg
                    })
                    setMessages(formattedMessages as Message[])
                    setCurrentSessionId(sessionId)
                } else {
                    // 如果会话不存在，清除存储的会话ID
                    setCurrentSessionId(undefined)
                    setMessages([])
                }
            } catch (error) {
                console.error('Failed to load session:', error)
                setCurrentSessionId(undefined)
                setMessages([])
            }
        }
    }, [setCurrentSessionId])

    // 在组件挂载时初始化
    useEffect(() => {
        const init = async () => {
            try {
                // 1. 获取聊天助手列表并设置第一个助手
                const assistantsResponse = await chatApi.listAssistants()
                if (assistantsResponse.code === 0 && assistantsResponse.data.length > 0) {
                    const chatId = assistantsResponse.data[0].id
                    setCurrentChatId(chatId)

                    // 2. 检查是否有存储的会话ID
                    if (currentSessionId) {
                        // 如果有现有会话ID，尝试加载该会话
                        await initSession(chatId, currentSessionId)
                    } else {
                        // 如果没有会话ID，直接创建一个新会话
                        const newSession = await chatApi.createSession(chatId, 'new session', userId)
                        setCurrentSessionId(newSession?.id)
                        // 新会话无需加载历史消息，直接设置空消息列表
                        setMessages(newSession?.messages || [])
                    }
                }
            } catch (error) {
                console.error('Failed to initialize chat:', error)
            }
        }

        init()
    }, []) // 只在组件挂载时执行一次

    const sendMessage = useCallback(
        async (question: string) => {
            try {
                if (!currentChatId) {
                    console.error('No chat ID available')
                    return
                }

                setIsLoading(true)
                // 添加用户消息
                setMessages((prev) => [...prev, { role: 'user', content: question }])

                let currentResponse = ''
                let sessionId = currentSessionId

                // 万一会话ID丢失，创建一个新会话
                if (!sessionId) {
                    const newSession = await chatApi.createSession(currentChatId, 'new session', userId)
                    setCurrentSessionId(newSession?.id)
                    sessionId = newSession?.id
                }

                // 发送消息
                await chatApi.sendMessage(currentChatId, question, sessionId, (data) => {
                    if (data.code === 0 && typeof data.data !== 'boolean') {
                        // 保存会话 ID
                        if (data.data.session_id && !currentSessionId) {
                            setCurrentSessionId(data.data.session_id)
                        }

                        // 处理答案和引用
                        if (data.data.answer) {
                            currentResponse = data.data.answer
                            const reference = data.data.reference

                            setMessages((prev) => {
                                const newMessages = [...prev]
                                const lastMessage = newMessages[newMessages.length - 1]

                                // 更新或添加助手消息
                                if (lastMessage && lastMessage.role === 'assistant') {
                                    lastMessage.content = currentResponse
                                    if (reference) {
                                        lastMessage.references = reference
                                    }
                                } else {
                                    newMessages.push({
                                        role: 'assistant',
                                        content: currentResponse,
                                        references: reference
                                    })
                                }

                                return newMessages
                            })
                        }
                    }
                })

                // 重新加载会话列表以获取最新状态
                // await loadSessions()
            } catch (error) {
                console.error('Failed to send message:', error)
            } finally {
                setIsLoading(false)
            }
        },
        [currentChatId, currentSessionId, setCurrentSessionId, userId]
    )

    const resetChat = useCallback(async () => {
        if (currentChatId && currentSessionId) {
            await chatApi.resetSession(currentChatId, currentSessionId)
        }
        setMessages([])
        setCurrentSessionId(undefined)
        await loadSessions()
    }, [currentChatId, currentSessionId, loadSessions, setCurrentSessionId])

    // 删除会话
    const deleteSession = useCallback(async (sessionId: string) => {
        try {
            if (!currentChatId) return

            await chatApi.deleteSessions(currentChatId, [sessionId])
            if (sessionId === currentSessionId) {
                setCurrentSessionId(undefined)
                setMessages([])
            }
            await loadSessions()
        } catch (error) {
            console.error('Failed to delete session:', error)
        }
    }, [currentChatId, currentSessionId, setCurrentSessionId, loadSessions])

    return {
        messages,
        sendMessage,
        isLoading,
        resetChat,
        sessions,
        loadSessions,
        deleteSession,
        currentSessionId
    }

}
