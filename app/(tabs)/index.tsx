// app/(tabs)/index.tsx

import { Link } from 'expo-router';
import { BookOpen, BrainCircuit, Briefcase, Check, CheckCircle, ChevronDown, ChevronUp, Circle, Dumbbell, Frown, Minus, Plus, Smile, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useHabits } from '../../context/HabitContext'; // Import the habit context
import { useTheme } from '../../context/ThemeContext';
import type { Habit, HabitCardProps } from '../../types';

const habitIcons: { [key: string]: React.FC<any> } = { Dumbbell, BookOpen, BrainCircuit, CheckCircle, Smile, Frown, Plus, Briefcase };
const habitColors = {
    red: { text: "#ef4444", bgLight: "#fee2e2", bgDark: "#450a0a" },
    blue: { text: "#3b82f6", bgLight: "#dbeafe", bgDark: "#1e3a8a" },
    purple: { text: "#8b5cf6", bgLight: "#ede9fe", bgDark: "#5b21b6" },
    cyan: { text: "#06b6d4", bgLight: "#cffafe", bgDark: "#164e63" },
    orange: { text: "#f97316", bgLight: "#ffedd5", bgDark: "#7c2d12" },
    green: { text: "#22c55e", bgLight: "#dcfce7", bgDark: "#166534" },
};

// Helper function to get the correct icon color based on the theme mode
const getColor = (color: string, isDarkMode: boolean) => {
    const colorSet = habitColors[color as keyof typeof habitColors] || habitColors.blue;
    return {
        text: colorSet.text,
        bg: isDarkMode ? colorSet.bgDark : colorSet.bgLight,
    };
};


// Theme objects for light and dark modes
const lightTheme = {
    background: '#f3f4f6', card: '#ffffff', text: '#1f2937', textSecondary: '#6b7280', border: '#e5e7eb',
    tabBg: '#e5e7eb', activeTab: '#ffffff', activeTabText: '#3b82f6',
};
const darkTheme = {
    background: '#111827', card: '#1f2937', text: '#f9fafb', textSecondary: '#9ca3af', border: '#374151',
    tabBg: '#374151', activeTab: '#4b5563', activeTabText: '#60a5fa',
};

// --- Components ---

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

