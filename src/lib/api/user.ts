import axios from "axios"
import api from "./axios"



/**
 * 获取跳转url
 */
export const getFullRedirectUrl = async (redirectUri: string): Promise<string> => {
    try {
        const response = await api.get('/eshimin/authorize.php', { params: { redirect_uri: redirectUri } })
        return response.data?.data?.authorize_url
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
        const response = await api.get('/eshimin/login.php', { params: { source, access_token: accessToken } })
        return response.data?.data
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
        const response = await api.get('/eshimin/accessToken.php', { params: { code } })
        return response?.data?.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user info by code')
        }
        throw error
    }
}