import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import { LayoutGrid, List } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  mode: ViewMode;
  onToggle: (mode: ViewMode) => void;
  itemCount: number;
}

export const ViewToggle = React.memo(function ViewToggle({
  mode,
  onToggle,
  itemCount,
}: ViewToggleProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.count, { color: colors.textOnSurface }]}>
        {itemCount} producto{itemCount !== 1 ? 's' : ''}
      </Text>
      <View style={styles.toggleGroup}>
        <Pressable
          onPress={() => onToggle('grid')}
          style={[
            styles.toggleButton,
            {
              backgroundColor:
                mode === 'grid'
                  ? colors.primaryLight
                  : colors.backgroundTertiary,
              borderColor: mode === 'grid' ? colors.primary : colors.border,
            },
          ]}
        >
          <LayoutGrid
            size={16}
            color={mode === 'grid' ? colors.primary : colors.textSecondary}
          />
        </Pressable>
        <Pressable
          onPress={() => onToggle('list')}
          style={[
            styles.toggleButton,
            {
              backgroundColor:
                mode === 'list'
                  ? colors.primaryLight
                  : colors.backgroundTertiary,
              borderColor: mode === 'list' ? colors.primary : colors.border,
            },
          ]}
        >
          <List
            size={16}
            color={mode === 'list' ? colors.primary : colors.textSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  count: {
    fontSize: 14,
    fontWeight: '500',
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  toggleButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
