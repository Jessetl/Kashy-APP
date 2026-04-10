import { BottomSheetModal } from '@/shared/presentation/components/ui';
import { AppPressable } from '@/shared/presentation/components/ui';
import { useAppTheme } from '@/shared/presentation/hooks/use-app-theme';
import { useExchangeRate } from '@/modules/shared-services/exchange-rate/presentation/use-exchange-rate';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Debt } from '../../domain/entities/debt.entity';
import { useDebts } from '../hooks/use-debts';
import { DebtCard } from '../components/debt-card';
import { DebtForm } from '../components/debt-form';
import { DebtSummaryCards } from '../components/debt-summary-cards';
import { DebtTabSelector } from '../components/debt-tab-selector';
import { EmptyDebts } from '../components/empty-debts';
import { PriorityFilter } from '../components/priority-filter';

export default function DebtsScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { rate } = useExchangeRate();

  const {
    debts,
    isLoading,
    activeTab,
    priorityFilter,
    summary,
    isAuthenticated,
    setActiveTab,
    setPriorityFilter,
    markAsPaid,
    deleteDebt,
    reload,
    requireAuth,
  } = useDebts();

  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  const handleAddPress = useCallback(() => {
    requireAuth(() => {
      setEditingDebt(null);
      setShowForm(true);
    });
  }, [requireAuth]);

  const handleDebtPress = useCallback(
    (debt: Debt) => {
      router.push(`/(tabs)/debts/${debt.id}`);
    },
    [router],
  );

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setEditingDebt(null);
    void reload();
  }, [reload]);

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setEditingDebt(null);
  }, []);

  const exchangeRate = rate?.rateLocalPerUsd ?? null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + 16, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={reload}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              Deudas & Cobros
            </Text>
            <Text style={[styles.subtitle, { color: colors.gradientEnd }]}>
              Organiza lo que debes y lo que te deben
            </Text>
          </View>
        </View>

        {/* Summary Cards */}
        <DebtSummaryCards
          totalDebts={summary.totalDebts}
          totalCollections={summary.totalCollections}
        />

        {/* Tab Selector */}
        <DebtTabSelector activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Priority Filter */}
        <PriorityFilter
          activeFilter={priorityFilter}
          onFilterChange={setPriorityFilter}
        />

        {/* Debt List */}
        {isLoading && debts.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : debts.length === 0 ? (
          <EmptyDebts isCollection={activeTab === 'collections'} />
        ) : (
          <View style={styles.listContainer}>
            {debts.map((debt) => (
              <DebtCard
                key={debt.id}
                debt={debt}
                exchangeRate={exchangeRate}
                onPress={handleDebtPress}
                onMarkAsPaid={markAsPaid}
                onDelete={deleteDebt}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <AppPressable
        onPress={handleAddPress}
        style={[
          styles.fab,
          {
            backgroundColor: activeTab === 'collections' ? colors.success : colors.danger,
            bottom: insets.bottom + 80,
          },
        ]}
      >
        <Plus size={24} color="#FFFFFF" pointerEvents="none" />
      </AppPressable>

      {/* Form Modal */}
      <BottomSheetModal
        visible={showForm}
        onClose={handleFormCancel}
        heightRatio={0.85}
        showCloseButton
      >
        <DebtForm
          editingDebt={editingDebt}
          isCollection={activeTab === 'collections'}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </BottomSheetModal>
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    marginTop: 2,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  listContainer: {
    gap: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
