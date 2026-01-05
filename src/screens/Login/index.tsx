import { useState } from 'react'
import { View, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { Mail, KeyRound, CheckCircle2, TrendingUp, Wallet } from 'lucide-react-native'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Text } from '~/components/ui/text'
import { ThemeToggle } from '~/components/theme-toggle'
import { cn } from '~/lib/utils'
import { iconWithClassName } from '~/lib/icons/icon-with-classname'
import { api } from '~/lib/api'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'

// Register icons for className support
iconWithClassName(Mail)
iconWithClassName(KeyRound)
iconWithClassName(CheckCircle2)
iconWithClassName(TrendingUp)
iconWithClassName(Wallet)

type AuthMode = 'login' | 'register'

export function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const login = useAuthStore((state) => state.login)

  const loginMutation = useMutation({
    mutationFn: api.auth.login,
    onSuccess: async (data: any) => {
      // 这里的 data 已经是 AuthResponse，因为拦截器处理过
      await login(data.token, data.user)
      toast.success('登录成功')
      router.navigate({ to: '/' })
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || '登录失败'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    },
  })

  const registerMutation = useMutation({
    mutationFn: api.auth.signup,
    onSuccess: async (data: any) => {
      await login(data.access_token, data.user)
      toast.success('注册成功')
      router.navigate({ to: '/' })
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || '注册失败'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    },
  })

  const isLoading = loginMutation.isPending || registerMutation.isPending

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.warning('请输入邮箱和密码')
      return
    }

    if (mode === 'register' && password !== confirmPassword) {
      toast.warning('两次输入的密码不一致')
      return
    }

    if (mode === 'login') {
      loginMutation.mutate({ email, password })
    } else {
      registerMutation.mutate({ email, password })
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        <View className="flex-1 justify-center px-8 py-12">
          {/* Theme Toggle - Absolute Position */}
          <View className="absolute top-12 right-6 z-50">
            <ThemeToggle />
          </View>

          {/* Logo & Header */}
          <View className="flex flex-col items-center mb-12 gap-8">
            <View className="relative">
              <View className="absolute inset-0 bg-amber-500/20 rounded-3xl scale-110" />
              <View className="relative bg-amber-500 p-8 rounded-3xl shadow-xl">
                <Wallet className="w-16 h-16 text-white" />
                <TrendingUp className="w-10 h-10 text-white absolute bottom-1 right-1" />
              </View>
            </View>

            <View className="items-center gap-2">
              <Text className="text-4xl font-bold text-foreground text-center tracking-tight">
                欢迎使用
              </Text>
              <Text className="text-lg text-muted-foreground text-center">
                安全、极简的账户系统
              </Text>
            </View>
          </View>

          {/* Mode Toggle */}
          <View className="flex-row gap-2 mb-10 p-1.5 bg-muted/50 rounded-2xl h-16 items-center">
            <Button
              variant="ghost"
              size="lg"
              className={cn(
                'flex-1 h-full rounded-xl',
                mode === 'login' ? 'bg-background shadow-sm' : ''
              )}
              onPress={() => setMode('login')}
            >
              <Text
                className={cn(
                  'text-lg font-semibold',
                  mode === 'login' ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                登录
              </Text>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className={cn(
                'flex-1 h-full rounded-xl',
                mode === 'register' ? 'bg-background shadow-sm' : ''
              )}
              onPress={() => setMode('register')}
            >
              <Text
                className={cn(
                  'text-lg font-semibold',
                  mode === 'register' ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                注册
              </Text>
            </Button>
          </View>

          {/* Form */}
          <View className="gap-6">
            {/* Email Input */}
            <View className="gap-3">
              <Label className="sr-only">邮箱</Label>
              <View className="relative group w-full">
                <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                  <Mail className="w-6 h-6 text-muted-foreground" />
                </View>
                <Input
                  size="lg"
                  placeholder={mode === 'login' ? '邮箱/用户名' : '邮箱'}
                  value={email}
                  onChangeText={setEmail}
                  textAlignVertical="center"
                  className="pl-14 bg-muted/30 border-border/50 rounded-2xl py-0 leading-none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="gap-3">
              <Label className="sr-only">{mode === 'login' ? '密码' : '设置密码'}</Label>
              <View className="relative group w-full">
                <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                  <KeyRound className="w-6 h-6 text-muted-foreground" />
                </View>
                <Input
                  size="lg"
                  secureTextEntry
                  placeholder={mode === 'login' ? '密码' : '设置密码'}
                  value={password}
                  onChangeText={setPassword}
                  textAlignVertical="center"
                  className="pl-14 bg-muted/30 border-border/50 rounded-2xl py-0"
                />
              </View>
            </View>

            {/* Confirm Password Input - Only for Register */}
            {mode === 'register' && (
              <View className="gap-3">
                <Label className="sr-only">确认密码</Label>
                <View className="relative group w-full">
                  <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
                    <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
                  </View>
                  <Input
                    size="lg"
                    secureTextEntry
                    placeholder="确认密码"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    textAlignVertical="center"
                    className="pl-14 bg-muted/30 border-border/50 rounded-2xl py-0"
                  />
                </View>
              </View>
            )}

            {/* Submit Button */}
            <Button
              onPress={handleSubmit}
              disabled={isLoading}
              className="w-full h-16 bg-amber-500 active:bg-amber-600 shadow-lg shadow-amber-500/30 rounded-2xl mt-4"
            >
              <Text className="text-white font-bold text-xl">
                {isLoading ? '处理中...' : mode === 'login' ? '登录' : '注册新账号'}
              </Text>
            </Button>

            {/* Footer Links */}
            {mode === 'login' ? (
              <View className="items-center mt-4">
                <Pressable onPress={() => toast.info('功能开发中')} hitSlop={10}>
                  <Text className="text-sm text-muted-foreground active:text-amber-600">
                    忘记密码？
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-center mt-4">
                <Text className="text-xs text-center text-muted-foreground leading-relaxed">
                  点击注册即表示您同意我们的
                </Text>
                <Pressable className="mx-1" onPress={() => toast.info('功能开发中')}>
                  <Text className="text-xs text-amber-600 font-medium">服务条款</Text>
                </Pressable>
                <Text className="text-xs text-muted-foreground">和</Text>
                <Pressable className="ml-1" onPress={() => toast.info('功能开发中')}>
                  <Text className="text-xs text-amber-600 font-medium">隐私政策</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
