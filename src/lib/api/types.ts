export interface ReferenceItem {
  content: string
  dataset_id: string
  document_id: string
  document_name: string
  id: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  references?: Reference         // 实时对话时的引用格式
  reference?: ReferenceItem[]   // 历史消息中的引用格式
}

export interface ReferenceChunk {
  content: string
  document_id: string
  document_name: string
  dataset_id: string
  id: string
  similarity: number
}

export interface Reference {
  total: number
  chunks: ReferenceChunk[]
  doc_aggs: {
    doc_name: string
    doc_id: string
    count: number
  }[]
}

export interface Session {
  chat: string // chat_id
  id: string
  name: string
  create_date: string
  create_time: number
  update_date: string
  update_time: number
  messages: Message[]
}

export interface SessionResponse {
  code: number
  data: Session
}

export interface SessionListResponse {
  code: number
  data: Session[]
}

export interface ListSessionsParams {
  page?: number
  page_size?: number
  orderby?: 'create_time' | 'update_time'
  desc?: boolean
  name?: string
  id?: string
  user_id?: string
}

export interface ChatStreamResponse {
  code: number
  message?: string
  data: {
    answer?: string
    reference?: Reference
    audio_binary?: null
    id?: string
    session_id: string
  } | boolean
}

export interface ChatRequest {
  question: string
  stream?: boolean
  session_id?: string
  user_id?: string
}

export interface CreateSessionRequest {
  name: string
  user_id?: string
}

export interface ChatAssistant {
  avatar: string
  create_date: string
  create_time: number
  description: string
  do_refer: string
  id: string
  dataset_ids: string[]
  language: string
  llm: {
    frequency_penalty: number
    model_name: string
    presence_penalty: number
    temperature: number
    top_p: number
  }
  name: string
  prompt: {
    empty_response: string
    keywords_similarity_weight: number
    opener: string
    prompt: string
    rerank_model: string
    similarity_threshold: number
    top_n: number
    variables: Array<{
      key: string
      optional: boolean
    }>
  }
  prompt_type: string
  status: string
  tenant_id: string
  top_k: number
  update_date: string
  update_time: number
}

export interface ChatAssistantsResponse {
  code: number
  data: ChatAssistant[]
}
