import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { HabitProvider } from '../context/HabitContext';
import { ThemeProvider } from '../context/ThemeContext';

const InitialLayout = () => {
  const { userId, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (userId && !inTabsGroup) {
      router.replace('/(tabs)');
    } else if (!userId && inTabsGroup) {
      router.replace('/signIn');
    }
  }, [userId, isLoading, segments, router]);

  return (
    <Stack screenOptions={{
    headerShown: false
}}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
    <ThemeProvider>
      <HabitProvider>
      <Stack screenOptions={{
    headerShown: false
}}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            headerShown: false,
          }} 
        />
      </Stack>
      </HabitProvider>
    </ThemeProvider>
    </AuthProvider>
  );
}
