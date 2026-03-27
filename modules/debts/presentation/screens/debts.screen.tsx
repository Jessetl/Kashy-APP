import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/shared/presentation/hooks/use-app-theme';

export default function DebtsScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 16, paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Deudas & Cobros
      </Text>
      <Text style={[styles.subtitle, { color: colors.gradientEnd }]}>
        Organiza lo que debes y lo que te deben
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <View style={[styles.indicator, { backgroundColor: colors.danger }]} />
        <Text style={[styles.cardLabel, { color: colors.danger }]}>
          Deudas por Pagar
        </Text>
        <Text style={[styles.cardAmount, { color: colors.textOnSurface }]}>
          $0.00
        </Text>
        <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
          No tienes deudas pendientes
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <View style={[styles.indicator, { backgroundColor: colors.primary }]} />
        <Text style={[styles.cardLabel, { color: colors.primary }]}>
          Cobros Pendientes
        </Text>
        <Text style={[styles.cardAmount, { color: colors.textOnSurface }]}>
          $0.00
        </Text>
        <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
          No tienes cobros pendientes
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    marginTop: -8,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    gap: 4,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardAmount: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400',
  },
});
