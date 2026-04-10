import { AppPressable } from '@/shared/presentation/components/ui';
import { useAppTheme } from '@/shared/presentation/hooks/use-app-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import type { DebtTab } from '../../infrastructure/store/debt.store';

interface DebtTabSelectorProps {
  activeTab: DebtTab;
  onTabChange: (tab: DebtTab) => void;
}

export const DebtTabSelector = React.memo(function DebtTabSelector({
  activeTab,
  onTabChange,
}: DebtTabSelectorProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <AppPressable
        onPress={() => onTabChange('debts')}
        style={[
          styles.tab,
          activeTab === 'debts' && {
            backgroundColor: colors.danger,
          },
        ]}
      >
        <Text
          style={[
            styles.tabText,
            {
              color:
                activeTab === 'debts' ? '#FFFFFF' : colors.textSecondary,
            },
          ]}
        >
          Deudas
        </Text>
      </AppPressable>

      <AppPressable
        onPress={() => onTabChange('collections')}
        style={[
          styles.tab,
          activeTab === 'collections' && {
            backgroundColor: colors.success,
          },
        ]}
      >
        <Text
          style={[
            styles.tabText,
            {
              color:
                activeTab === 'collections'
                  ? '#FFFFFF'
                  : colors.textSecondary,
            },
          ]}
        >
          Cobros
        </Text>
      </AppPressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
