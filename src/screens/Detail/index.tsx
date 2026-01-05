import { useState, useMemo } from 'react'
import { View, SectionList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { format, startOfMonth, endOfMonth, isToday, isYesterday, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ChevronDown, Plus, List, PieChart, Wallet } from 'lucide-react-native'
import { api, Transaction } from '~/lib/api'
import { SummaryCard } from '~/components/summary-card'
import { TransactionItem } from './components/transaction-item'
import { iconWithClassName } from '~/lib/icons/icon-with-classname'
import { ThemeToggle } from '~/components/theme-toggle'
import { Text } from '~/components/ui/text'

iconWithClassName(ChevronDown)
iconWithClassName(Plus)
iconWithClassName(List)
iconWithClassName(PieChart)
iconWithClassName(Wallet)

export default function DetailScreen() {
  const [currentDate] = useState(new Date())

  const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd')
  const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd')

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', startDate, endDate],
    queryFn: async () => {
      const res = await api.transactions.list({ startDate, endDate })
      return res.data
    },
  })

  // Calculate Summary
  const summary = useMemo(() => {
    let income = 0
    let expense = 0

    if (transactions) {
      transactions.forEach((t) => {
        if (t.type === 'INCOME') income += Number(t.amount)
        else if (t.type === 'EXPENSE') expense += Number(t.amount)
      })
    }

    return { income, expense, balance: income - expense }
  }, [transactions])

  // Group Transactions
  const sections = useMemo(() => {
    if (!transactions) return []

    const grouped: { [key: string]: Transaction[] } = {}

    transactions.forEach((t) => {
      // Assuming t.date is 'yyyy-MM-dd' or ISO string
      const dateParts = t.date.split('T')
      const dateStr = dateParts[0]

      if (!dateStr) return

      if (!grouped[dateStr]) grouped[dateStr] = []
      grouped[dateStr]?.push(t)
    })

    const result = Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .map((dateStr) => {
        const date = parseISO(dateStr)
        let title = format(date, 'MM月dd日', { locale: zhCN })

        if (isToday(date)) title = `今天, ${title}`
        else if (isYesterday(date)) title = `昨天, ${title}`
        else {
          // Add day of week
          const dayOfWeek = format(date, 'EEEE', { locale: zhCN }) // e.g., 星期X
          title = `${title} ${dayOfWeek}`
        }

        return {
          title,
          data: grouped[dateStr] || [],
        }
      })

    return result
  }, [transactions])

  const renderHeader = () => (
    <View className="px-4 pt-12 pb-4">
      {/* Top Bar */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-xl font-bold mr-1">
            {format(currentDate, 'MM月', { locale: zhCN })}
          </Text>
          <Text className="text-base mr-2">{format(currentDate, 'LLLL', { locale: zhCN })}</Text>
          <ChevronDown className="h-4 w-4 text-foreground" />
        </TouchableOpacity>

        <View>
          <ThemeToggle />
        </View>
      </View>

      <Text className="text-3xl font-extrabold mb-6">明细</Text>

      {/* Summary Card */}
      <SummaryCard income={summary.income} expense={summary.expense} balance={summary.balance} />
    </View>
  )

  return (
    <View className="flex-1 bg-background relative">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <View className="px-4 py-2 bg-background">
              <Text className="text-sm text-muted-foreground">{title}</Text>
            </View>
          )}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 100 }} // Space for bottom bar
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false} // Match the UI style which looks like clean grouping
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-24 right-6 h-14 w-14 rounded-full bg-primary items-center justify-center shadow-lg z-10"
        activeOpacity={0.8}
      >
        <Plus className="h-8 w-8 text-primary-foreground" />
      </TouchableOpacity>

      {/* Bottom Tab Bar (Mock) */}
      <View className="absolute bottom-0 left-0 right-0 bg-card border-t border-border h-20 flex-row items-center justify-around pb-4">
        <TouchableOpacity className="items-center justify-center">
          <List className="h-6 w-6 text-primary mb-1" />
          <Text className="text-xs text-primary font-medium">明细</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center justify-center">
          <PieChart className="h-6 w-6 text-muted-foreground mb-1" />
          <Text className="text-xs text-muted-foreground font-medium">统计</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center justify-center">
          <Wallet className="h-6 w-6 text-muted-foreground mb-1" />
          <Text className="text-xs text-muted-foreground font-medium">资产</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
