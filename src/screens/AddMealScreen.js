import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { interstitialManager } from '../utils/AdManager';
import { colors, spacing, radius, shadow, typography } from '../theme/theme';
import GradientHeader from '../components/GradientHeader';

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayKey = () => `meals_${getLocalDateString()}`;

const MACRO_META = {
  calories: { label: 'سعرة', icon: '🔥', color: colors.primary, bg: colors.primarySoft },
  protein: { label: 'بروتين', icon: '💪', color: '#E85D75', bg: '#FDECEF' },
  carbs: { label: 'كارب', icon: '🌾', color: '#D9A441', bg: '#FBF3E1' },
  fat: { label: 'دهون', icon: '🥑', color: '#5C9E5C', bg: '#EBF5EB' },
};

export default function AddMealScreen({ route, navigation }) {
  const { product } = route.params;
  const [grams, setGrams] = useState(String(product.servingSize));

  const calculated = () => {
    const g = parseFloat(grams) || 0;
    const factor = g / 100;
    return {
      calories: Math.round(product.caloriesPer100g * factor),
      protein: (product.protein * factor).toFixed(1),
      carbs: (product.carbs * factor).toFixed(1),
      fat: (product.fat * factor).toFixed(1),
    };
  };

  const result = calculated();

  const addMeal = async () => {
    const key = todayKey();
    const existing = await AsyncStorage.getItem(key);
    const meals = existing ? JSON.parse(existing) : [];
    meals.push({
      id: Date.now().toString(),
      name: product.name,
      brand: product.brand,
      grams: parseFloat(grams),
      ...result,
      time: new Date().toISOString(),
    });
    await AsyncStorage.setItem(key, JSON.stringify(meals));

    interstitialManager.showAfterMealAdd();

    Alert.alert('تمت الإضافة ✓', `أضفنا ${result.calories} سعرة لسجل اليوم`);
    navigation.navigate('Diary');
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="إضافة وجبة" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.productCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>{product.brand}</Text>

          <Text style={styles.label}>الكمية (بالغرام أو مل)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={grams}
            onChangeText={setGrams}
            textAlign="center"
          />
        </View>

        <View style={styles.macroGrid}>
          {Object.entries(MACRO_META).map(([key, meta]) => (
            <View key={key} style={[styles.macroBox, { backgroundColor: meta.bg }]}>
              <Text style={styles.macroIcon}>{meta.icon}</Text>
              <Text style={[styles.macroValue, { color: meta.color }]}>
                {result[key]}
                {key !== 'calories' ? 'g' : ''}
              </Text>
              <Text style={styles.macroLabel}>{meta.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addBtn} onPress={addMeal} activeOpacity={0.88}>
        <Text style={styles.addBtnText}>أضف لسجل اليوم</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: 20 },
  productCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginTop: -18, ...shadow.card },
  productName: { ...typography.h2 },
  productBrand: { ...typography.caption, marginTop: 4, marginBottom: spacing.lg },
  label: { ...typography.caption, marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: colors.background, borderRadius: radius.sm, paddingVertical: 14, fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  macroGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md, gap: 10 },
  macroBox: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: radius.md },
  macroIcon: { fontSize: 20, marginBottom: 6 },
  macroValue: { fontSize: 16, fontWeight: '800' },
  macroLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 4 },
  addBtn: { backgroundColor: colors.primary, marginHorizontal: spacing.md, marginBottom: spacing.md, paddingVertical: 17, borderRadius: radius.md, alignItems: 'center', ...shadow.fab },
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
