import { Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext'; // <-- Import ThemeContext
import type { NotesPageProps, QuickNote } from '../../types';

// --- MOCK DATA (for standalone use) ---
const initialQuickNotes: QuickNote[] = [
    { id: 1, text: "Remember to buy groceries after work." },
    { id: 2, text: "Call mom this weekend." },
    { id: 3, text: "Finish the project proposal by Wednesday." },
];

// --- STYLES & THEMES ---
const lightTheme = {
    background: '#f3f4f6', card: '#ffffff', text: '#1f2937', textSecondary: '#6b7280', border: '#e5e7eb',
    addButton: '#3b82f6',
    noteItem: '#f9fafb',
    inputBg: '#f3f4f6',
};
const darkTheme = {
    background: '#111827', card: '#1f2937', text: '#f9fafb', textSecondary: '#9ca3af', border: '#374151',
    addButton: '#2563eb',
    noteItem: '#374151',
    inputBg: '#374151',
};

// --- MAIN SCREEN COMPONENT ---
const NotesPage: React.FC<NotesPageProps & { isDarkMode: boolean }> = ({ quickNotes, setQuickNotes, isDarkMode }) => {
    const [newNote, setNewNote] = useState('');
    const colors = isDarkMode ? darkTheme : lightTheme;

    const addNote = () => {
        if (newNote.trim() === '') return;
        setQuickNotes((prev: QuickNote[]) => [...prev, { id: Date.now(), text: newNote.trim() }]);
        setNewNote('');
    };

    const deleteNote = (id: number) => {
        setQuickNotes((prev: QuickNote[]) => prev.filter((note: QuickNote) => note.id !== id));
    };

    return (
        <View style={[styles.pageContainer, { backgroundColor: colors.background }]}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>Notes</Text>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Quick Notes</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={newNote}
                        onChangeText={setNewNote}
                        placeholder="Add a quick note..."
                        placeholderTextColor={colors.textSecondary}
                        style={[
                            styles.textInput,
                            { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }
                        ]}
                    />
                    <TouchableOpacity onPress={addNote} style={[styles.addButton, { backgroundColor: colors.addButton }]}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.notesList}>
                    {quickNotes.map((note) => (
                        <View key={note.id} style={[styles.noteItem, { backgroundColor: colors.noteItem }]}>
                            <Text style={[styles.noteText, { color: colors.text }]}>{note.text}</Text>
                            <TouchableOpacity onPress={() => deleteNote(note.id)}>
                                <Trash2 color="#ef4444" width={16} height={16} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default function NotesScreen() {
    // In a real app, this state would come from a global context
    const [quickNotes, setQuickNotes] = useState<QuickNote[]>(initialQuickNotes);
    const { isDarkMode } = useTheme(); // <-- Use ThemeContext

    return <NotesPage habits={[]} quickNotes={quickNotes} setQuickNotes={setQuickNotes} isDarkMode={isDarkMode} />;
}

const styles = StyleSheet.create({
    pageContainer: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 80, flex: 1 },
    pageTitle: { fontSize: 30, fontWeight: 'bold', marginBottom: 24 },
    card: { borderRadius: 12, marginBottom: 16, padding: 16 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    inputContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    textInput: { flex: 1, padding: 8, borderRadius: 8, borderWidth: 1, fontSize: 14 },
    addButton: { paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 },
    addButtonText: { color: '#fff', fontWeight: '600' },
    notesList: { gap: 8 },
    noteItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderRadius: 8 },
    noteText: { fontSize: 14, flex: 1 },
});