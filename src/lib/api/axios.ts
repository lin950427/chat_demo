import type { AxiosInstance } from "axios"
import axios from "axios"

const BASE_URL = import.meta.env.VITE_RAGFLOW_API_URL

const createApiInstance = (): AxiosInstance => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

// 全局 axios 实例
const api = createApiInstance()

export default api