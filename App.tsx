import './src/global.css'
import type { FC } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './src/router'

const App: FC = () => {
  return (
    <View className="flex-1 bg-white">
      <RouterProvider router={router} />
      <StatusBar style="auto" />
    </View>
  )
}

export default App
