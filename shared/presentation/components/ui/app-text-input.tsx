import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

interface AppTextInputProps extends Omit<TextInputProps, 'style'> {
  /** Label encima del input */
  label?: string;
  /** Mostrar borde rojo de error */
  hasError?: boolean;
}

export const AppTextInput = React.memo(function AppTextInput({
  label,
  hasError = false,
  ...inputProps
}: AppTextInputProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textOnSurface }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.backgroundTertiary,
            color: colors.textOnSurface,
            borderColor: hasError ? colors.danger : colors.border,
          },
        ]}
        placeholderTextColor={colors.textTertiary}
        autoCorrect={false}
        {...inputProps}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
});
