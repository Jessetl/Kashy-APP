import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import { Check, Minus, Pencil, Plus, Trash2 } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ShoppingItem } from '../../domain/entities/shopping-list.entity';

interface ProductItemProps {
  item: ShoppingItem;
  exchangeRate: number | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: ShoppingItem) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

function asFiniteNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function hasValidExchangeRate(
  exchangeRate: number | null,
): exchangeRate is number {
  return typeof exchangeRate === 'number' && exchangeRate > 0;
}

function areShoppingItemsEqual(
  prevItem: ShoppingItem,
  nextItem: ShoppingItem,
): boolean {
  return (
    prevItem.id === nextItem.id &&
    prevItem.listId === nextItem.listId &&
    prevItem.productName === nextItem.productName &&
    prevItem.unitPriceLocal === nextItem.unitPriceLocal &&
    prevItem.quantity === nextItem.quantity &&
    prevItem.totalLocal === nextItem.totalLocal &&
    prevItem.unitPriceUsd === nextItem.unitPriceUsd &&
    prevItem.totalUsd === nextItem.totalUsd &&
    prevItem.isPurchased === nextItem.isPurchased &&
    prevItem.category === nextItem.category &&
    prevItem.createdAt === nextItem.createdAt
  );
}

function areProductItemPropsEqual(
  prevProps: ProductItemProps,
  nextProps: ProductItemProps,
): boolean {
  const sameItemReference = prevProps.item === nextProps.item;

  return (
    prevProps.exchangeRate === nextProps.exchangeRate &&
    prevProps.onToggle === nextProps.onToggle &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onQuantityChange === nextProps.onQuantityChange &&
    (sameItemReference || areShoppingItemsEqual(prevProps.item, nextProps.item))
  );
}

export const ProductItem = React.memo(function ProductItem({
  item,
  exchangeRate,
  onToggle,
  onDelete,
  onEdit,
  onQuantityChange,
}: ProductItemProps) {
  const colors = useThemeColors();

  const safeQuantity = useMemo(
    () => Math.max(1, Math.trunc(asFiniteNumber(item.quantity, 1))),
    [item.quantity],
  );

  const safeUnitPriceLocal = useMemo(
    () => asFiniteNumber(item.unitPriceLocal, 0),
    [item.unitPriceLocal],
  );

  const safeTotalLocal = useMemo(() => {
    const totalLocal = asFiniteNumber(item.totalLocal, Number.NaN);
    if (Number.isFinite(totalLocal)) {
      return totalLocal;
    }

    return safeUnitPriceLocal * safeQuantity;
  }, [item.totalLocal, safeQuantity, safeUnitPriceLocal]);

  const handleToggle = useCallback(
    () => onToggle(item.id),
    [item.id, onToggle],
  );

  const handleDelete = useCallback(
    () => onDelete(item.id),
    [item.id, onDelete],
  );

  const handleEdit = useCallback(() => onEdit(item), [item, onEdit]);

  const handleIncrement = useCallback(
    () => onQuantityChange(item.id, safeQuantity + 1),
    [item.id, onQuantityChange, safeQuantity],
  );

  const handleDecrement = useCallback(() => {
    if (safeQuantity > 1) onQuantityChange(item.id, safeQuantity - 1);
  }, [item.id, onQuantityChange, safeQuantity]);

  const displayData = useMemo(() => {
    if (hasValidExchangeRate(exchangeRate)) {
      const unitUsd = safeUnitPriceLocal / exchangeRate;
      const totalUsd = safeTotalLocal / exchangeRate;

      return {
        unitPriceLabel: `$${unitUsd.toFixed(2)} c/u  Bs ${safeUnitPriceLocal.toFixed(2)} c/u`,
        primaryTotalLabel: `$${totalUsd.toFixed(2)}`,
        secondaryTotalLabel: `Bs ${safeTotalLocal.toFixed(0)}`,
      };
    }

    return {
      unitPriceLabel: `Bs ${safeUnitPriceLocal.toFixed(2)} c/u`,
      primaryTotalLabel: `Bs ${safeTotalLocal.toFixed(2)}`,
      secondaryTotalLabel: `Bs ${safeTotalLocal.toFixed(0)}`,
    };
  }, [exchangeRate, safeTotalLocal, safeUnitPriceLocal]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.borderLight,
          opacity: item.isPurchased ? 0.55 : 1,
        },
      ]}
    >
      {/* Top row: name + delete */}
      <View style={styles.topRow}>
        <Text
          style={[
            styles.name,
            {
              color: colors.textOnSurface,
              textDecorationLine: item.isPurchased ? 'line-through' : 'none',
            },
          ]}
          numberOfLines={1}
        >
          {item.productName}
        </Text>
        <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteBtn}>
          <Trash2 size={15} color={colors.danger} />
        </Pressable>
      </View>

      {/* Unit price row */}
      <Text style={[styles.unitPrice, { color: colors.textSecondary }]}>
        {displayData.unitPriceLabel}
      </Text>

      {/* Bottom row: checkbox, edit, quantity, totals */}
      <View style={styles.bottomRow}>
        <Pressable onPress={handleToggle} style={styles.checkboxArea}>
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: item.isPurchased
                  ? colors.primary
                  : 'transparent',
                borderColor: item.isPurchased
                  ? colors.primary
                  : colors.textSecondary,
              },
            ]}
          >
            {item.isPurchased && <Check size={14} color={colors.textInverse} />}
          </View>
        </Pressable>

        <Pressable onPress={handleEdit} style={styles.editBtn}>
          <Pencil size={16} color={colors.textSecondary} />
        </Pressable>

        {/* Quantity controls */}
        <View
          style={[
            styles.quantityGroup,
            { backgroundColor: colors.backgroundTertiary },
          ]}
        >
          <Pressable
            onPress={handleDecrement}
            style={styles.qtyBtn}
            disabled={safeQuantity <= 1}
          >
            <Minus
              size={14}
              color={
                safeQuantity <= 1 ? colors.textTertiary : colors.textOnSurface
              }
            />
          </Pressable>
          <Text style={[styles.qtyText, { color: colors.textOnSurface }]}>
            {safeQuantity}
          </Text>
          <Pressable onPress={handleIncrement} style={styles.qtyBtn}>
            <Plus size={14} color={colors.textOnSurface} />
          </Pressable>
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <Text style={[styles.totalUsd, { color: colors.primary }]}>
            {displayData.primaryTotalLabel}
          </Text>
          <Text style={[styles.totalBs, { color: colors.textSecondary }]}>
            {displayData.secondaryTotalLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}, areProductItemPropsEqual);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  deleteBtn: {
    padding: 4,
  },
  unitPrice: {
    fontSize: 12,
    fontWeight: '400',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  checkboxArea: {
    padding: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    padding: 6,
  },
  quantityGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    gap: 2,
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  totals: {
    flex: 1,
    alignItems: 'flex-end',
  },
  totalUsd: {
    fontSize: 15,
    fontWeight: '700',
  },
  totalBs: {
    fontSize: 12,
    fontWeight: '400',
  },
});
