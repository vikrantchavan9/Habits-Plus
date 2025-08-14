import { Tabs } from 'expo-router';
import { BarChart2, ClipboardList, Home, Settings } from 'lucide-react-native';
import React from 'react';
import { useColorScheme } from 'react-native';

// --- STYLES & THEMES ---
const lightTheme = {
    background: '#ffffff',
    text: '#6b7280',
    activeText: '#3b82f6',
    border: '#e5e7eb',
};
const darkTheme = {
    background: '#1f2937',
    text: '#9ca3af',
    activeText: '#60a5fa',
    border: '#374151',
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
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
