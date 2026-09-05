import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { colors, spacing, typography, shadow } from '../theme/theme';

export default function GradientHeader({ title }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 20) + 14,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadow.card,
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    textAlign: 'center',
  },
});