// This component represents a single habit card in the list
const HabitCard: React.FC<HabitCardProps> = ({
    habit,
    onUpdate,
    onCountChange,
    onToggleExpand,
    isExpanded,
    isDarkMode,
    onDelete,
}) => {
    // Select the correct theme based on the isDarkMode prop
    const theme = isDarkMode ? darkTheme : lightTheme;
    // Get the specific colors for the habit's icon
    const iconColors = getColor(habit.color, isDarkMode);
    // Get the correct icon component from the habitIcons map
    const Icon = habitIcons[habit.icon] || Circle;

    // Determine if the habit is completed, checking both completion types
    const isCheckmarkCompleted = habit.completionType === 'checkmark' && habit.status === 'completed';
    const isCountCompleted = habit.completionType === 'count' && habit.targetCount && (habit.count || 0) >= habit.targetCount;
    const isCompleted = isCheckmarkCompleted || isCountCompleted;

    // Function to decide the card's background color
    const getCardBackgroundColor = () => {
        if (isCompleted) {
            // Use special green colors for completed habits
            return isDarkMode ? '#166534' : '#dcfce7';
        }
        // Otherwise, use the default card color from the theme
        return theme.card;
    };

    // This function shows a confirmation pop-up before deleting
    const handleDeletePress = () => {
        Alert.alert(
            "Delete Habit", // Title
            `Are you sure you want to delete "${habit.name}"? This cannot be undone.`, // Message
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: onDelete, // Only call the onDelete prop if the user confirms
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={[styles.card, { backgroundColor: getCardBackgroundColor() }]}>
            {/* This View contains the main, always-visible part of the card */}
            <View style={styles.cardContent}>
                <TouchableOpacity onPress={onToggleExpand} style={[styles.iconContainer, { backgroundColor: iconColors.bg }]}>
                    <Icon color={iconColors.text} width={24} height={24} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onToggleExpand} style={styles.habitNameContainer}>
                    <Text style={[styles.habitName, { color: theme.text, textDecorationLine: isCompleted ? 'line-through' : 'none' }]}>{habit.name}</Text>
                    {habit.type === 'daily' && <Text style={[styles.habitStreak, { color: theme.textSecondary }]}>{habit.streak} day streak</Text>}
                </TouchableOpacity>

                                    {/* Shows the checkmark button if the habit type is 'checkmark' */}
                    {habit.completionType === 'checkmark' && (
                        <TouchableOpacity onPress={() => onUpdate(habit.id, { status: isCompleted ? 'pending' : 'completed' })} style={[styles.checkmarkButton, { backgroundColor: isCompleted ? '#22c55e' : 'transparent', borderColor: isCompleted ? '#22c55e' : theme.border }]}>
                            {isCompleted ? <Check color="#fff" width={24} height={24} /> : <Circle color={theme.textSecondary} width={24} height={24} />}
                        </TouchableOpacity>
                    )}
                    {/* Shows the counter buttons if the habit type is 'count' */}
                    {habit.completionType === 'count' && (
                        <View style={styles.countContainer}>
                            <TouchableOpacity onPress={() => onCountChange(habit.id, -1)} style={[styles.countButton, { borderColor: theme.border }]}><Minus color={theme.textSecondary} width={16} height={16} /></TouchableOpacity>
                            <Text style={[styles.countText, { color: theme.text }]}>{habit.targetCount ? `${habit.count}/${habit.targetCount}` : habit.count}</Text>
                            <TouchableOpacity onPress={() => onCountChange(habit.id, 1)} style={[styles.countButton, { borderColor: theme.border }]}><Plus color={theme.textSecondary} width={16} height={16} /></TouchableOpacity>
                        </View>
                    )}
                
                <TouchableOpacity onPress={onToggleExpand} style={styles.chevronContainer}>
                    {isExpanded ? <ChevronUp color={theme.textSecondary} size={24} /> : <ChevronDown color={theme.textSecondary} size={24} />}
                </TouchableOpacity>
            </View>

            {/* This View only appears if the card is expanded */}
            {isExpanded && (
                <View style={[styles.expandedContainer, { borderTopColor: theme.border }]}>
                     
                    {/* Shows the note if it exists */}
                    {habit.notes && <Text style={[styles.noteText, { color: theme.textSecondary }]}>Note: {habit.notes}</Text>}

                    {/* The Delete Button */}
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
                        <Trash2 color="#ef4444" size={16} />
                        <Text style={styles.deleteButtonText}>Delete Habit</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

// This component contains the main page content, including the header and habit list
const HomePage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    // State to manage which filter tab is currently active
    const [activeTab, setActiveTab] = useState('dailies');
    // State to manage which habit card is currently expanded. `null` means none are expanded.
    const [expandedHabitId, setExpandedHabitId] = useState<number | null>(null);

    const { habits, updateHabit, deleteHabit } = useHabits();
    const colors = isDarkMode ? darkTheme : lightTheme;

    // This function is called when a card is pressed to open or close it
    const handleToggleExpand = (id: number) => {
        // If the pressed card is already open, close it (set to null). Otherwise, open it.
        setExpandedHabitId(prevId => (prevId === id ? null : id));
    };
    
    // Function to handle changes for 'count' type habits
    const changeHabitCount = (id: number, change: number) => {
        const habit = habits.find(h => h.id === id);
        if (habit) {
            updateHabit(id, { count: Math.max(0, (habit.count || 0) + change) });
        }
    };

        // Filter the list of habits based on the active tab
    const filteredHabits = habits.filter((h: Habit) => 
        (activeTab === 'dailies' && h.type === 'daily') || 
        (activeTab === 'good' && h.type === 'good') || 
        (activeTab === 'bad' && h.type === 'bad') || 
        (activeTab === 'productivity' && h.type === 'productivity')
    );

return (
        <View>
            <HomeHeader habits={habits} isDarkMode={isDarkMode} />
            <View style={[styles.tabContainer, { backgroundColor: colors.tabBg }]}>
                {/* Filter Tabs */}
                <TouchableOpacity onPress={() => setActiveTab('dailies')} style={[styles.tabButton, activeTab === 'dailies' && { backgroundColor: colors.activeTab }]}>
                    <Text style={[styles.tabText, {color: colors.textSecondary}, activeTab === 'dailies' && { color: colors.activeTabText }]}>Dailies</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('good')} style={[styles.tabButton, activeTab === 'good' && { backgroundColor: colors.activeTab }]}>
                    <Text style={[styles.tabText, {color: colors.textSecondary}, activeTab === 'good' && { color: colors.activeTabText }]}>Good</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('bad')} style={[styles.tabButton, activeTab === 'bad' && { backgroundColor: colors.activeTab }]}>
                    <Text style={[styles.tabText, {color: colors.textSecondary}, activeTab === 'bad' && { color: colors.activeTabText }]}>Bad</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('productivity')} style={[styles.tabButton, activeTab === 'productivity' && { backgroundColor: colors.activeTab }]}>
                    <Text style={[styles.tabText, {color: colors.textSecondary}, activeTab === 'productivity' && { color: colors.activeTabText }]}>Productivity</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.habitList}>
                {/* Map over the filtered habits and render a card for each one */}
                {filteredHabits.length > 0 ? 
                    filteredHabits.map(habit => 
                        <HabitCard 
                            key={habit.id} 
                            habit={habit} 
                            onUpdate={updateHabit} 
                            onCountChange={changeHabitCount} 
                            // Pass the handler function to the card
                            onToggleExpand={() => handleToggleExpand(habit.id)}
                            // Tell the card whether it should be expanded or not
                            isExpanded={expandedHabitId === habit.id}
                            onDelete={() => deleteHabit(habit.id)}
                            isDarkMode={isDarkMode} 
                        />
                    ) : 
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No habits in this category yet.</Text>
                }
            </View>
        </View>
    );
};
// This is the main screen component that gets rendered
export default function HomeScreen() {
    const { isDarkMode } = useTheme(); 
    const { loading } = useHabits();
    const colors = isDarkMode ? darkTheme : lightTheme;

    // Show a loading screen while habits are being fetched
    if (loading) {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: colors.text}}>Loading habits...</Text>
            </SafeAreaView>
        );
    }
    
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Render the main page content */}
                <HomePage isDarkMode={isDarkMode} />
            </ScrollView>
            {/* Floating Action Button to add a new habit */}
            <Link href="/modal" asChild>
                <TouchableOpacity style={styles.fab}>
                    <Plus color="#fff" width={32} height={32} />
                </TouchableOpacity>
            </Link>
        </SafeAreaView>
    );
}

// --- Stylesheet ---

const styles = StyleSheet.create({
    scrollContainer: { padding: 16, paddingBottom: 80 },
    card: { borderRadius: 12, marginBottom: 12, padding: 16 },
    cardContent: { flexDirection: 'row', alignItems: 'center' },
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
    chevronContainer: { padding: 8 },
    expandedContainer: {
        paddingTop: 16,
        marginTop: 16,
        borderTopWidth: 1,
        alignItems: 'center',
        gap: 12,
    },
    checkmarkButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderWidth: 2 },
    countContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    countButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 16, borderWidth: 2 },
    countText: { fontWeight: 'bold', fontSize: 16, minWidth: 50, textAlign: 'center' },
    noteText: {
        alignSelf: 'flex-start',
        fontSize: 14,
        fontStyle: 'italic',
    },
      deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginTop: 10,
        gap: 8,
    },
    deleteButtonText: {
        color: '#ef4444', // Red color
        fontSize: 14,
        fontWeight: '600',
    },
});