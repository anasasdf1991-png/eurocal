import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, radius, shadow, typography } from '../theme/theme';
import GradientHeader from '../components/GradientHeader';

const MOCK_PRODUCTS = [
  { id: '1', name: 'صدور دجاج مشوية', brand: 'بيتزا / مطعم', servingSize: 150, caloriesPer100g: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: '2', name: 'أرز أبيض مطبوخ', brand: 'حبوب', servingSize: 100, caloriesPer100g: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { id: '3', name: 'شوكولاتة دايجستيف', brand: 'مكافأة سكرية', servingSize: 30, caloriesPer100g: 480, protein: 6, carbs: 64, fat: 22 },
  { id: '4', name: 'موز طبيعي', brand: 'فواكه', servingSize: 120, caloriesPer100g: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { id: '5', name: 'حليب كامل الدسم', brand: 'ألبان', servingSize: 200, caloriesPer100g: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  { id: '6', name: 'خبز عربي أبيض', brand: 'مخبوزات', servingSize: 60, caloriesPer100g: 275, protein: 9.1, carbs: 55, fat: 1.2 },
];

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');

  const filtered = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <GradientHeader title="إضافة طعام" />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن طعام أو منتج..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('AddMeal', { product: item })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemBrand}>{item.brand}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.caloriesPer100g} سعرة / 100g</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: { padding: spacing.md, marginTop: -16 },
  searchInput: { backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: colors.textPrimary, ...shadow.card },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: 20 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: 10, flexDirection: 'row', alignItems: 'center', ...shadow.card },
  itemName: { ...typography.body, fontWeight: '700' },
  itemBrand: { ...typography.caption, marginTop: 3 },
  badge: { backgroundColor: colors.primarySoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm },
  badgeText: { color: colors.primary, fontWeight: '700', fontSize: 11 },
});
