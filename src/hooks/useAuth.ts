import { useState, useEffect, useCallback } from 'react'
import { useLocalStorageState } from 'ahooks'
import { getUserInfo, getUserInfoByCode, getFullRedirectUrl } from '../lib/api/user'
import type { Platform, AuthState } from '../lib/api/types'
import { getUrlParams } from '@/lib/utils'

const ACCESS_TOKEN_KEY = 'user_access_token'

// 检测平台类型
const getPlatformSource = (platform: Platform): 'app' | 'h5' => {
  switch (platform) {
    case 'eshimin':
      return 'app'
    case 'weixinmini':
    case 'weixinmp':
    case 'alipaymini':
    case 'alipayfuwu':
      return 'h5'
    default:
      return 'h5'
  }
}

interface UseAuthReturn extends AuthState {
  authenticateUser: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true
  })

  const [, setAccessToken] = useLocalStorageState<string | undefined>(
    ACCESS_TOKEN_KEY,
    { defaultValue: undefined }
  )

  const [userId, setUserId] = useState<string | undefined>(undefined)


  // 开始随申办授权
  const startEshiminAuth = useCallback(async () => {
    try {
      const currentUrl = window.location.href.split('?')[0] // 移除现有参数
      const redirectUrl = await getFullRedirectUrl(currentUrl)
      if (redirectUrl) {
        console.log("Redirecting to:", redirectUrl);
        location.replace(redirectUrl)
      }
    } catch (error) {
      console.error('Failed to get redirect URL:', error)
      // 如果授权失败，允许用户继续使用（无用户ID）
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        platform: 'eshimin',
        error: '授权失败，将以访客身份继续'
      })
    }
  }, [])

  const verifyByAccessToken = useCallback(async (accessToken: string) => {
    try {
      console.log('使用存储的 access token 获取用户信息:', accessToken);
      const userInfo = await getUserInfo({
        accessToken,
        source: 'app'
      })
      console.log('使用存储的 access token 获取到用户信息:', userInfo)
      setUserId(userInfo.userId)
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        userId: userInfo.userId,
        platform: 'eshimin'
      })
    } catch (error) {
      console.log('使用存储的 access token 获取用户信息失败:', error)
      console.error('Access token expired:', error)
      // token 过期，清除存储并重新授权
      setAccessToken(undefined)
      setUserId(undefined)
      await startEshiminAuth()
    }
  }, [setAccessToken, startEshiminAuth]);

  const verifyByCode = useCallback(async (code: string) => {
    console.log('获取到 code:', code, '直接使用 code 换取用户信息');
    // 有 code 参数，使用 code 获取用户信息
    try {
      const userInfo = await getUserInfoByCode(code)
      setAccessToken(userInfo?.access_token?.access_token)
      setUserId(userInfo?.user_info?.userId)
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        userId: userInfo?.user_info?.userId,
        platform: 'eshimin'
      })

      console.log('随申办认证获取到用户信息:', userInfo)

      // 清除 URL 中的 code 参数
      const url = new URL(window.location.href)
      window.history.replaceState({}, '', url.toString())
    } catch (error) {
      console.error('Failed to get user info by code:', error)
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        platform: 'eshimin',
        error: '授权失败，请重试'
      })
    }
  }, [setAccessToken]);


  // 微信/支付宝环境处理
  const handleThirdPartyAuth = useCallback(async (platform: Platform, accessToken: string) => {
    try {
      const source = getPlatformSource(platform)
      const userInfo = await getUserInfo({
        accessToken,
        source
      })

      console.log('第三方认证获取到用户信息:', userInfo)

      setUserId(userInfo.userId)
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        userId: userInfo.userId,
        platform
      })
    } catch (error) {
      console.error('Failed to get user info from third party:', error)
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        platform,
        error: '获取用户信息失败'
      })
    }
  }, [setUserId])

  // 主认证函数
  const authenticateUser = useCallback(async () => {
    console.log('开始认证流程');
    setAuthState(prev => ({ ...prev, isLoading: true, error: undefined }))

    const { platform, accessToken: urlAccessToken, code } = getUrlParams()

    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    console.log('Detected platform:', platform, 'URL access token:', urlAccessToken, 'fullURL:', window.location.href);

    if (code) {
      await verifyByCode(code)
    } else if (accessToken) {
      // 有存储的 access_token，尝试获取用户信息
      await verifyByAccessToken(accessToken)
    } else if (!platform) {
      // 没有平台参数，直接进入系统（开发环境或直接访问）
      setAuthState({
        isAuthenticated: true,
        isLoading: false
      })
    } else if (urlAccessToken && ['weixinmini', 'weixinmp', 'alipaymini', 'alipayfuwu'].includes(platform)) {
      console.log('进入第三方平台认证流程');
      await handleThirdPartyAuth(platform, urlAccessToken)
    } else if (platform === 'eshimin') {
      console.log('进入随申办认证流程');
      await startEshiminAuth()
    } else {
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        platform,
        error: '缺少必要的认证参数'
      })
    }
  }, [handleThirdPartyAuth, startEshiminAuth, verifyByAccessToken, verifyByCode])


  // 初始化时执行认证
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      if (mounted) {
        await authenticateUser()
      }
    }

    initAuth()

    return () => {
      mounted = false
    }
  }, [])


  return {
    ...authState,
    authenticateUser,
    userId
  }
}
// 23a3861c-344a-4855-8a80-46987d36303c