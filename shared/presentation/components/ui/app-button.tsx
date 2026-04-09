import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import { AppPressable } from '@/shared/presentation/components/ui/app-pressable';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost';

interface AppButtonProps {
  /** Texto del botón */
  title: string;
  /** Callback al presionar */
  onPress: () => void;
  /** Variante visual. Default: 'primary' */
  variant?: ButtonVariant;
  /** Mostrar spinner en vez de texto */
  loading?: boolean;
  /** Desactivar interacción */
  disabled?: boolean;
  /** Estilos adicionales del contenedor */
  style?: ViewStyle;
}

export const AppButton = React.memo(function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: AppButtonProps) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  const variantStyles = getVariantStyles(variant, colors);

  return (
    <AppPressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        variantStyles.container,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.textColor} />
      ) : (
        <Text style={[styles.text, { color: variantStyles.textColor }]}>
          {title}
        </Text>
      )}
    </AppPressable>
  );
});

function getVariantStyles(
  variant: ButtonVariant,
  colors: ReturnType<typeof useThemeColors>,
) {
  switch (variant) {
    case 'primary':
      return {
        container: { backgroundColor: colors.primary } as ViewStyle,
        textColor: colors.textInverse,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: colors.backgroundTertiary,
          borderWidth: 1,
          borderColor: colors.border,
        } as ViewStyle,
        textColor: colors.textOnSurface,
      };
    case 'danger':
      return {
        container: { backgroundColor: colors.dangerLight } as ViewStyle,
        textColor: colors.danger,
      };
    case 'ghost':
      return {
        container: { backgroundColor: 'transparent' } as ViewStyle,
        textColor: colors.primary,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.7,
  },
});
