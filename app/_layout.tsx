import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from '@/src/store/appStore';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

export default function RootLayout() {
  const restore = useAppStore((state) => state.restore);
  useEffect(() => { void restore(); }, [restore]);
  return <QueryClientProvider client={queryClient}><SafeAreaProvider><StatusBar style="auto" /><Stack screenOptions={{ headerShown: false }} /></SafeAreaProvider></QueryClientProvider>;
}
