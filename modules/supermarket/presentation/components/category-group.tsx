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
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  PRODUCT_CATEGORIES,
  type ShoppingItem,
} from '../../domain/entities/shopping-list.entity';
import { ProductItem } from './product-item';

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

interface CategoryGroupProps {
  category: string;
  items: ShoppingItem[];
  exchangeRate: number | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: ShoppingItem) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

function areCategoryItemsEqual(
  prevItems: ShoppingItem[],
  nextItems: ShoppingItem[],
): boolean {
  if (prevItems.length !== nextItems.length) {
    return false;
  }

  for (let index = 0; index < prevItems.length; index += 1) {
    const prevItem = prevItems[index];
    const nextItem = nextItems[index];

    if (prevItem === nextItem) {
      continue;
    }

    if (
      prevItem.id !== nextItem.id ||
      prevItem.listId !== nextItem.listId ||
      prevItem.productName !== nextItem.productName ||
      prevItem.unitPriceLocal !== nextItem.unitPriceLocal ||
      prevItem.quantity !== nextItem.quantity ||
      prevItem.totalLocal !== nextItem.totalLocal ||
      prevItem.unitPriceUsd !== nextItem.unitPriceUsd ||
      prevItem.totalUsd !== nextItem.totalUsd ||
      prevItem.isPurchased !== nextItem.isPurchased ||
      prevItem.category !== nextItem.category ||
      prevItem.createdAt !== nextItem.createdAt
    ) {
      return false;
    }
  }

  return true;
}

function areCategoryGroupPropsEqual(
  prevProps: CategoryGroupProps,
  nextProps: CategoryGroupProps,
): boolean {
  return (
    prevProps.category === nextProps.category &&
    prevProps.exchangeRate === nextProps.exchangeRate &&
    prevProps.onToggle === nextProps.onToggle &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onQuantityChange === nextProps.onQuantityChange &&
    areCategoryItemsEqual(prevProps.items, nextProps.items)
  );
}

export const CategoryGroup = React.memo(function CategoryGroup({
  category,
  items,
  exchangeRate,
  onToggle,
  onDelete,
  onEdit,
  onQuantityChange,
}: CategoryGroupProps) {
  const colors = useThemeColors();

  const catInfo = React.useMemo(
    () => PRODUCT_CATEGORIES.find((c) => c.key === category),
    [category],
  );

  const label = catInfo?.label ?? category;
  const Icon = catInfo ? ICON_MAP[catInfo.icon] : null;

  return (
    <View style={styles.container}>
      {/* Category header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.primary,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          {Icon && (
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Icon size={16} color={colors.primary} />
            </View>
          )}
          <Text style={[styles.headerLabel, { color: colors.textOnSurface }]}>
            {label}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.badgeText, { color: colors.textInverse }]}>
            {items.length}
          </Text>
        </View>
      </View>

      {/* Items */}
      {items.map((item) => (
        <ProductItem
          key={item.id}
          item={item}
          exchangeRate={exchangeRate}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </View>
  );
}, areCategoryGroupPropsEqual);

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
