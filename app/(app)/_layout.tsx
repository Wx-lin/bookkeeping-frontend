import { Tabs, Redirect } from 'expo-router';
import { List, PieChart, Wallet } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Platform, StyleSheet } from 'react-native';
import { useAuthStore } from '~/stores/auth';
import { BlurView } from 'expo-blur';

import { iconWithClassName } from '~/lib/icons/icon-with-classname';

iconWithClassName(List);
iconWithClassName(PieChart);
iconWithClassName(Wallet);

export default function AppLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          <LiquidGlassView
            effect="regular"
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarActiveTintColor: '#f59e0b', // amber-500
        tabBarInactiveTintColor: isDark ? '#a8a29e' : '#78716c',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '明细',
          tabBarIcon: ({ color }: { color: string }) => <List className="w-6 h-6" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '统计',
          tabBarIcon: ({ color }: { color: string }) => <PieChart className="w-6 h-6" color={color} />,
        }}
      />
      <Tabs.Screen
        name="assets"
        options={{
          title: '资产',
          tabBarIcon: ({ color }: { color: string }) => <Wallet className="w-6 h-6" color={color} />,
        }}
      />
    </Tabs>
  );
}
