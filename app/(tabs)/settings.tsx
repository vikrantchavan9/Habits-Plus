import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import React from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
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
    const { logOut, userId } = useAuth();

    const handleLogOut = async () => {
        try {
            await logOut();
            router.replace('/signIn');
        } catch (error: any) {
            Alert.alert("Logout Failed", error.message);
        }
    };

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
                <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: colors.text, flex: 1 }]}>User ID: <Text style={{color: colors.textSecondary, fontSize: 12}}>{userId}</Text></Text>
                </View>
                <TouchableOpacity onPress={handleLogOut} style={styles.logoutButton}>
                    <LogOut color="#ef4444" width={20} height={20} />
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>
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
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#fee2e2',
    },
    logoutButtonText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});