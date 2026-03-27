import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/shared/presentation/hooks/use-app-theme';

export default function SupermarketScreen() {
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
      <Text style={[styles.title, { color: colors.text }]}>Supermercado</Text>
      <Text style={[styles.subtitle, { color: colors.gradientEnd }]}>
        Gestiona tus listas de compras
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.textOnSurface }]}>
          Nueva Lista
        </Text>
        <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
          Crea una lista de compras y compara precios en VES y USD
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.textOnSurface }]}>
          Historial
        </Text>
        <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
          Revisa tus compras anteriores y tendencias de precios
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
    gap: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
});
