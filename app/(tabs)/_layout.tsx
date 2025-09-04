import { Tabs } from 'expo-router';
import React from 'react';
// import { Stack, Tabs, useRouter, useSegments } from 'expo-router';
import { BarChart2, ClipboardList, Home, Settings } from 'lucide-react-native';
// import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // <-- Import ThemeContext

// const InitialLayout = () => {
//   const { userId, isLoading } = useAuth();
//   const segments = useSegments();
//   const router = useRouter();

//   // Add debug logging
//   console.log('Auth Debug - userId:', userId);
//   console.log('Auth Debug - isLoading:', isLoading);
//   console.log('Auth Debug - segments:', segments);

//   useEffect(() => {
//     if (isLoading) {
//       console.log('Auth still loading, skipping navigation');
//       return;
//     }

//     const inTabsGroup = segments[0] === '(tabs)';
//     console.log('Auth Debug - inTabsGroup:', inTabsGroup);

//     if (userId && !inTabsGroup) {
//       console.log('User authenticated, navigating to tabs');
//       router.replace('/(tabs)');
//     } else if (!userId && inTabsGroup) {
//       console.log('User not authenticated, navigating to signIn');
//       router.replace('/signIn');
//     }
//   }, [userId, isLoading, segments, router]);

//   return (
//     <Stack screenOptions={{
//     headerShown: false
// }}>
//       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       <Stack.Screen name="signIn" options={{ headerShown: false }} />
//       <Stack.Screen name="signUp" options={{ headerShown: false }} />
//       <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
//     </Stack>
//   );
// };

// --- THEMES (moved to match notes.tsx structure) ---
const lightTheme = {
  background: '#f3f4f6',
  card: '#ffffff',
  text: '#6b7280',
  activeText: '#3b82f6',
  border: '#e5e7eb',
};

const darkTheme = {
  background: '#111827',
  card: '#1f2937',
  text: '#9ca3af',
  activeText: '#2563eb',
  border: '#374151',
};

export default function TabLayout() {
  const { isDarkMode } = useTheme(); // <-- Use ThemeContext
  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.activeText,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <BarChart2 color={color} />,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color }) => <ClipboardList color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color} />,
        }}
      />
    </Tabs>
  );
}