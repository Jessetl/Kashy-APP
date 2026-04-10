import { useAppTheme } from '@/shared/presentation/hooks/use-app-theme';
import { FileText } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyDebtsProps {
  isCollection: boolean;
}

export const EmptyDebts = React.memo(function EmptyDebts({
  isCollection,
}: EmptyDebtsProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.backgroundTertiary },
        ]}
      >
        <FileText size={32} color={colors.textSecondary} pointerEvents="none" />
      </View>
      <Text style={[styles.title, { color: colors.textOnSurface }]}>
        {isCollection
          ? 'No tienes cobros pendientes'
          : 'No tienes deudas pendientes'}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {isCollection
          ? 'Registra cobros para llevar un control de lo que te deben'
          : 'Registra tus deudas para no olvidar a quién le debes'}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
