import { AppPressable } from '@/shared/presentation/components/ui';
import { useAppTheme } from '@/shared/presentation/hooks/use-app-theme';
import { formatUsdAmount } from '@/shared/presentation/utils/format-currency';
import { useRouter } from 'expo-router';
import { ArrowRight, CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FinanceOverviewProps {
  totalDebts: number;
  totalCollections: number;
  balance: number;
  overdueCount: number;
}

export const FinanceOverview = React.memo(function FinanceOverview({
  totalDebts,
  totalCollections,
  balance,
  overdueCount,
}: FinanceOverviewProps) {
  const { colors } = useAppTheme();
  const router = useRouter();

  const isBalanced = balance === 0;
  const balanceColor = isBalanced
    ? colors.success
    : balance > 0
      ? colors.success
      : colors.danger;
  const BalanceIcon = isBalanced
    ? CheckCircle2
    : balance > 0
      ? TrendingUp
      : TrendingDown;
  const hasNoActivity = totalDebts === 0 && totalCollections === 0;
  const balanceHint = isBalanced
    ? hasNoActivity
      ? 'Todo en orden, no debes nada'
      : 'Todo al día, estás cuadrado'
    : balance > 0
      ? 'Te deben mas de lo que debes'
      : 'Debes mas de lo que te deben';

  const handleNavigate = useCallback(() => {
    router.push('/(tabs)/debts');
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textOnSurface }]}>
          Finanzas
        </Text>
        <AppPressable onPress={handleNavigate} style={styles.seeAll}>
          <Text style={[styles.seeAllText, { color: colors.primary }]}>
            Ver todo
          </Text>
          <ArrowRight size={14} color={colors.primary} pointerEvents="none" />
        </AppPressable>
      </View>

      {/* Balance principal */}
      <View style={[styles.balanceCard, { backgroundColor: colors.backgroundTertiary }]}>
        <View style={styles.balanceLeft}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
            Balance neto
          </Text>
          <View style={styles.balanceRow}>
            <BalanceIcon size={22} color={balanceColor} pointerEvents="none" />
            <Text
              style={[styles.balanceAmount, { color: colors.textOnSurface }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.6}
            >
              {formatUsdAmount(Math.abs(balance))}
            </Text>
          </View>
          <Text style={[styles.balanceHint, { color: balanceColor }]}>
            {balanceHint}
          </Text>
        </View>
        {overdueCount > 0 && (
          <View style={[styles.overdueBadge, { backgroundColor: colors.dangerLight }]}>
            <Text style={[styles.overdueCount, { color: colors.danger }]}>
              {overdueCount}
            </Text>
            <Text style={[styles.overdueLabel, { color: colors.danger }]}>
              vencida{overdueCount > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Row de deudas y cobros */}
      <View style={styles.row}>
        <View
          style={[
            styles.miniCard,
            { backgroundColor: colors.backgroundTertiary, borderLeftColor: colors.danger },
          ]}
        >
          <Text style={[styles.miniLabel, { color: colors.danger }]}>
            Por pagar
          </Text>
          <Text
            style={[styles.miniAmount, { color: colors.textOnSurface }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
          >
            {formatUsdAmount(totalDebts)}
          </Text>
        </View>
        <View
          style={[
            styles.miniCard,
            { backgroundColor: colors.backgroundTertiary, borderLeftColor: colors.success },
          ]}
        >
          <Text style={[styles.miniLabel, { color: colors.success }]}>
            Por cobrar
          </Text>
          <Text
            style={[styles.miniAmount, { color: colors.textOnSurface }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
          >
            {formatUsdAmount(totalCollections)}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
  },
  balanceLeft: {
    flex: 1,
    gap: 4,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  balanceHint: {
    fontSize: 12,
    fontWeight: '500',
  },
  overdueBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 2,
  },
  overdueCount: {
    fontSize: 20,
    fontWeight: '700',
  },
  overdueLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  miniCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    gap: 4,
    borderLeftWidth: 3,
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  miniAmount: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
