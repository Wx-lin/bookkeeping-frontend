import './src/global.css';
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import HomeScreen from './src/screens/HomeScreen'

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      {/* 这里引入了 src/screens/HomeScreen 组件 */}
      <HomeScreen />
      <StatusBar style="auto" />
    </View>
  )
}
