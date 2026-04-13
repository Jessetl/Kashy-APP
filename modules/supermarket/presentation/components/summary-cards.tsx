import { useCountry } from '@/shared/presentation/hooks/use-country';
import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const amountFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface SummaryCardsProps {
  totalLocal: number;
  totalUsd: number;
  spentLocal: number;
  ivaEnabled: boolean;
}

export const SummaryCards = React.memo(function SummaryCards({
  totalLocal,
  totalUsd,
  spentLocal,
  ivaEnabled,
}: SummaryCardsProps) {
  const colors = useThemeColors();
  const { country } = useCountry();

  const values = useMemo(
    () => ({
      totalUsd: `$ ${amountFormatter.format(totalUsd)}`,
      spentUsd: `$ ${amountFormatter.format(spentLocal)}`,
      totalLocal: `${country.currency} ${amountFormatter.format(totalLocal)}`,
    }),
    [totalUsd, spentLocal, totalLocal, country.currency],
  );

  const cardStyles = useMemo(
    () => ({
      total: {
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.primary,
      },
      spent: {
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.danger,
      },
      ves: {
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
      },
    }),
    [colors.backgroundSecondary, colors.primary, colors.danger, colors.border],
  );

  return (
    <View style={styles.container}>
      {/* Total USD */}
      <View style={[styles.card, cardStyles.total]}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
          Total
        </Text>
        <Text
          style={[styles.cardValue, { color: colors.primary }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.58}
        >
          {values.totalUsd}
        </Text>
      </View>

      {/* Gastado */}
      <View style={[styles.card, cardStyles.spent]}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
          Gastado
        </Text>
        <Text
          style={[styles.cardValue, { color: colors.danger }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.58}
        >
          {values.spentUsd}
        </Text>
      </View>

      {/* En Bs */}
      <View style={[styles.card, cardStyles.ves]}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
          {country.currencyLabel}
        </Text>
        <Text
          style={[styles.cardValue, { color: colors.textOnSurface }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.58}
        >
          {values.totalLocal}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    gap: 2,
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
  },
});
