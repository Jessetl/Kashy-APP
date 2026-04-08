import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import {
  Apple,
  Beef,
  CupSoda,
  Ellipsis,
  ShowerHead,
  SprayCan,
  Utensils,
} from 'lucide-react-native';
import React, { useCallback } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from '../../domain/entities/shopping-list.entity';

interface CategoryTabsProps {
  selected: ProductCategory;
  onSelect: (category: ProductCategory) => void;
}

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size: number; color: string }>
> = {
  utensils: Utensils,
  apple: Apple,
  beef: Beef,
  'cup-soda': CupSoda,
  'spray-can': SprayCan,
  'shower-head': ShowerHead,
  ellipsis: Ellipsis,
};

const CategoryTab = React.memo(function CategoryTab({
  item,
  isSelected,
  onPress,
  colors,
}: {
  item: (typeof PRODUCT_CATEGORIES)[number];
  isSelected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useThemeColors>;
}) {
  const Icon = ICON_MAP[item.icon];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tab,
        {
          backgroundColor: isSelected
            ? colors.primaryLight
            : colors.backgroundTertiary,
          borderColor: isSelected ? colors.primary : colors.border,
        },
      ]}
    >
      {Icon && (
        <Icon
          size={14}
          color={isSelected ? colors.primary : colors.textSecondary}
        />
      )}
      <Text
        style={[
          styles.tabLabel,
          {
            color: isSelected ? colors.primary : colors.textSecondary,
          },
        ]}
      >
        {item.label}
      </Text>
    </Pressable>
  );
});

export const CategoryTabs = React.memo(function CategoryTabs({
  selected,
  onSelect,
}: CategoryTabsProps) {
  const colors = useThemeColors();

  const renderItem = useCallback(
    ({ item }: { item: (typeof PRODUCT_CATEGORIES)[number] }) => (
      <CategoryTab
        item={item}
        isSelected={selected === item.key}
        onPress={() => onSelect(item.key)}
        colors={colors}
      />
    ),
    [selected, onSelect, colors],
  );

  const keyExtractor = useCallback(
    (item: (typeof PRODUCT_CATEGORIES)[number]) => item.key,
    [],
  );

  return (
    <View>
      <FlatList
        data={PRODUCT_CATEGORIES}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  listContent: {
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
