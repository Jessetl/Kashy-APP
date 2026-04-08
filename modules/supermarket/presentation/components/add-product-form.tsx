import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import { Check, Plus } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

interface AddProductFormProps {
  onAdd: (name: string, price: number) => void;
  initialName?: string;
  initialPrice?: string;
}

export const AddProductForm = React.memo(function AddProductForm({
  onAdd,
  initialName,
  initialPrice,
}: AddProductFormProps) {
  const colors = useThemeColors();
  const [productName, setProductName] = useState(initialName ?? '');
  const [price, setPrice] = useState(initialPrice ?? '');

  const isEditing = initialName != null;

  useEffect(() => {
    setProductName(initialName ?? '');
    setPrice(initialPrice ?? '');
  }, [initialName, initialPrice]);

  const handleAdd = useCallback(() => {
    const trimmedName = productName.trim();
    const numPrice = parseFloat(price.replace(',', '.'));

    if (!trimmedName || isNaN(numPrice) || numPrice <= 0) {
      return;
    }

    onAdd(trimmedName, numPrice);
    setProductName('');
    setPrice('');
  }, [productName, price, onAdd]);

  const handlePriceChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9.,]/g, '');
    setPrice(cleaned);
  }, []);

  const isValid =
    productName.trim().length > 0 &&
    price.length > 0 &&
    parseFloat(price.replace(',', '.')) > 0;

  const ActionIcon = isEditing ? Check : Plus;

  return (
    <View style={styles.container}>
      <View style={styles.inputsColumn}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundTertiary,
              color: colors.textOnSurface,
            },
          ]}
          placeholder='Producto'
          placeholderTextColor={colors.textTertiary}
          value={productName}
          onChangeText={setProductName}
          autoCorrect={false}
          autoCapitalize='sentences'
          returnKeyType='next'
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundTertiary,
              color: colors.textOnSurface,
            },
          ]}
          placeholder='Precio'
          placeholderTextColor={colors.textTertiary}
          value={price}
          onChangeText={handlePriceChange}
          keyboardType='numeric'
          returnKeyType='done'
        />
      </View>
      <Pressable
        onPress={handleAdd}
        disabled={!isValid}
        style={[
          styles.addButton,
          {
            backgroundColor: isValid
              ? colors.primary
              : colors.backgroundTertiary,
          },
        ]}
      >
        <ActionIcon
          size={26}
          color={isValid ? colors.textInverse : colors.textTertiary}
        />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputsColumn: {
    flex: 1,
    gap: 8,
  },
  input: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '500',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
