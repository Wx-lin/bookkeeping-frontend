import './src/global.css'
import type { FC } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import HomeScreen from './src/screens/HomeScreen'

const App: FC = () => {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <HomeScreen />
      <StatusBar style="auto" />
    </View>
  )
}

export default App
