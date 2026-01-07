import { View } from 'react-native';
import { format } from 'date-fns';
import { ArrowRightLeft, TrendingDown, TrendingUp } from 'lucide-react-native';
import { Transaction } from '~/lib/api';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { cn } from '~/lib/utils';
import { iconWithClassName } from '~/lib/icons/icon-with-classname';

iconWithClassName(TrendingUp);
iconWithClassName(TrendingDown);
iconWithClassName(ArrowRightLeft);

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isExpense = transaction.type === 'EXPENSE';
  const isIncome = transaction.type === 'INCOME';
  const isTransfer = transaction.type === 'TRANSFER';

  return (
    <Card className="flex-row items-center p-4 mb-3 mx-4 bg-card border-border/50 shadow-sm">
      {/* Icon Circle */}
      <View
        className={cn(
          'h-10 w-10 rounded-full items-center justify-center mr-4',
          isExpense && 'bg-red-500/10',
          isIncome && 'bg-green-500/10',
          isTransfer && 'bg-blue-500/10'
        )}
      >
        {isExpense && <TrendingDown className="h-5 w-5 text-red-500" />}
        {isIncome && <TrendingUp className="h-5 w-5 text-green-500" />}
        {isTransfer && <ArrowRightLeft className="h-5 w-5 text-blue-500" />}
      </View>

      {/* Details */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-medium text-base text-foreground" numberOfLines={1}>
            {transaction.category?.name || (isTransfer ? '转账' : '未分类')}
          </Text>
          <Text
            className={cn(
              'font-bold text-base',
              isExpense && 'text-red-500',
              isIncome && 'text-green-500',
              isTransfer && 'text-foreground'
            )}
          >
            {isExpense ? '-' : isIncome ? '+' : ''}
            {transaction.amount}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            {transaction.description || transaction.account?.name || '无备注'}
          </Text>
          <Text className="text-xs text-muted-foreground">
            {format(new Date(transaction.date), 'HH:mm')}
          </Text>
        </View>
      </View>
    </Card>
  );
}
