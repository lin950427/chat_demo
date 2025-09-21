import type { AxiosInstance } from "axios"
import axios from "axios"

const BASE_URL = import.meta.env.VITE_RAGFLOW_API_URL || 'http://localhost:8000'

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

/**
 * 获取跳转url
 */
export const getFullRedirectUrl = async (redirectUri: string): Promise<string> => {
    try {
        const response = await api.post('/eshimin/authorize.php', { redirect_uri: redirectUri })
        return response.data.authorize_url
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to get redirect URL')
        }
        throw error
    }

}


/**
 * 获取用户信息
 */
export const getUserInfo = async ({
    accessToken,
    source
}: {
    accessToken: string
    source: 'app' | 'h5'
}): Promise<{ access_token: string, userId: string }> => {
    try {
        const response = await api.post('/eshimin/login.php', { source, access_token: accessToken })
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user info')
        }
        throw error
    }
}

/**
 * 使用code获取用户信息及accessToken
 */
export const getUserInfoByCode = async (code: string): Promise<{
    access_token: string,
    expires_in: number,
    refresh_token: string,
    userId: string,
    username: string
}> => {
    try {
        const response = await api.post('/eshimin/accessToken.php', { code })
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user info by code')
        }
        throw error
    }
}