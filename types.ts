// types.ts

// Defines the structure for a single habit object
export interface Habit {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: 'daily' | 'good' | 'bad' | 'productivity';
  completionType: 'checkmark' | 'count';
  status?: 'pending' | 'completed' | 'skipped'; // Added 'skipped' option
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
  createdAt?: Date;
  tags?: string[];
}

// Defines the props for components that need access to the theme
export interface ThemeProps {
  isDarkMode: boolean;
}

// Defines the context type for theme management
export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Defines the context type for habit management
export interface HabitContextType {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  updateHabit: (id: number, updates: Partial<Habit>) => void;
  deleteHabit: (id: number) => void;
  loading: boolean;
}

// Defines the props for the main App component
export interface AppProps {}

// Defines the props for the HomePage component
export interface HomePageProps extends ThemeProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  onAddNewHabit?: () => void; // Made optional since we're using context now
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
export interface HabitDetailViewProps extends ThemeProps {
  habit: Habit;
  onBack: () => void;
  onUpdate?: (updates: Partial<Habit>) => void;
  onDelete?: () => void;
}

// Defines the props for the NewHabitPage component
export interface NewHabitPageProps extends ThemeProps {
  onSave: (newHabit: Omit<Habit, 'id' | 'status' | 'streak' | 'longestStreak' | 'total' | 'completionRate' | 'trend' | 'count' | 'reminder' | 'reminderTime'>) => void;
  onCancel: () => void;
}

// Defines the props for HabitCard component
export interface HabitCardProps {
  habit: Habit;
  onUpdate: (id: number, updates: Partial<Habit>) => void;
  onCountChange: (id: number, change: number) => void;
  onSelect: (habit: Habit) => void;
  isDarkMode: boolean;
}

// Defines the props for HomeHeader component
export interface HomeHeaderProps {
  habits: Habit[];
  isDarkMode: boolean;
}

// Color configuration types
export interface HabitColorConfig {
  text: string;
  bgLight: string;
  bgDark: string;
}

export interface HabitColors {
  red: HabitColorConfig;
  blue: HabitColorConfig;
  purple: HabitColorConfig;
  cyan: HabitColorConfig;
  orange: HabitColorConfig;
  green: HabitColorConfig;
}

// Theme configuration
export interface Theme {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  tabBg: string;
  activeTab: string;
  activeTabText: string;
  saveButton?: string;
}

// Icon mapping type
export interface HabitIconMap {
  [key: string]: React.FC<any>;
}

// Form state types for the modal
export interface NewHabitFormData {
  name: string;
  type: Habit['type'];
  icon: string;
  color: string;
  notes: string;
  completionType: Habit['completionType'];
  targetCount: string;
}

// Navigation types
export interface HabitDetailParams {
  habitId: number;
}

// Stats types for analytics
export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  completedThisWeek: number;
  completedThisMonth: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  streakData: { date: string; completed: boolean }[];
}

// Daily progress tracking
export interface DailyProgress {
  date: string;
  habits: {
    habitId: number;
    completed: boolean;
    count?: number;
  }[];
  totalCompleted: number;
  totalHabits: number;
}

// Notification/Reminder types
export interface HabitReminder {
  habitId: number;
  time: string;
  enabled: boolean;
  notificationId?: string;
}

// Filter and sort options
export type HabitFilterType = 'all' | 'daily' | 'good' | 'bad' | 'productivity';
export type HabitSortType = 'name' | 'streak' | 'completion' | 'created';
export type SortDirection = 'asc' | 'desc';

export interface HabitFilters {
  type: HabitFilterType;
  sortBy: HabitSortType;
  sortDirection: SortDirection;
  showCompleted: boolean;
}