import axios from "axios"
import api from "./axios"
import type { QuestionData } from "./types"

/**
 * 预设问题question
 */
export const getQuestions = async (): Promise<QuestionData> => {
    try {
        const response = await api.get('/eshimin/question.php')
        return response?.data?.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to get redirect URL')
        }
        throw error
    }

}