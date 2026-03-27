import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DividerWithTextProps {
  text: string;
}

export const DividerWithText = React.memo(function DividerWithText({
  text,
}: DividerWithTextProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {text}
      </Text>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
});
