import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, shadow, typography } from '../theme/theme';
import GradientHeader from '../components/GradientHeader';

const getLocalDateString = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function WeeklyReportScreen() {
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = async () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      const key = `meals_${dateStr}`;
      const data = await AsyncStorage.getItem(key);
      const meals = data ? JSON.parse(data) : [];
      const totalCals = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
      
      const options = { weekday: 'short' };
      const dayName = d.toLocaleDateString('ar-EG', options);
      days.push({ dayName, dateStr, totalCals });
    }
    setWeeklyData(days);
  };

  const avgCals = weeklyData.length > 0
    ? Math.round(weeklyData.reduce((sum, d) => sum + d.totalCals, 0) / weeklyData.length)
    : 0;

  return (
    <View style={styles.container}>
      <GradientHeader title="التقرير الأسبوعي" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avgCard}>
          <Text style={styles.avgLabel}>متوسط السعرات خلال أسبوع</Text>
          <Text style={styles.avgVal}>{avgCals} <Text style={styles.avgUnit}>سعرة / يوم</Text></Text>
        </View>

        <Text style={styles.sectionTitle}>تفاصيل الأيام السبعة الماضية</Text>

        {weeklyData.map((item, index) => (
          <View key={index} style={styles.dayCard}>
            <View>
              <Text style={styles.dayName}>{item.dayName}</Text>
              <Text style={styles.dateStr}>{item.dateStr}</Text>
            </View>
            <View style={styles.calsBadge}>
              <Text style={styles.calsText}>{item.totalCals} سعرة</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: 30 },
  avgCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginTop: -18, alignItems: 'center', ...shadow.card },
  avgLabel: { ...typography.caption, marginBottom: 6 },
  avgVal: { fontSize: 32, fontWeight: '800', color: colors.primary },
  avgUnit: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  sectionTitle: { ...typography.h3, marginTop: spacing.lg, marginBottom: spacing.md },
  dayCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...shadow.card },
  dayName: { ...typography.body, fontWeight: '700' },
  dateStr: { ...typography.caption, marginTop: 2 },
  calsBadge: { backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.sm },
  calsText: { color: colors.primary, fontWeight: '800', fontSize: 13 },
});
