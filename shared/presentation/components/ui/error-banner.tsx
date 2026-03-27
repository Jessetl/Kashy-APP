import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ErrorBannerProps {
  /** Mensaje de error. Si es null/undefined, no se renderiza nada */
  message: string | null | undefined;
}

export const ErrorBanner = React.memo(function ErrorBanner({
  message,
}: ErrorBannerProps) {
  const colors = useThemeColors();

  if (!message) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.dangerLight }]}
    >
      <Text style={[styles.text, { color: colors.danger }]}>{message}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
