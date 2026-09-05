import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, shadow, typography } from '../theme/theme';
import GradientHeader from '../components/GradientHeader';

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayKey = () => `meals_${getLocalDateString()}`;

export default function DiaryScreen({ navigation }) {
  const [meals, setMeals] = useState([]);

  const loadMeals = async () => {
    try {
      const data = await AsyncStorage.getItem(todayKey());
      if (data) {
        setMeals(JSON.parse(data));
      } else {
        setMeals([]);
      }
    } catch (e) {
      setMeals([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [])
  );

  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const targetCalories = 2000;
  const remaining = targetCalories - totalCalories;

  const deleteMeal = async (id) => {
    Alert.alert('حذف الوجبة', 'هل أنت متأكد من حذف هذه الوجبة؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onDismiss: () => {},
        onPress: async () => {
          const updated = meals.filter(m => m.id !== id);
          setMeals(updated);
          await AsyncStorage.setItem(todayKey(), JSON.stringify(updated));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="يوميات السعرات" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryVal}>{totalCalories}</Text>
              <Text style={styles.summaryLbl}>المستهلك</Text>
            </View>
            <View style={[styles.summaryItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border }]}>
              <Text style={[styles.summaryVal, { color: remaining >= 0 ? colors.primary : '#E85D75' }]}>
                {remaining}
              </Text>
              <Text style={styles.summaryLbl}>المتبقي</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryVal}>{targetCalories}</Text>
              <Text style={styles.summaryLbl}>الهدف</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>وجبات اليوم</Text>
          <TouchableOpacity onPress={() => navigation.navigate('WeeklyReport')}>
            <Text style={styles.linkText}>التقرير الأسبوعي 📈</Text>
          </TouchableOpacity>
        </View>

        {meals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyText}>لا توجد وجبات مسجلة اليوم</Text>
            <Text style={styles.emptySub}>اضغط على الزر أدناه لإضافة وجبتك الأولى</Text>
          </View>
        ) : (
          meals.map(item => (
            <View key={item.id} style={styles.mealCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mealName}>{item.name}</Text>
                <Text style={styles.mealDetails}>{item.grams}g • {item.brand}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.mealCals}>{item.calories} سعرة</Text>
                <TouchableOpacity onPress={() => deleteMeal(item.id)} style={styles.delBtn}>
                  <Text style={styles.delText}>حذف</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.88}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.fabText}>+ إضافة طعام</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: 90 },
  summaryCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginTop: -18, ...shadow.card },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryVal: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  summaryLbl: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: { ...typography.h3 },
  linkText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: colors.surface, borderRadius: radius.md, ...shadow.card, marginTop: 8 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { ...typography.body, fontWeight: '700' },
  emptySub: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  mealCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: 10, flexDirection: 'row', alignItems: 'center', ...shadow.card },
  mealName: { ...typography.body, fontWeight: '700' },
  mealDetails: { ...typography.caption, marginTop: 3 },
  mealCals: { fontSize: 15, fontWeight: '800', color: colors.primary },
  delBtn: { marginTop: 6 },
  delText: { color: '#E85D75', fontSize: 11, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 20, left: spacing.md, right: spacing.md, backgroundColor: colors.primary, paddingVertical: 16, borderRadius: radius.md, alignItems: 'center', ...shadow.fab },
  fabText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
