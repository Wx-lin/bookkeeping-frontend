import axios from 'axios'
import { useAuthStore } from '~/stores/auth'
import { toast } from 'sonner-native'

// 创建 axios 实例
export const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 从 Zustand store 获取 token
    const token = useAuthStore.getState().token

    console.log('token', token)

    if (token) {
      config.headers.token = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data) {
      return response.data.data
    }
    return response.data
  },
  (error) => {
    // 统一错误处理
    const message = error.response?.data?.message || error.message || '未知错误'

    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 未授权，登出并跳转
          toast.error('登录过期', { description: '请重新登录' })
          useAuthStore.getState().logout()
          break
        case 403:
          toast.error('权限不足', { description: message })
          break
        case 404:
          toast.error('资源未找到', { description: '请求的资源不存在' })
          break
        case 500:
          toast.error('服务器错误', { description: '服务器发生内部错误，请稍后重试' })
          break
        default:
          toast.error(message)
      }
    } else {
      toast.error('网络错误', { description: '请检查您的网络连接' })
    }
    return Promise.reject(error)
  }
)
