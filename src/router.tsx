/*
 * @Author: 王薪林 10655211+wang-xinlinlin@user.noreply.gitee.com
 * @Date: 2025-12-12 21:43:21
 * @LastEditors: 王薪林 10655211+wang-xinlinlin@user.noreply.gitee.com
 * @LastEditTime: 2025-12-14 20:50:06
 * @FilePath: /rn/rn-app/src/router.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  createMemoryHistory,
} from '@tanstack/react-router'
import HomeScreen from './screens/HomeScreen'
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

// 创建路由树
const routeTree = rootRoute.addChildren([indexRoute])

// 创建内存历史记录（React Native 必须使用内存路由）
const memoryHistory = createMemoryHistory({
  initialEntries: ['/'], // 默认进入登录页
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
