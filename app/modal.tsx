// app/modal.tsx

import { useRouter } from 'expo-router';
import { BookOpen, BrainCircuit, Briefcase, CheckCircle, Dumbbell, Frown, Plus, Smile } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import type { Habit, HabitColors, HabitIconMap, Theme } from '../types';

const habitIcons: HabitIconMap = { 
  Dumbbell, 
  BookOpen, 
  BrainCircuit, 
  CheckCircle, 
  Smile, 
  Frown, 
  Plus, 
  Briefcase 
};

const habitColors: HabitColors = {
    red: { text: "#ef4444", bgLight: "#fee2e2", bgDark: "#450a0a" },
    blue: { text: "#3b82f6", bgLight: "#dbeafe", bgDark: "#1e3a8a" },
    purple: { text: "#8b5cf6", bgLight: "#ede9fe", bgDark: "#5b21b6" },
    cyan: { text: "#06b6d4", bgLight: "#cffafe", bgDark: "#164e63" },
    orange: { text: "#f97316", bgLight: "#ffedd5", bgDark: "#7c2d12" },
    green: { text: "#22c55e", bgLight: "#dcfce7", bgDark: "#166534" },
};

const lightTheme: Theme = {
    background: '#f3f4f6', 
    card: '#ffffff', 
    text: '#1f2937', 
    textSecondary: '#6b7280', 
    border: '#e5e7eb',
    tabBg: '#e5e7eb', 
    activeTab: '#ffffff', 
    activeTabText: '#3b82f6',
    saveButton: '#3b82f6',
};

const darkTheme: Theme = {
    background: '#111827', 
    card: '#1f2937', 
    text: '#f9fafb', 
    textSecondary: '#9ca3af', 
    border: '#374151',
    tabBg: '#374151', 
    activeTab: '#4b5563', 
    activeTabText: '#60a5fa',
    saveButton: '#2563eb',
};

