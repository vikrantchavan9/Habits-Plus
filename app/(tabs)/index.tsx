import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useFocusEffect } from 'expo-router';
import { BookOpen, BrainCircuit, Briefcase, Check, CheckCircle, Circle, Dumbbell, Frown, Minus, Plus, Smile } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import type { Habit, HomePageProps } from '../../types';

// --- MOCK DATA & CONFIG (Used only if no data is in storage) ---
const initialHabits: Habit[] = [
    { id: 1, name: "Morning Workout", icon: 'Dumbbell', color: "red", type: 'daily', completionType: 'checkmark', status: 'pending', streak: 5, longestStreak: 20, total: 120, completionRate: 75, notes: "Focus on cardio today.", reminder: true, reminderTime: "07:00" },
    { id: 2, name: "Read for 30 mins", icon: 'BookOpen', color: "blue", type: 'daily', completionType: 'checkmark', status: 'completed', streak: 12, longestStreak: 30, total: 350, completionRate: 90, notes: "Chapter 4 of 'The Alchemist'.", reminder: false, reminderTime: null },
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

// --- COMPONENTS ---

const HomeHeader: React.FC<{ habits: Habit[], isDarkMode: boolean }> = ({ habits, isDarkMode }) => {
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const dailies = habits.filter(h => h.type === 'daily');
    const completedDailies = dailies.filter(h => h.status === 'completed').length;
    const progress = dailies.length > 0 ? (completedDailies / dailies.length) * 100 : 0;
    const colors = isDarkMode ? darkTheme : lightTheme;

    return (
        <View style={styles.headerContainer}>
            <View>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Good morning!</Text>
                <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{dateString}</Text>
                <Text style={[styles.headerQuote, { color: colors.textSecondary }]}>&quot;The secret of getting ahead is getting started.&quot;</Text>
            </View>
            <View style={styles.progressCircleContainer}>
                <Svg width="80" height="80" viewBox="0 0 36 36">
                    <Path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke={colors.border} strokeWidth="3" fill="none" />
                    <Path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#3b82f6" strokeWidth="3" strokeDasharray={`${progress}, 100`} strokeLinecap="round" fill="none" />
                </Svg>
                <View style={styles.progressTextContainer}>
                    <Text style={[styles.progressText, { color: colors.text }]}>{completedDailies}</Text>
                    <Text style={[styles.progressTotalText, { color: colors.textSecondary }]}>/{dailies.length}</Text>
                </View>
            </View>
        </View>
    );
};

const HabitCard: React.FC<{ habit: Habit, onUpdate: (id: number, updates: Partial<Habit>) => void, onCountChange: (id: number, change: number) => void, onSelect: (habit: Habit) => void, isDarkMode: boolean }> = ({ habit, onUpdate, onCountChange, onSelect, isDarkMode }) => {
    const isCompleted = habit.completionType === 'checkmark' ? habit.status === 'completed' : (habit.targetCount && (habit.count || 0) >= habit.targetCount);
    const Icon = habitIcons[habit.icon] || Circle;
    const colors = getColor(habit.color, isDarkMode);
    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <View style={[styles.card, { backgroundColor: isCompleted ? (isDarkMode ? '#166534' : '#dcfce7') : theme.card }]}>
            <View style={styles.cardContent}>
                <TouchableOpacity onPress={() => onSelect(habit)} style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
                    <Icon color={colors.text} width={24} height={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onSelect(habit)} style={styles.habitNameContainer}>
                    <Text style={[styles.habitName, { color: theme.text, textDecorationLine: isCompleted ? 'line-through' : 'none' }]}>{habit.name}</Text>
                    {habit.type === 'daily' && <Text style={[styles.habitStreak, { color: theme.textSecondary }]}>{habit.streak} day streak</Text>}
                </TouchableOpacity>
                {habit.completionType === 'checkmark' && (
                    <TouchableOpacity onPress={() => onUpdate(habit.id, { status: isCompleted ? 'pending' : 'completed' })} style={[styles.checkmarkButton, { backgroundColor: isCompleted ? '#22c55e' : 'transparent', borderColor: isCompleted ? '#22c55e' : theme.border }]}>
                        {isCompleted ? <Check color="#fff" width={24} height={24} /> : <Circle color={theme.textSecondary} width={24} height={24} />}
                    </TouchableOpacity>
                )}
                {habit.completionType === 'count' && (
                    <View style={styles.countContainer}>
                        <TouchableOpacity onPress={() => onCountChange(habit.id, -1)} style={[styles.countButton, { borderColor: theme.border }]}><Minus color={theme.textSecondary} width={16} height={16} /></TouchableOpacity>
                        <Text style={[styles.countText, { color: theme.text }]}>{habit.targetCount ? `${habit.count}/${habit.targetCount}` : habit.count}</Text>
                        <TouchableOpacity onPress={() => onCountChange(habit.id, 1)} style={[styles.countButton, { borderColor: theme.border }]}><Plus color={theme.textSecondary} width={16} height={16} /></TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const HomePage: React.FC<Omit<HomePageProps, 'onAddNewHabit'>> = ({ habits, setHabits, onSelectHabit, isDarkMode }) => {
    const [activeTab, setActiveTab] = useState('dailies');
    const colors = isDarkMode ? darkTheme : lightTheme;

    const updateHabit = (id: number, updates: Partial<Habit>) => setHabits(habits.map((h: Habit) => (h.id === id ? { ...h, ...updates } : h)));
    const changeHabitCount = (id: number, change: number) => setHabits(habits.map((h: Habit) => (h.id === id ? { ...h, count: Math.max(0, (h.count || 0) + change) } : h)));
    const filteredHabits = habits.filter((h: Habit) => (activeTab === 'dailies' && h.type === 'daily') || (activeTab === 'good' && h.type === 'good') || (activeTab === 'bad' && h.type === 'bad') || (activeTab === 'productivity' && h.type === 'productivity'));

    return (
        <View>
            <HomeHeader habits={habits} isDarkMode={isDarkMode} />
            <View style={[styles.tabContainer, { backgroundColor: colors.tabBg }]}>
                <TouchableOpacity onPress={() => setActiveTab('dailies')} style={[styles.tabButton, activeTab === 'dailies' && { backgroundColor: colors.activeTab }]}><Text style={[styles.tabText, {color: colors.textSecondary}, activeTab === 'dailies' && { color: colors.activeTabText }]}>Dailies</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('good')} style={[styles.tabButton, activeTab === 'good' && { backgroundColor: colors.activeTab }]}><Text style={[styles.tabText, {color: colors.textSecondary}, activeTab === 'good' && { color: colors.activeTabText }]}>Good</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('bad')} style={[styles.tabButton, activeTab === 'bad' && { backgroundColor: colors.activeTab }]}><Text style={[styles.tabText, {color: colors.textSecondary}, activeTab === 'bad' && { color: colors.activeTabText }]}>Bad</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('productivity')} style={[styles.tabButton, activeTab === 'productivity' && { backgroundColor: colors.activeTab }]}><Text style={[styles.tabText, {color: colors.textSecondary}, activeTab === 'productivity' && { color: colors.activeTabText }]}>Productivity</Text></TouchableOpacity>
            </View>
            <View style={styles.habitList}>{filteredHabits.length > 0 ? filteredHabits.map(habit => <HabitCard key={habit.id} habit={habit} onUpdate={updateHabit} onCountChange={changeHabitCount} onSelect={onSelectHabit} isDarkMode={isDarkMode} />) : <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No habits in this category yet.</Text>}</View>
        </View>
    );
};

export default function HomeScreen() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const { isDarkMode } = useTheme(); 
    const colors = isDarkMode ? darkTheme : lightTheme;

    useFocusEffect(
      useCallback(() => {
        const loadHabits = async () => {
            try {
                const savedHabits = await AsyncStorage.getItem('habits');
                if (savedHabits !== null) {
                    setHabits(JSON.parse(savedHabits));
                } else {
                    setHabits(initialHabits);
                }
            } catch (e) {
                console.error('Failed to load habits.', e);
                setHabits(initialHabits);
            }
        };

        loadHabits();
      }, [])
    );

    useEffect(() => {
        const saveHabits = async () => {
            try {
                await AsyncStorage.setItem('habits', JSON.stringify(habits));
            } catch (e) {
                console.error('Failed to save habits.', e);
            }
        };
        if (habits.length > 0) {
            saveHabits();
        }
    }, [habits]);

    const handleSelectHabit = (habit: Habit) => {
        console.log("Navigate to habit:", habit.name);
    };
    
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <HomePage habits={habits} setHabits={setHabits} onSelectHabit={handleSelectHabit} isDarkMode={isDarkMode} />
            </ScrollView>
            <Link href="/modal" asChild>
                <TouchableOpacity style={styles.fab}>
                    <Plus color="#fff" width={32} height={32} />
                </TouchableOpacity>
            </Link>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { padding: 16, paddingBottom: 80 },
    pageContainer: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 80 },
    pageTitle: { fontSize: 30, fontWeight: 'bold', marginBottom: 24 },
    card: { borderRadius: 12, marginBottom: 12, },
    cardContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingTop: 12 },
    headerTitle: { fontSize: 30, fontWeight: 'bold' },
    headerSubtitle: { fontSize: 16 },
    headerQuote: { fontSize: 14, fontStyle: 'italic', marginTop: 8 },
    progressCircleContainer: { width: 80, height: 80, position: 'relative' },
    progressTextContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
    progressText: { fontSize: 20, fontWeight: 'bold' },
    progressTotalText: { fontSize: 12 },
    tabContainer: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 16 },
    tabButton: { flex: 1, paddingVertical: 8, borderRadius: 8 },
    tabText: { textAlign: 'center', fontWeight: '600' },
    habitList: { gap: 12 },
    emptyText: { textAlign: 'center', paddingVertical: 40 },
    fab: { position: 'absolute', bottom: 30, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', elevation: 4 },
    iconContainer: { padding: 12, borderRadius: 8, marginRight: 12 },
    habitNameContainer: { flex: 1 },
    habitName: { fontWeight: '600', fontSize: 16 },
    habitStreak: { fontSize: 12 },
    checkmarkButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderWidth: 2 },
    countContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    countButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 16, borderWidth: 2 },
    countText: { fontWeight: 'bold', fontSize: 16, minWidth: 50, textAlign: 'center' },
});
