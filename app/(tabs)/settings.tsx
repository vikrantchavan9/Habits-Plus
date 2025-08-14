import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext'; // <-- Import the context

const lightTheme = {
    background: '#f3f4f6', card: '#ffffff', text: '#1f2937', textSecondary: '#6b7280', border: '#e5e7eb',
};
const darkTheme = {
    background: '#111827', card: '#1f2937', text: '#f9fafb', textSecondary: '#9ca3af', border: '#374151',
};

const SettingsPage: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useTheme(); // <-- Use context
    const colors = isDarkMode ? darkTheme : lightTheme;
    return (
        <View style={[styles.pageContainer, { backgroundColor: colors.background }]}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>Settings</Text>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Appearance</Text>
                <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleDarkMode}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                    />
                </View>
            </View>
        </View>
    );
};

export default function SettingsScreen() {
    return <SettingsPage />;
}

const styles = StyleSheet.create({
    pageContainer: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 80 },
    pageTitle: { fontSize: 30, fontWeight: 'bold', marginBottom: 24 },
    card: { borderRadius: 12, marginBottom: 16, padding: 16 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    settingLabel: { fontSize: 16 },
});