import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  createMemoryHistory,
} from '@tanstack/react-router'
import HomeScreen from './screens/HomeScreen'
import { AuthPage } from './screens/Login'
import { View } from 'react-native'

// 创建根路由
const rootRoute = createRootRoute({
  component: () => (
    <View className="flex-1">
      <Outlet />
    </View>
  ),
})

// 创建首页路由
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeScreen,
})

// 创建登录页路由
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: AuthPage,
})

// 创建路由树
const routeTree = rootRoute.addChildren([indexRoute, loginRoute])

// 创建内存历史记录（React Native 必须使用内存路由）
const memoryHistory = createMemoryHistory({
  initialEntries: ['/login'], // 默认进入登录页
})

// 创建路由器实例
export const router = createRouter({
  routeTree,
  history: memoryHistory,
})

// 注册路由类型，以便获得类型提示
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