export default function NewHabitModal() {
  const router = useRouter();
  const { addHabit } = useHabits(); // Use the real habit context
  const { isDarkMode } = useTheme();
  
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<Habit['type']>('daily');
  const [icon, setIcon] = useState('Plus');
  const [color, setColor] = useState('blue');
  const [notes, setNotes] = useState('');
  const [completionType, setCompletionType] = useState<Habit['completionType']>('checkmark');
  const [targetCount, setTargetCount] = useState('');

  const colors = isDarkMode ? darkTheme : lightTheme;

  const handleSave = () => {
    // Validation
    if (name.trim() === '') {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if (completionType === 'count' && targetCount && isNaN(parseInt(targetCount))) {
      Alert.alert('Error', 'Please enter a valid target count');
      return;
    }
    
    const newHabit: Omit<Habit, 'id'> = {
        name: name.trim(),
        type,
        icon,
        color,
        notes: notes.trim(),
        completionType,
        targetCount: completionType === 'count' && targetCount ? parseInt(targetCount) : null,
        status: 'pending',
        streak: 0,
        longestStreak: 0,
        total: 0,
        completionRate: 0,
        count: 0,
        reminder: false,
        reminderTime: null,
    };
    
    try {
      addHabit(newHabit);
      console.log('Habit added successfully:', newHabit);
      // Navigate back to the main screen
      router.back();
    } catch (error) {
      console.error('Failed to add habit:', error);
      Alert.alert('Error', 'Failed to add habit. Please try again.');
    }
  };

  return (
    <View style={[styles.pageContainer, { backgroundColor: colors.background }]}>
      <View style={styles.modalHeader}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Create Habit</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.textSecondary, fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Name Input */}
        <View style={styles.formSection}>
            <Text style={[styles.formLabel, { color: colors.text }]}>Name</Text>
            <TextInput 
                value={name} 
                onChangeText={setName} 
                style={[styles.textInput, { backgroundColor: colors.tabBg, color: colors.text, borderColor: colors.border }]} 
                placeholder="e.g., Go for a run" 
                placeholderTextColor={colors.textSecondary}
                autoFocus
                returnKeyType="next"
            />
        </View>

        {/* Type Selection */}
        <View style={styles.formSection}>
            <Text style={[styles.formLabel, { color: colors.text }]}>Type</Text>
            <View style={[styles.tabContainer, { backgroundColor: colors.tabBg }]}>
                <TouchableOpacity 
                    onPress={() => setType('daily')} 
                    style={[styles.tabButton, {flex: 1}, type === 'daily' && { backgroundColor: colors.activeTab }]}
                >
                    <Text style={[styles.tabText, {color: colors.textSecondary}, type === 'daily' && { color: colors.activeTabText }]}>
                        Daily
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setType('good')} 
                    style={[styles.tabButton, {flex: 1}, type === 'good' && { backgroundColor: colors.activeTab }]}
                >
                    <Text style={[styles.tabText, {color: colors.textSecondary}, type === 'good' && { color: colors.activeTabText }]}>
                        Good
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setType('bad')} 
                    style={[styles.tabButton, {flex: 1}, type === 'bad' && { backgroundColor: colors.activeTab }]}
                >
                    <Text style={[styles.tabText, {color: colors.textSecondary}, type === 'bad' && { color: colors.activeTabText }]}>
                        Bad
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setType('productivity')} 
                    style={[styles.tabButton, {flex: 1}, type === 'productivity' && { backgroundColor: colors.activeTab }]}
                >
                    <Text style={[styles.tabText, {color: colors.textSecondary}, type === 'productivity' && { color: colors.activeTabText }]}>
                        Productivity
                    </Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* Completion Type */}
        <View style={styles.formSection}>
            <Text style={[styles.formLabel, { color: colors.text }]}>Completion Type</Text>
            <View style={[styles.tabContainer, { backgroundColor: colors.tabBg }]}>
                <TouchableOpacity 
                    onPress={() => setCompletionType('checkmark')} 
                    style={[styles.tabButton, { flex: 1 }, completionType === 'checkmark' && { backgroundColor: colors.activeTab }]}
                >
                    <Text style={[styles.tabText, {color: colors.textSecondary}, completionType === 'checkmark' && { color: colors.activeTabText }]}>
                        Checkmark
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setCompletionType('count')} 
                    style={[styles.tabButton, { flex: 1 }, completionType === 'count' && { backgroundColor: colors.activeTab }]}
                >
                    <Text style={[styles.tabText, {color: colors.textSecondary}, completionType === 'count' && { color: colors.activeTabText }]}>
                        Count
                    </Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* Target Count (only show for count completion type) */}
        {completionType === 'count' && (
            <View style={styles.formSection}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Target Count</Text>
                <TextInput 
                    value={targetCount} 
                    onChangeText={setTargetCount} 
                    keyboardType="number-pad" 
                    placeholder="Optional" 
                    placeholderTextColor={colors.textSecondary} 
                    style={[styles.textInput, { backgroundColor: colors.tabBg, color: colors.text, borderColor: colors.border }]} 
                />
            </View>
        )}

        {/* Icon Selection */}
        <View style={styles.formSection}>
            <Text style={[styles.formLabel, { color: colors.text }]}>Icon</Text>
            <View style={styles.iconGrid}>
                {Object.keys(habitIcons).map(iconName => {
                    const Icon = habitIcons[iconName];
                    return (
                        <TouchableOpacity 
                            key={iconName} 
                            onPress={() => setIcon(iconName)} 
                            style={[
                                styles.iconGridButton, 
                                { backgroundColor: colors.tabBg }, 
                                icon === iconName && { borderColor: '#3b82f6', borderWidth: 2 }
                            ]}
                        >
                            <Icon color={colors.textSecondary} width={24} height={24} />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>

        {/* Color Selection */}
        <View style={styles.formSection}>
            <Text style={[styles.formLabel, { color: colors.text }]}>Color</Text>
            <View style={styles.colorGrid}>
                {Object.keys(habitColors).map(colorName => (
                    <TouchableOpacity 
                        key={colorName} 
                        onPress={() => setColor(colorName)} 
                        style={[
                            styles.colorButton, 
                            { backgroundColor: habitColors[colorName as keyof HabitColors].text }, 
                            color === colorName && { borderColor: '#3b82f6', borderWidth: 3 }
                        ]} 
                    />
                ))}
            </View>
        </View>

        {/* Notes */}
        <View style={styles.formSection}>
            <Text style={[styles.formLabel, { color: colors.text }]}>Notes</Text>
            <TextInput 
                value={notes} 
                onChangeText={setNotes} 
                multiline 
                numberOfLines={4} 
                style={[styles.textArea, { backgroundColor: colors.tabBg, color: colors.text, borderColor: colors.border }]} 
                placeholder="Add any details..." 
                placeholderTextColor={colors.textSecondary} 
                textAlignVertical="top"
            />
        </View>

        {/* Save Button */}
        <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.saveButton, { backgroundColor: colors.saveButton }]}
            disabled={name.trim() === ''}
        >
          <Text style={[styles.saveButtonText, { opacity: name.trim() === '' ? 0.5 : 1 }]}>
            Save Habit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    pageTitle: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    saveButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 40,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    formSection: { 
        marginBottom: 24 
    },
    formLabel: { 
        fontSize: 16, 
        fontWeight: '600', 
        marginBottom: 8 
    },
    textInput: { 
        padding: 12, 
        borderRadius: 8, 
        borderWidth: 1, 
        fontSize: 16 
    },
    tabContainer: { 
        flexDirection: 'row', 
        borderRadius: 12, 
        padding: 4 
    },
    tabButton: { 
        paddingVertical: 8, 
        borderRadius: 8 
    },
    tabText: { 
        textAlign: 'center', 
        fontWeight: '600' 
    },
    iconGrid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: 8 
    },
    iconGridButton: { 
        padding: 12, 
        borderRadius: 8, 
        justifyContent: 'center', 
        alignItems: 'center',
        width: 56,
        height: 56,
    },
    colorGrid: { 
        flexDirection: 'row', 
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: 8,
    },
    colorButton: { 
        width: 40, 
        height: 40, 
        borderRadius: 20,
        margin: 4,
    },
    textArea: { 
        height: 100, 
        textAlignVertical: 'top', 
        padding: 12, 
        borderWidth: 1, 
        borderRadius: 8, 
        fontSize: 16 
    },
});