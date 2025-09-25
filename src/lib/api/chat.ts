import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { 
  ChatRequest, 
  ChatStreamResponse, 
  CreateSessionRequest, 
  SessionResponse,
  ChatAssistantsResponse,
  SessionListResponse,
  ListSessionsParams,
  Message
} from './types'

const RAGFLOW_API_URL = import.meta.env.VITE_RAGFLOW_API_URL
const RAGFLOW_API_KEY = import.meta.env.VITE_RAGFLOW_API_KEY

// 创建axios实例，开发环境使用相对路径（会走 Vite 代理），生产环境使用完整 URL
const createApiInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: RAGFLOW_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RAGFLOW_API_KEY}`
    },
    timeout: 600000, // 设置60秒超时时间
  })
}

// 全局 axios 实例
const api = createApiInstance()

/**
 * 创建新的会话
 */
export const createSession = async (
  chatId: string,
  name: string, 
  userId?: string
): Promise<{ id: string; messages: Message[] }> => {
  try {
    if (!chatId) {
      throw new Error('Chat ID is required')
    }

    const request: CreateSessionRequest = {
      name,
      user_id: userId
    }

    const response = await api.post<SessionResponse>(
      `/api/v1/chats/${chatId}/sessions`,
      request
    )

    if (response.data.code === 0) {
      return { id: response.data.data.id, messages: response.data.data.messages }
    }
    
    throw new Error('Failed to create session')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create session')
    }
    throw error
  }
}

/**
 * 发送消息并获取回复
 */
export const sendMessage = async (
  chatId: string,
  question: string,
  sessionId?: string,
  onData?: (data: ChatStreamResponse) => void
): Promise<void> => {
  try {
    if (!chatId) {
      throw new Error('Chat ID is required')
    }

    const request: ChatRequest = {
      question,
      stream: true,
      session_id: sessionId
    }

    await api.post(
      `/api/v1/chats/${chatId}/completions`,
      request,
      {
        responseType: 'text',
        headers: {
          'Accept': 'text/event-stream'
        },
        onDownloadProgress: (progressEvent) => {
          const chunk = progressEvent.event.target.responseText
          const lines = chunk.split('\n').filter((item: string) => item !== '');

          const length = lines.length;
          if (length > 3) {
            // 只保留最后3行，防止内存占用过高
            lines.splice(0, length - 3);
          }

          console.log('Received SSE chunk:', lines);
          
          for (const line of lines) {
            if (line.trim() && line.startsWith('data:')) {
              try {
                const data = JSON.parse(line.slice(5)) as ChatStreamResponse
                // 发送给回调函数处理
                console.log('Parsed SSE data:', data);
                onData?.(data)
              } catch (e) {
                console.error('Failed to parse SSE message:', line, e)
              }
            }
          }
        }
      }
    )
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to send message')
    }
    throw error
  }
}

/**
 * 获取会话列表
 */
export const listSessions = async (
  chatId: string,
  params: ListSessionsParams = {}
): Promise<SessionListResponse> => {
  try {
    if (!chatId) {
      throw new Error('Chat ID is required')
    }

    const response = await api.get<SessionListResponse>(
      `/api/v1/chats/${chatId}/sessions`,
      {
        params: {
          page: params.page || 1,
          page_size: params.page_size || 10,
          orderby: params.orderby || 'create_time',
          desc: params.desc ?? true,
          name: params.name,
          id: params.id,
          user_id: params.user_id
        }
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to list sessions')
    }
    throw error
  }
}

/**
 * 删除指定的会话
 */
export const deleteSessions = async (chatId: string, sessionIds: string[]): Promise<void> => {
  try {
    if (!chatId) {
      throw new Error('Chat ID is required')
    }

    await api.delete(`/api/v1/chats/${chatId}/sessions`, {
      data: {
        ids: sessionIds
      }
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete sessions')
    }
    throw error
  }
}

/**
 * 重置会话（删除指定会话）
 */
export const resetSession = async (chatId: string, sessionId: string): Promise<void> => {
  await deleteSessions(chatId, [sessionId])
}

/**
 * 获取聊天助手列表
 */
export const listAssistants = async (params: {
  page?: number
  page_size?: number
  orderby?: 'create_time' | 'update_time'
  desc?: boolean
  name?: string
  id?: string
} = {}): Promise<ChatAssistantsResponse> => {
  try {
    const response = await api.get<ChatAssistantsResponse>('/api/v1/chats', {
      params: {
        page: params.page || 1,
        page_size: params.page_size || 10,
        orderby: params.orderby || 'create_time',
        desc: params.desc ?? true,
        name: params.name,
        id: params.id
      }
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to list chat assistants')
    }
    throw error
  }
}

/**
 * 获取文件的 MIME 类型
 */
const getMimeType = (fileName: string): string => {
  const extension = fileName.toLowerCase().split('.').pop() || ''
  const mimeTypes: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'mp4': 'video/mp4',
    'mp3': 'audio/mpeg',
    'json': 'application/json',
    'xml': 'application/xml',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed'
  }
  return mimeTypes[extension] || 'application/octet-stream'
}

/**
 * 下载文档
 */
export const downloadDocument = async (
  datasetId: string, 
  documentId: string, 
  fileName: string
): Promise<Blob> => {
  try {
    const response = await api.get(
      `/api/v1/datasets/${datasetId}/documents/${documentId}`,
      {
        responseType: 'blob',
        headers: {
          'Accept': '*/*'
        }
      }
    )

    // 创建新的 Blob，使用正确的 MIME 类型
    const mimeType = getMimeType(fileName)
    return new Blob([response.data], { type: mimeType })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to download document')
    }
    throw error
  }
}
