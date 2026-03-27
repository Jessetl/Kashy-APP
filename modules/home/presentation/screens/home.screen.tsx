import { NotificationButton } from '@/shared/presentation/components/notification-button';
import { ThemeToggle } from '@/shared/presentation/components/theme-toggle';
import { onThemeProfilerRender } from '@/shared/presentation/devtools/theme-profiler';
import { useAuth } from '@/shared/presentation/hooks/auth/use-auth';
import { useAppTheme } from '@/shared/presentation/hooks/use-app-theme';
import React, { Profiler } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user } = useAuth();

  const displayName = isAuthenticated
    ? (user?.displayName ?? user?.email?.split('@')[0] ?? 'Usuario')
    : 'Invitado';

  const initial = displayName.charAt(0).toUpperCase();

  const content = (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 12, paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.avatarSmall,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <Text style={[styles.avatarEmoji, { color: colors.primary }]}>
              {initial}
            </Text>
          </View>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Hola, {displayName}!
            </Text>
            <Text style={[styles.subGreeting, { color: colors.gradientEnd }]}>
              {isAuthenticated ? 'Ver perfil' : 'Modo invitado'}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <NotificationButton badgeCount={isAuthenticated ? 2 : 0} />
          <ThemeToggle />
        </View>
      </View>

      {/* Resumen title */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Resumen</Text>

      {/* Supermercado Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.primary }]}>
          SUPERMERCADO
        </Text>
        <View
          style={[
            styles.supermarketCard,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.textOnSurface }]}>
            Nueva Lista
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            0 items agregados
          </Text>
        </View>
      </View>

      {/* Deudas Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.primary }]}>
          DEUDAS & COBROS
        </Text>
        <View style={styles.debtRow}>
          <View
            style={[
              styles.debtCard,
              { backgroundColor: colors.backgroundSecondary },
            ]}
          >
            <Text style={[styles.debtLabel, { color: colors.danger }]}>
              Deudas por Pagar
            </Text>
            <Text style={[styles.debtAmount, { color: colors.textOnSurface }]}>
              $0.00
            </Text>
          </View>
          <View
            style={[
              styles.debtCard,
              { backgroundColor: colors.backgroundSecondary },
            ]}
          >
            <Text style={[styles.debtLabel, { color: colors.primary }]}>
              Cobros Pendientes
            </Text>
            <Text style={[styles.debtAmount, { color: colors.textOnSurface }]}>
              $0.00
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  if (__DEV__) {
    return (
      <Profiler id='HomeScreen' onRender={onThemeProfilerRender}>
        {content}
      </Profiler>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
    fontWeight: '700',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subGreeting: {
    fontSize: 13,
    fontWeight: '400',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  supermarketCard: {
    borderRadius: 16,
    padding: 20,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  debtRow: {
    flexDirection: 'row',
    gap: 12,
  },
  debtCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  debtLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  debtAmount: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
