import { BookOpen, BrainCircuit, Briefcase, CheckCircle, Circle, Dumbbell, Frown, Info, Plus, Smile } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext'; // <-- Import ThemeContext
import type { Habit, StatsPageProps } from '../../types';

// --- MOCK DATA & CONFIG (Copied for standalone use) ---
const statsData = {
    overallCompletion: 82,
    currentStreak: 14,
    longestStreak: 45,
    perfectDays: 21,
};

const initialHabits: Habit[] = [
    // Dailies
    { id: 1, name: "Morning Workout", icon: 'Dumbbell', color: "red", type: 'daily', completionType: 'checkmark', status: 'pending', streak: 5, longestStreak: 20, total: 120, completionRate: 75, notes: "Focus on cardio today.", reminder: true, reminderTime: "07:00" },
    { id: 2, name: "Read for 30 mins", icon: 'BookOpen', color: "blue", type: 'daily', completionType: 'checkmark', status: 'completed', streak: 12, longestStreak: 30, total: 350, completionRate: 90, notes: "Chapter 4 of 'The Alchemist'.", reminder: false, reminderTime: null },
    { id: 3, name: "Meditate", icon: 'BrainCircuit', color: "purple", type: 'daily', completionType: 'checkmark', status: 'pending', streak: 21, longestStreak: 45, total: 500, completionRate: 98, notes: "", reminder: true, reminderTime: "21:00" },
    // Good/Bad Habits
    { id: 4, name: "Drink Water", icon: 'CheckCircle', color: "cyan", type: 'good', completionType: 'count', count: 3, targetCount: 8, notes: "Aim for 8 glasses.", reminder: false, reminderTime: null },
    { id: 5, name: "Eat Junk Food", icon: 'Frown', color: "orange", type: 'bad', completionType: 'count', count: 1, targetCount: 3, notes: "Resist the urge for evening snacks.", reminder: false, reminderTime: null },
    // Productivity Habits
    { id: 6, name: "Focus Work (Pomodoro)", icon: 'Briefcase', color: "green", type: 'productivity', completionType: 'count', count: 0, targetCount: 4, notes: "Track 25-minute focus sessions.", reminder: false, reminderTime: null },
];

const habitIcons: { [key: string]: React.FC<any> } = { Dumbbell, BookOpen, BrainCircuit, CheckCircle, Smile, Frown, Plus, Briefcase };
const habitColors = {
    red: { text: "#ef4444", bgLight: "#fee2e2", bgDark: "#450a0a" },
    blue: { text: "#3b82f6", bgLight: "#dbeafe", bgDark: "#1e3a8a" },
    purple: { text: "#8b5cf6", bgLight: "#ede9fe", bgDark: "#5b21b6" },
    cyan: { text: "#06b6d4", bgLight: "#cffafe", bgDark: "#164e63" },
    orange: { text: "#f97316", bgLight: "#ffedd5", bgDark: "#7c2d12" },
    green: { text: "#22c55e", bgLight: "#dcfce7", bgDark: "#166534" },
};

const getColor = (color: string, isDarkMode: boolean) => {
    const colorSet = habitColors[color as keyof typeof habitColors] || habitColors.blue;
    return {
        text: colorSet.text,
        bg: isDarkMode ? colorSet.bgDark : colorSet.bgLight,
    };
};

const lightTheme = {
    background: '#f3f4f6', card: '#ffffff', text: '#1f2937', textSecondary: '#6b7280', border: '#e5e7eb',
    tabBg: '#e5e7eb', activeTab: '#ffffff', activeTabText: '#3b82f6',
};
const darkTheme = {
    background: '#111827', card: '#1f2937', text: '#f9fafb', textSecondary: '#9ca3af', border: '#374151',
    tabBg: '#374151', activeTab: '#4b5563', activeTabText: '#60a5fa',
};

// --- REUSABLE COMPONENTS ---
const InfoTooltip: React.FC<{ text: string, isDarkMode: boolean }> = ({ text, isDarkMode }) => {
    const [visible, setVisible] = useState(false);
    const theme = isDarkMode ? darkTheme : lightTheme;
    return (
        <View style={styles.tooltipContainer}>
            <TouchableOpacity onPressIn={() => setVisible(true)} onPressOut={() => setVisible(false)}>
                <Info color={theme.textSecondary} width={16} height={16} />
            </TouchableOpacity>
            {visible && (
                <View style={[styles.tooltip, { backgroundColor: theme.card }]}>
                    <Text style={[styles.tooltipText, { color: theme.text }]}>{text}</Text>
                </View>
            )}
        </View>
    );
};

