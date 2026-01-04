import './src/global.css'
import type { FC } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { RouterProvider } from '@tanstack/react-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { router } from './src/router'
import { ReactQueryProvider } from './src/providers/query-provider'
import { Toaster } from 'sonner-native'
import { useColorScheme } from 'nativewind'
import { cn } from '~/lib/utils'
import { useAuthStore } from '~/stores/auth'
import { useEffect } from 'react'

const AppContent: FC = () => {
  const { colorScheme } = useColorScheme()
  return (
    <View className={cn('flex-1 bg-background', `theme-${colorScheme}`)}>
      <RouterProvider router={router} />
      <StatusBar style="auto" />
      <Toaster richColors closeButton position="top-center" theme={colorScheme} />
    </View>
  )
}

const App: FC = () => {
  const initialize = useAuthStore((s) => s.initialize)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated and finished loading
    if (!isLoading && !isAuthenticated) {
        router.navigate({ to: '/login' })
    }
  }, [isLoading, isAuthenticated])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReactQueryProvider>
           <AppContent />
        </ReactQueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
