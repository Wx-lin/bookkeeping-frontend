import { Text, View } from 'react-native'

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold mb-2.5">Hello from src/screens/HomeScreen!</Text>
      <Text className="text-base text-gray-500">你的大部分页面代码应该写在 screens 目录下</Text>
    </View>
  )
}
