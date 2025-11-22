import axios from "axios"
import api from "./axios"
import type { ActionType } from "./types"
import { USER_ID_KEY } from "@/constant";

/**
 * 上报接口
 */
export const reportAction = async (
    action: ActionType
): Promise<{ unique_id: string, action: ActionType, user_agent: string, ip_address: string }> => {
    try {
        const userId = localStorage.getItem(USER_ID_KEY) || '';
        const response = await api.postForm('/eshimin/dataReport.php', {
            unique_id: userId || '',
            action
        })
        return response?.data?.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to get redirect URL')
        }
        throw error
    }

}