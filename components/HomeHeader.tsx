import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { Habit } from '../types';

// --- STYLES & THEMES ---
const lightTheme = {
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
};
const darkTheme = {
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    border: '#374151',
};

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

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
        paddingTop: 12,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 16,
    },
    headerQuote: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 8,
    },
    progressCircleContainer: {
        width: 80,
        height: 80,
        position: 'relative',
    },
    progressTextContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    progressTotalText: {
        fontSize: 12,
    },
});

export default HomeHeader;
