import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 在 React Native 中，默认不因为窗口聚焦而自动刷新（因为这在移动端可能会比较频繁）
      // 你可以根据需求开启
      refetchOnWindowFocus: false,
      // 失败后重试 2 次
      retry: 2,
    },
  },
});

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
