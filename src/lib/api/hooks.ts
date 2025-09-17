import { useCallback, useEffect, useState } from 'react'
import type { Message, Session } from './types'
import * as chatApi from './chat'
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

export function useChat(): UseChat {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [sessions, setSessions] = useState<Session[]>([])
    const [currentChatId, setCurrentChatId] = useState<string>()
    const [currentSessionId, setCurrentSessionId] = useSessionStorageState<string | undefined>(
        SESSION_ID_KEY,
        { defaultValue: undefined }
    )

    console.log('Current Session ID:', currentSessionId)

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
                    const formattedMessages = (session.messages || []).map((msg: any) => {
                        if (msg.role === 'assistant' && msg.reference) {
                            // 如果是从 session 获取的消息，reference 字段直接就是 Reference 类型
                            return {
                                ...msg,
                                references: msg.reference // 转换为 references 字段
                            }
                        }
                        return msg
                    })
                    setMessages(formattedMessages)
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

                    // 2. 检查是否有存储的会话ID，直接传递 chatId
                    if (currentSessionId) {
                        await initSession(chatId, currentSessionId)
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
                let newSessionId = currentSessionId

                // 如果没有会话ID，先创建一个新会话
                if (!newSessionId) {
                    newSessionId = await chatApi.createSession(currentChatId, 'New Chat')
                    setCurrentSessionId(newSessionId)
                }

                await chatApi.sendMessage(currentChatId, question, newSessionId, (data: any) => {
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
        [currentChatId, currentSessionId, setCurrentSessionId]
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
