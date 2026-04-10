import { useAppTheme } from '@/shared/presentation/hooks/use-app-theme';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DebtSummaryCardsProps {
  totalDebts: number;
  totalCollections: number;
}

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const DebtSummaryCards = React.memo(function DebtSummaryCards({
  totalDebts,
  totalCollections,
}: DebtSummaryCardsProps) {
  const { colors } = useAppTheme();

  const balance = useMemo(
    () => totalCollections - totalDebts,
    [totalCollections, totalDebts],
  );

  const balanceColor = balance >= 0 ? colors.success : colors.danger;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.backgroundSecondary, borderColor: colors.danger },
        ]}
      >
        <Text style={[styles.cardLabel, { color: colors.danger }]}>
          Por pagar
        </Text>
        <Text
          style={[styles.cardAmount, { color: colors.textOnSurface }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.58}
        >
          ${formatter.format(totalDebts)}
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.backgroundSecondary, borderColor: colors.success },
        ]}
      >
        <Text style={[styles.cardLabel, { color: colors.success }]}>
          Por cobrar
        </Text>
        <Text
          style={[styles.cardAmount, { color: colors.textOnSurface }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.58}
        >
          ${formatter.format(totalCollections)}
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.backgroundSecondary, borderColor: balanceColor },
        ]}
      >
        <Text style={[styles.cardLabel, { color: balanceColor }]}>Balance</Text>
        <Text
          style={[styles.cardAmount, { color: colors.textOnSurface }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.58}
        >
          ${formatter.format(Math.abs(balance))}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    gap: 4,
    borderLeftWidth: 3,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
