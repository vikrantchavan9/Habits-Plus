import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { HabitProvider } from '../context/HabitContext';
import { ThemeProvider } from '../context/ThemeContext';

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
