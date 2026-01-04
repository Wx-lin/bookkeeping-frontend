import { View, Text } from 'react-native';
import { Transaction } from '~/lib/api';
import { cn } from '~/lib/utils';
import { Utensils, Bus, ShoppingBag, Coffee, HelpCircle } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/icon-with-classname';

// Register icons
iconWithClassName(Utensils);
iconWithClassName(Bus);
iconWithClassName(ShoppingBag);
iconWithClassName(Coffee);
iconWithClassName(HelpCircle);

interface TransactionItemProps {
  transaction: Transaction;
}

// Simple category icon mapping based on name or ID
// In a real app, this should probably come from the category object itself or a comprehensive map
const getCategoryIcon = (categoryName?: string) => {
  if (!categoryName) return HelpCircle;
  if (categoryName.includes('餐饮') || categoryName.includes('吃饭')) return Utensils;
  if (categoryName.includes('交通') || categoryName.includes('出行')) return Bus;
  if (categoryName.includes('购物') || categoryName.includes('超市')) return ShoppingBag;
  if (categoryName.includes('咖啡')) return Coffee;
  return HelpCircle;
};

// Color mapping for icon background
const getCategoryColor = (categoryName?: string) => {
    // Just using some random consistent colors for demo based on image
    if (categoryName?.includes('餐饮')) return 'bg-orange-500';
    if (categoryName?.includes('交通')) return 'bg-blue-500';
    if (categoryName?.includes('购物')) return 'bg-green-500';
    return 'bg-gray-500';
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const Icon = getCategoryIcon(transaction.category?.name);
  const iconBgColor = getCategoryColor(transaction.category?.name);
  
  const isExpense = transaction.type === 'EXPENSE';
  const amountStr = isExpense ? `-${transaction.amount.toFixed(2)}` : `+${transaction.amount.toFixed(2)}`;

  return (
    <View className="flex-row items-center py-3 px-4 bg-card/50 active:bg-accent/50 rounded-xl mb-2">
      <View className={cn("h-10 w-10 rounded-full items-center justify-center mr-3", iconBgColor)}>
        <Icon className="h-5 w-5 text-white" />
      </View>
      
      <View className="flex-1">
        <Text className="text-base font-medium text-foreground">
          {transaction.category?.name || '未分类'}
        </Text>
        <Text className="text-sm text-muted-foreground mt-0.5">
          {transaction.description || (isExpense ? '支出' : '收入')}
        </Text>
      </View>
      
      <Text className={cn(
        "text-base font-semibold",
        isExpense ? "text-foreground" : "text-primary" // Income usually highlighted, expense neutral
      )}>
        {amountStr}
      </Text>
    </View>
  );
}