const StatCard: React.FC<{ title: string, value: string | number, color: string, tooltip: string, isDarkMode: boolean }> = ({ title, value, color, tooltip, isDarkMode }) => {
    const theme = isDarkMode ? darkTheme : lightTheme;
    return (
        <View style={[styles.card, { backgroundColor: theme.card, flex: 1 }]}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color }}>{value}</Text>
            <View style={styles.statTitleContainer}>
                <Text style={[styles.statTitle, { color: theme.textSecondary }]}>{title}</Text>
                {tooltip && <InfoTooltip text={tooltip} isDarkMode={isDarkMode} />}
            </View>
        </View>
    );
};

const TopStreaks: React.FC<{ habits: Habit[], onSelectHabit: (habit: Habit) => void, isDarkMode: boolean }> = ({ habits, onSelectHabit, isDarkMode }) => {
    const topStreaks = habits.filter(h => h.type === 'daily').sort((a, b) => (b.streak || 0) - (a.streak || 0)).slice(0, 3);
    const theme = isDarkMode ? darkTheme : lightTheme;
    return <View style={[styles.card, { backgroundColor: theme.card }]}><Text style={[styles.cardTitle, {color: theme.text}]}>Top Streaks</Text>{topStreaks.map((habit, index) => { const Icon = habitIcons[habit.icon] || Circle; const colors = getColor(habit.color, isDarkMode); return <TouchableOpacity key={habit.id} onPress={() => onSelectHabit(habit)} style={styles.topHabitRow}><Text style={[styles.topHabitRank, {color: theme.textSecondary}]}>{index + 1}.</Text><View style={[styles.iconContainerSmall, { backgroundColor: colors.bg }]}><Icon color={colors.text} width={20} height={20} /></View><Text style={[styles.topHabitName, {color: theme.text}]}>{habit.name}</Text><View style={styles.topHabitStat}><Text style={[styles.topHabitValue, {color: theme.text}]}>{habit.streak} days</Text><Text style={[styles.topHabitLabel, {color: theme.textSecondary}]}>Current</Text></View></TouchableOpacity>})}
    </View>
};

const TopHabits: React.FC<{ habits: Habit[], onSelectHabit: (habit: Habit) => void, isDarkMode: boolean }> = ({ habits, onSelectHabit, isDarkMode }) => {
    const topHabits = habits.filter(h => h.type === 'daily').sort((a, b) => (b.total || 0) - (a.total || 0)).slice(0, 3);
    const theme = isDarkMode ? darkTheme : lightTheme;
    return <View style={[styles.card, { backgroundColor: theme.card }]}><Text style={[styles.cardTitle, {color: theme.text}]}>Top Habits (All Time)</Text>{topHabits.map((habit, index) => { const Icon = habitIcons[habit.icon] || Circle; const colors = getColor(habit.color, isDarkMode); return <TouchableOpacity key={habit.id} onPress={() => onSelectHabit(habit)} style={styles.topHabitRow}><Text style={[styles.topHabitRank, {color: theme.textSecondary}]}>{index + 1}.</Text><View style={[styles.iconContainerSmall, { backgroundColor: colors.bg }]}><Icon color={colors.text} width={20} height={20} /></View><Text style={[styles.topHabitName, {color: theme.text}]}>{habit.name}</Text><View style={styles.topHabitStat}><Text style={[styles.topHabitValue, {color: theme.text}]}>{habit.total}</Text><Text style={[styles.topHabitLabel, {color: theme.textSecondary}]}>Completions</Text></View></TouchableOpacity>})}
    </View>
};

const HabitSummary: React.FC<{isDarkMode: boolean}> = ({ isDarkMode }) => {
    const [view, setView] = useState<'week' | 'month'>('week');
    const summaryData = { week: { total: 3, completed: 1, missed: 1 }, month: { total: 12, completed: 8, missed: 2 } };
    const data = summaryData[view];
    const theme = isDarkMode ? darkTheme : lightTheme;
    return <View style={[styles.card, {backgroundColor: theme.card}]}><View style={styles.summaryHeader}><Text style={[styles.cardTitle, {color: theme.text}]}>Summary</Text><View style={[styles.tabContainer, {backgroundColor: theme.tabBg, marginBottom: 0, width: 150}]}><TouchableOpacity onPress={() => setView('week')} style={[styles.tabButton, view === 'week' && { backgroundColor: theme.activeTab }]}><Text style={[styles.tabText, {color: theme.textSecondary}, view === 'week' && { color: theme.activeTabText }]}>Week</Text></TouchableOpacity><TouchableOpacity onPress={() => setView('month')} style={[styles.tabButton, view === 'month' && { backgroundColor: theme.activeTab }]}><Text style={[styles.tabText, {color: theme.textSecondary}, view === 'month' && { color: theme.activeTabText }]}>Month</Text></TouchableOpacity></View></View><View style={styles.summaryGrid}><View style={styles.summaryItem}><Text style={[styles.summaryValue, {color: '#3b82f6'}]}>{data.total}</Text><Text style={[styles.summaryLabel, {color: theme.textSecondary}]}>Total</Text></View><View style={styles.summaryItem}><Text style={[styles.summaryValue, {color: '#22c55e'}]}>{data.completed}</Text><Text style={[styles.summaryLabel, {color: theme.textSecondary}]}>Completed</Text></View><View style={styles.summaryItem}><Text style={[styles.summaryValue, {color: '#ef4444'}]}>{data.missed}</Text><Text style={[styles.summaryLabel, {color: theme.textSecondary}]}>Missed</Text></View></View></View>
};

