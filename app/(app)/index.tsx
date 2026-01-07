import React, { useState, useMemo } from 'react'
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import { Text } from '~/components/ui/text'
import { Card } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { useQuery } from '@tanstack/react-query'
import { api, Transaction } from '~/lib/api'
import { format, startOfMonth, endOfMonth, isToday, isYesterday, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  Sun,
  Moon,
  TrendingUp,
  Utensils,
  Car,
  ShoppingBag,
  Plus,
  LogOut,
} from 'lucide-react-native'
import { useColorScheme } from 'nativewind'
import { iconWithClassName } from '~/lib/icons/icon-with-classname'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '~/stores/auth'

iconWithClassName(Sun)
iconWithClassName(Moon)
iconWithClassName(TrendingUp)
iconWithClassName(Utensils)
iconWithClassName(Car)
iconWithClassName(ShoppingBag)
iconWithClassName(Plus)
iconWithClassName(LogOut)

// Helper to group transactions by date
const groupTransactions = (transactions: Transaction[]) => {
  const groups: Record<string, Transaction[]> = {}
  transactions.forEach((t) => {
    const dateStr = t.date.split('T')[0]
    if (!groups[dateStr]) groups[dateStr] = []
    groups[dateStr].push(t)
  })
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
}

export default function DetailScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const [currentDate, setCurrentDate] = useState(new Date())
  const logout = useAuthStore((s) => s.logout)

  const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd')
  const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd')

  // Fetch Transactions
  const {
    data: transactionsData,
    refetch: refetchTransactions,
    isRefetching,
  } = useQuery({
    queryKey: ['transactions', startDate, endDate],
    queryFn: () => api.transactions.list({ startDate, endDate }),
  })

  // Fetch Stats (Trend) for summary
  const { data: trendData, refetch: refetchStats } = useQuery({
    queryKey: ['stats-trend', startDate, endDate],
    queryFn: () => api.stats.trend({ startDate, endDate }),
  })

  const summary = useMemo(() => {
    const income = trendData?.reduce((acc, curr) => acc + Number(curr.income), 0) || 0
    const expense = trendData?.reduce((acc, curr) => acc + Number(curr.expense), 0) || 0
    const balance = income - expense
    // Mock percentages for now as we don't have budget data
    const totalFlow = income + expense
    const expensePct = totalFlow ? Math.round((expense / totalFlow) * 100) : 0
    const incomePct = totalFlow ? Math.round((income / totalFlow) * 100) : 0

    return { income, expense, balance, expensePct, incomePct }
  }, [trendData])

  const transactionGroups = useMemo(() => {
    return groupTransactions(transactionsData?.data || [])
  }, [transactionsData])

  const onRefresh = () => {
    refetchTransactions()
    refetchStats()
  }

  const getCategoryIcon = (categoryName?: string) => {
    // Simple mapping based on name or fallback
    if (
      categoryName?.includes('餐饮') ||
      categoryName?.includes('星巴克') ||
      categoryName?.includes('饭')
    )
      return Utensils
    if (
      categoryName?.includes('交通') ||
      categoryName?.includes('滴滴') ||
      categoryName?.includes('车')
    )
      return Car
    return ShoppingBag
  }

  const getCategoryColor = (categoryName?: string) => {
    if (
      categoryName?.includes('餐饮') ||
      categoryName?.includes('星巴克') ||
      categoryName?.includes('饭')
    )
      return 'bg-orange-500'
    if (
      categoryName?.includes('交通') ||
      categoryName?.includes('滴滴') ||
      categoryName?.includes('车')
    )
      return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-2 flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-muted-foreground text-sm font-normal mb-1">
            {format(currentDate, 'M月', { locale: zhCN })}
          </Text>
          <Text className="text-3xl font-bold text-foreground">明细</Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={toggleColorScheme} className="items-center justify-center">
            <View className="rounded-full bg-secondary p-2 mb-1">
              {colorScheme === 'dark' ? (
                <Sun className="text-foreground w-5 h-5" />
              ) : (
                <Moon className="text-foreground w-5 h-5" />
              )}
            </View>
            <Text className="text-xs text-muted-foreground">主题</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => logout()} className="items-center justify-center">
            <View className="rounded-full bg-secondary p-2 mb-1">
              <LogOut className="text-foreground w-5 h-5" />
            </View>
            <Text className="text-xs text-muted-foreground">登出</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View className="flex-row gap-3 mt-2 mb-4">
          {/* Expense Card */}
          <Card className="flex-1 p-4 bg-card border-0 shadow-sm rounded-3xl">
            <View className="flex-row justify-between items-start mb-3">
              <View className="bg-secondary p-1.5 rounded-full">
                <TrendingUp className="text-orange-500 w-4 h-4" />
              </View>
              <Text className="text-muted-foreground text-xs mt-1">本月支出</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground mb-3" numberOfLines={1}>
              ¥{summary.expense.toLocaleString()}
            </Text>
            <View className="flex-row items-center gap-2">
              <Progress
                value={summary.expensePct}
                className="h-1.5 flex-1 bg-muted"
                indicatorClassName="bg-orange-500"
              />
              <Text className="text-xs text-muted-foreground w-8 text-right">
                {summary.expensePct}%
              </Text>
            </View>
          </Card>

          {/* Income Card */}
          <Card className="flex-1 p-4 bg-card border-0 shadow-sm rounded-3xl">
            <View className="flex-row justify-between items-start mb-3">
              <View className="bg-secondary p-1.5 rounded-full">
                <TrendingUp className="text-orange-500 w-4 h-4" />
              </View>
              <Text className="text-muted-foreground text-xs mt-1">本月收入</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground mb-3" numberOfLines={1}>
              ¥{summary.income.toLocaleString()}
            </Text>
            <View className="flex-row items-center gap-2">
              <Progress
                value={summary.incomePct}
                className="h-1.5 flex-1 bg-muted"
                indicatorClassName="bg-orange-500"
              />
              <Text className="text-xs text-muted-foreground w-8 text-right">
                {summary.incomePct}%
              </Text>
            </View>
          </Card>
        </View>

        {/* Balance Row */}
        <View className="flex-row justify-between items-center mb-6 px-1">
          <Text className="text-muted-foreground text-base font-medium">本月结余</Text>
          <Text className="text-orange-500 text-2xl font-bold">
            {summary.balance > 0 ? '+' : ''}¥{summary.balance.toLocaleString()}
          </Text>
        </View>

        {/* Transaction List */}
        {transactionGroups.map(([dateStr, items]) => {
          const date = parseISO(dateStr)
          let dateLabel = format(date, 'M月d日', { locale: zhCN })
          if (isToday(date)) dateLabel = `今天, ${dateLabel}`
          else if (isYesterday(date)) dateLabel = `昨天, ${dateLabel}`

          return (
            <View key={dateStr} className="mb-6">
              <Text className="text-muted-foreground text-xs mb-3 font-medium">{dateLabel}</Text>
              <View className="gap-3">
                {items.map((item) => {
                  const Icon = getCategoryIcon(item.category?.name || item.description)
                  const iconBg = getCategoryColor(item.category?.name || item.description)

                  return (
                    <View key={item.id} className="flex-row items-center bg-card p-4 rounded-3xl">
                      <View
                        className={`w-10 h-10 rounded-full items-center justify-center ${iconBg} mr-3`}
                      >
                        <Icon className="text-white w-5 h-5" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-foreground font-semibold text-base mb-0.5">
                          {item.description || item.category?.name || '未分类'}
                        </Text>
                        <Text className="text-muted-foreground text-xs">
                          {item.category?.name || '一般'} · {item.account?.name || '现金'}
                        </Text>
                      </View>
                      <Text
                        className={`font-bold text-base ${item.type === 'EXPENSE' ? 'text-foreground' : 'text-orange-500'}`}
                      >
                        {item.type === 'EXPENSE' ? '-' : '+'}
                        {Number(item.amount).toFixed(2)}
                      </Text>
                    </View>
                  )
                })}
              </View>
            </View>
          )
        })}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-28 right-6 w-16 h-16 bg-orange-500 rounded-full items-center justify-center shadow-xl z-50"
        activeOpacity={0.8}
        style={{
          shadowColor: '#f97316',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        <Plus className="text-white w-8 h-8" strokeWidth={3} />
      </TouchableOpacity>
    </SafeAreaView>
  )
}
