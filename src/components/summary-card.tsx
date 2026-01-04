import { View, Text } from 'react-native';
import { TrendingDown, TrendingUp } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/icon-with-classname';
import { cn } from '~/lib/utils';

iconWithClassName(TrendingDown);
iconWithClassName(TrendingUp);

interface SummaryCardProps {
  income: number;
  expense: number;
  balance: number;
}

export function SummaryCard({ income, expense, balance }: SummaryCardProps) {
  // Simple progress calculation (relative to total flow for visualization)
  const totalFlow = income + expense || 1;
  const expensePercent = Math.min((expense / totalFlow) * 100, 100);
  const incomePercent = Math.min((income / totalFlow) * 100, 100);

  return (
    <View className="bg-card rounded-3xl p-5 mb-6 border border-border shadow-sm">
      <View className="flex-row justify-between mb-6">
        {/* Expense Column */}
        <View className="flex-1 mr-4">
          <View className="flex-row items-center mb-2">
            <View className="h-8 w-8 rounded-full bg-primary/10 items-center justify-center mr-2">
              <TrendingDown className="h-4 w-4 text-primary" />
            </View>
            <Text className="text-sm text-muted-foreground">本月支出</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground mb-2">
            ¥{expense.toFixed(2)}
          </Text>
          <View className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <View 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${expensePercent}%` }} 
            />
          </View>
          <Text className="text-xs text-muted-foreground text-right mt-1">{Math.round(expensePercent)}%</Text>
        </View>

        {/* Divider */}
        <View className="w-[1px] bg-border mx-2 h-full absolute left-1/2 -ml-[0.5px]" />

        {/* Income Column */}
        <View className="flex-1 ml-4">
           <View className="flex-row items-center mb-2">
            <View className="h-8 w-8 rounded-full bg-primary/10 items-center justify-center mr-2">
              <TrendingUp className="h-4 w-4 text-primary" />
            </View>
            <Text className="text-sm text-muted-foreground">本月收入</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground mb-2">
            ¥{income.toFixed(2)}
          </Text>
          <View className="h-1.5 bg-secondary rounded-full overflow-hidden">
             <View 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${incomePercent}%` }} 
            />
          </View>
          <Text className="text-xs text-muted-foreground text-right mt-1">{Math.round(incomePercent)}%</Text>
        </View>
      </View>

      <View className="h-[1px] bg-border mb-4" />

      <View className="flex-row justify-between items-center">
        <Text className="text-base text-muted-foreground">本月结余</Text>
        <Text className={cn(
          "text-2xl font-bold",
          balance >= 0 ? "text-primary" : "text-destructive"
        )}>
          {balance >= 0 ? '+' : ''}¥{balance.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
