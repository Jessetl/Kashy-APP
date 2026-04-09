import { AppPressable } from '@/shared/presentation/components/ui/app-pressable';
import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

interface SocialButtonProps {
  /** Nombre del provider (Google, Facebook, Apple) */
  provider: string;
  /** Icono o letra a mostrar */
  icon: string;
  /** Color del icono. Si no se pasa, usa textOnSurface */
  iconColor?: string;
  /** Callback al presionar */
  onPress: (provider: string) => void;
}

export const SocialButton = React.memo(function SocialButton({
  provider,
  icon,
  iconColor,
  onPress,
}: SocialButtonProps) {
  const colors = useThemeColors();

  const handlePress = useCallback(() => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(provider);
  }, [provider, onPress]);

  return (
    <AppPressable
      onPress={handlePress}
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundTertiary,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.icon, { color: iconColor ?? colors.textOnSurface }]}>
        {icon}
      </Text>
      <Text style={[styles.label, { color: colors.textOnSurface }]}>
        {provider}
      </Text>
    </AppPressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
  },
  icon: {
    fontSize: 18,
    fontWeight: '800',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