// --- MAIN SCREEN COMPONENT ---
const StatsScreen: React.FC<StatsPageProps> = ({ habits, onSelectHabit, isDarkMode }) => {
    const theme = isDarkMode ? darkTheme : lightTheme;
    return (
        <ScrollView contentContainerStyle={[styles.pageContainer, { backgroundColor: theme.background }]}>
            <Text style={[styles.pageTitle, { color: theme.text }]}>Your Stats</Text>
            <View style={styles.statsGrid}>
                <StatCard title="Completion" value={`${statsData.overallCompletion}%`} color="#22c55e" tooltip="The percentage of daily habits completed across all time." isDarkMode={isDarkMode} />
                <StatCard title="Current Streak" value={statsData.currentStreak} color="#f97316" tooltip="The number of consecutive days you've completed all your daily habits." isDarkMode={isDarkMode} />
                <StatCard title="Longest Streak" value={statsData.longestStreak} color="#8b5cf6" tooltip="Your record for the most consecutive days of completing all daily habits." isDarkMode={isDarkMode} />
                <StatCard title="Perfect Days" value={statsData.perfectDays} color="#f59e0b" tooltip="The total number of days you have completed all your daily habits." isDarkMode={isDarkMode} />
            </View>
            <HabitSummary isDarkMode={isDarkMode} />
            <TopStreaks habits={habits} onSelectHabit={onSelectHabit} isDarkMode={isDarkMode} />
            <TopHabits habits={habits} onSelectHabit={onSelectHabit} isDarkMode={isDarkMode} />
        </ScrollView>
    );
};

export default function Stats() {
    // In a real app, this state would come from a global context or state management library
    const [habits, setHabits] = useState(initialHabits);
    const { isDarkMode } = useTheme(); // <-- Use ThemeContext

    const handleSelectHabit = (habit: Habit) => {
        // Navigation logic would go here
        console.log("Navigate to habit:", habit.name);
    };

    return <StatsScreen habits={habits} onSelectHabit={handleSelectHabit} isDarkMode={isDarkMode} />
}

const styles = StyleSheet.create({
    pageContainer: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 80 },
    pageTitle: { fontSize: 30, fontWeight: 'bold', marginBottom: 24 },
    card: { borderRadius: 12, marginBottom: 16, padding: 16 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
    statTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    statTitle: { fontSize: 14 },
    tooltipContainer: { position: 'relative' },
    tooltip: { position: 'absolute', bottom: '100%', left: '50%', transform: [{ translateX: -75 }], marginBottom: 8, backgroundColor: '#1f2937', padding: 8, borderRadius: 6, width: 150 },
    tooltipText: { color: '#fff', fontSize: 12, textAlign: 'center' },
    summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    summaryGrid: { flexDirection: 'row', justifyContent: 'space-around' },
    summaryItem: { alignItems: 'center' },
    summaryValue: { fontSize: 24, fontWeight: 'bold' },
    summaryLabel: { fontSize: 12, marginTop: 2 },
    tabContainer: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 16 },
    tabButton: { flex: 1, paddingVertical: 8, borderRadius: 8 },
    tabText: { textAlign: 'center', fontWeight: '600' },
    topHabitRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    topHabitRank: { fontSize: 16, fontWeight: 'bold', width: 32 },
    iconContainerSmall: { padding: 8, borderRadius: 8, marginRight: 12 },
    topHabitName: { flex: 1, fontWeight: '600' },
    topHabitStat: { alignItems: 'flex-end' },
    topHabitValue: { fontWeight: 'bold', fontSize: 14 },
    topHabitLabel: { fontSize: 12 },
});