import type { FC } from 'react'
import { Text, View } from 'react-native'
import { Button } from '~/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { http } from '~/lib/http'

const HomeScreen: FC = () => {
  // 临时测试请求
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['health-check'],
    queryFn: () => http.get('/'), // 假设后端根路径有个欢迎语
    enabled: false, // 默认不自动请求，点击按钮再请求
  })

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold mb-2.5">Hello from src/screens/HomeScreen!</Text>
      <Text className="text-base text-gray-500 mb-4">
        你的大部分页面代码应该写在 screens 目录下
      </Text>

      <Button onPress={() => refetch()}>
        <Text>{isLoading ? '请求中...' : '测试网络请求'}</Text>
      </Button>

      {isError && <Text className="text-red-500 mt-2">请求失败，请检查控制台</Text>}
      {data && (
        <Text className="mt-2 text-green-600">
          响应数据: {JSON.stringify(data).slice(0, 50)}...
        </Text>
      )}
    </View>
  )
}

export default HomeScreen
