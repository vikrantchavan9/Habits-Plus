import { Bell, BellOff, BookOpen, BrainCircuit, Briefcase, Check, CheckCircle, ChevronDown, Circle, Dumbbell, Frown, Minus, Plus, Smile } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { Habit } from '../types';

// --- CONFIG (Should be moved to a central config file) ---
const habitIcons: { [key: string]: React.FC<any> } = { Dumbbell, BookOpen, BrainCircuit, CheckCircle, Smile, Frown, Plus, Briefcase };
const habitColors = {
    red: { text: "#ef4444", bgLight: "#fee2e2", bgDark: "#450a0a" },
    blue: { text: "#3b82f6", bgLight: "#dbeafe", bgDark: "#1e3a8a" },
    purple: { text: "#8b5cf6", bgLight: "#ede9fe", bgDark: "#5b21b6" },
    cyan: { text: "#06b6d4", bgLight: "#cffafe", bgDark: "#164e63" },
    orange: { text: "#f97316", bgLight: "#ffedd5", bgDark: "#7c2d12" },
    green: { text: "#22c55e", bgLight: "#dcfce7", bgDark: "#166534" },
};
const lightTheme = {
    card: '#ffffff', text: '#1f2937', textSecondary: '#6b7280', border: '#e5e7eb',
};
const darkTheme = {
    card: '#1f2937', text: '#f9fafb', textSecondary: '#9ca3af', border: '#374151',
};

const getColor = (color: string, isDarkMode: boolean) => {
    const colorSet = habitColors[color as keyof typeof habitColors] || habitColors.blue;
    return {
        text: colorSet.text,
        bg: isDarkMode ? colorSet.bgDark : colorSet.bgLight,
    };
};

// --- COMPONENT ---
const HabitCard: React.FC<{ habit: Habit, onUpdate: (id: number, updates: Partial<Habit>) => void, onCountChange: (id: number, change: number) => void, onSelect: (habit: Habit) => void, isDarkMode: boolean }> = ({ habit, onUpdate, onCountChange, onSelect, isDarkMode }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [editedNotes, setEditedNotes] = useState(habit.notes);

    const isCompleted = habit.completionType === 'checkmark' ? habit.status === 'completed' : (habit.targetCount && (habit.count || 0) >= habit.targetCount);
    const Icon = habitIcons[habit.icon] || Circle;
    const colors = getColor(habit.color, isDarkMode);
    const theme = isDarkMode ? darkTheme : lightTheme;

    const handleSaveNotes = () => {
        onUpdate(habit.id, { notes: editedNotes });
        setIsEditingNotes(false);
    };

    const handleToggleReminder = () => {
        const newReminderState = !habit.reminder;
        const updates: Partial<Habit> = { reminder: newReminderState };
        if (newReminderState && !habit.reminderTime) {
            updates.reminderTime = '09:00'; // Default time
        }
        onUpdate(habit.id, updates);
    };

    const handleTimeChange = (time: string) => {
        onUpdate(habit.id, { reminderTime: time });
    };

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
                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={{ marginLeft: 8 }}>
                    <ChevronDown color={theme.textSecondary} width={20} height={20} style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }} />
                </TouchableOpacity>
            </View>
            {isExpanded && <View style={[styles.expandedContainer, { borderTopColor: theme.border }]}>
                <View style={styles.notesContainer}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Notes</Text>
                    {isEditingNotes ? (
                        <>
                            <TextInput value={editedNotes} onChangeText={setEditedNotes} multiline style={[styles.notesInput, { backgroundColor: isDarkMode ? '#374151' : '#f3f4f6', color: theme.text, borderColor: theme.border }]} />
                            <View style={styles.editButtons}>
                                <TouchableOpacity onPress={() => { setIsEditingNotes(false); setEditedNotes(habit.notes); }}><Text style={{color: theme.textSecondary}}>Cancel</Text></TouchableOpacity>
                                <TouchableOpacity onPress={handleSaveNotes} style={styles.saveButton}><Text style={styles.saveButtonText}>Save</Text></TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <TouchableOpacity onPress={() => setIsEditingNotes(true)}>
                            <Text style={[styles.notesText, { color: theme.text }]}>{habit.notes || <Text style={{color: theme.textSecondary}}>Click to add notes...</Text>}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.reminderContainer}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Reminder</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {habit.reminder && (
                            <Text style={{color: theme.text}}>{habit.reminderTime}</Text> // In a real app, you'd use a time picker component here
                        )}
                        <TouchableOpacity onPress={handleToggleReminder} style={[styles.reminderButton, { backgroundColor: habit.reminder ? colors.bg : 'transparent' }]}>
                            {habit.reminder ? <Bell color={colors.text} width={16} height={16} /> : <BellOff color={theme.textSecondary} width={16} height={16} />}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    card: { borderRadius: 12, marginBottom: 12 },
    cardContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    iconContainer: { padding: 12, borderRadius: 8, marginRight: 12 },
    habitNameContainer: { flex: 1 },
    habitName: { fontWeight: '600', fontSize: 16 },
    habitStreak: { fontSize: 12 },
    checkmarkButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderWidth: 2 },
    countContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    countButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 16, borderWidth: 2 },
    countText: { fontWeight: 'bold', fontSize: 16, minWidth: 50, textAlign: 'center' },
    expandedContainer: { borderTopWidth: 1, padding: 16 },
    notesContainer: {},
    label: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
    notesInput: { height: 80, textAlignVertical: 'top', padding: 8, borderWidth: 1, borderRadius: 8, fontSize: 14 },
    notesText: { minHeight: 40, paddingVertical: 8 },
    editButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
    saveButton: { backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    saveButtonText: { color: '#fff', fontWeight: '600' },
    reminderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
    reminderButton: { padding: 8, borderRadius: 20 },
});

export default HabitCard;
