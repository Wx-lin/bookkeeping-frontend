import './src/global.css'
import type { FC } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { RouterProvider } from '@tanstack/react-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { router } from './src/router'
import { ReactQueryProvider } from './src/providers/query-provider'
import { Toaster } from 'sonner-native'
import { useColorScheme } from 'nativewind'
import { cn } from '~/lib/utils'

const App: FC = () => {
  const { colorScheme } = useColorScheme()

  return (
    <SafeAreaProvider>
      <ReactQueryProvider>
        <View className={cn('flex-1 bg-background', `theme-${colorScheme}`)}>
          <RouterProvider router={router} />
          <StatusBar style="auto" />
          <Toaster richColors closeButton position="top-center" theme={colorScheme} />
        </View>
      </ReactQueryProvider>
    </SafeAreaProvider>
  )
}

export default App
