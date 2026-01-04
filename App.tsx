import './src/global.css'
import type { FC } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { RouterProvider } from '@tanstack/react-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { router } from './src/router'
import { ReactQueryProvider } from './src/providers/query-provider'

const App: FC = () => {
  return (
    <SafeAreaProvider>
      <ReactQueryProvider>
        <View className="flex-1 bg-white">
          <RouterProvider router={router} />
          <StatusBar style="auto" />
        </View>
      </ReactQueryProvider>
    </SafeAreaProvider>
  )
}

export default App
