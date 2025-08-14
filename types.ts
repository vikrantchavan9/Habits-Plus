// types.ts

// Defines the structure for a single habit object
export interface Habit {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: 'daily' | 'good' | 'bad' | 'productivity';
  completionType: 'checkmark' | 'count';
  status?: 'pending' | 'completed';
  streak?: number;
  longestStreak?: number;
  total?: number;
  completionRate?: number;
  trend?: number[];
  count?: number;
  targetCount?: number | null;
  notes: string;
  reminder: boolean;
  reminderTime: string | null;
}

// Defines the structure for a single quick note object
export interface QuickNote {
  id: number;
  text: string;
}

// Defines the props for components that need access to the theme
export interface ThemeProps {
  isDarkMode: boolean;
}

// Defines the props for the main App component
export interface AppProps {}

// Defines the props for the HomePage component
export interface HomePageProps extends ThemeProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  onAddNewHabit: () => void;
  onSelectHabit: (habit: Habit) => void;
}

// Defines the props for the StatsPage component
export interface StatsPageProps extends ThemeProps {
  habits: Habit[];
  onSelectHabit: (habit: Habit) => void;
}

// Defines the props for the NotesPage component
export interface NotesPageProps extends ThemeProps {
  habits: Habit[];
  quickNotes: QuickNote[];
  setQuickNotes: React.Dispatch<React.SetStateAction<QuickNote[]>>;
}

// Defines the props for the SettingsPage component
export interface SettingsPageProps extends ThemeProps {
  toggleDarkMode: () => void;
}

// Defines the props for the HabitDetailView component
export interface HabitDetailViewProps {
  habit: Habit;
  onBack: () => void;
}

// Defines the props for the NewHabitPage component
export interface NewHabitPageProps extends ThemeProps {
  onSave: (newHabit: Omit<Habit, 'id' | 'status' | 'streak' | 'longestStreak' | 'total' | 'completionRate' | 'trend' | 'count' | 'reminder' | 'reminderTime'>) => void;
  onCancel: () => void;
}
