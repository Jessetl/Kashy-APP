import { AppPressable } from '@/shared/presentation/components/ui/app-pressable';
import { ThemeToggle } from '@/shared/presentation/components/theme-toggle';
import { useAuth } from '@/shared/presentation/hooks/auth/use-auth';
import { useAppTheme } from '@/shared/presentation/hooks/use-app-theme';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  Info,
  LogOut,
  UserCog,
} from 'lucide-react-native';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof useAppTheme>['colors'];
}

const MenuItem = React.memo(function MenuItem({
  icon,
  label,
  onPress,
  colors,
}: MenuItemProps) {
  return (
    <AppPressable
      onPress={onPress}
      style={[
        styles.menuItem,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <View style={[styles.menuIconWrap, { backgroundColor: colors.primaryLight }]}>
        {icon}
      </View>
      <Text style={[styles.menuLabel, { color: colors.textOnSurface }]}>
        {label}
      </Text>
      <ChevronRight size={18} color={colors.textTertiary} />
    </AppPressable>
  );
});

export default function ProfileScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated, user, logout, openLoginModal } = useAuth();

  const displayName =
    (isAuthenticated && `${user?.firstName} ${user?.lastName}`.trim()) ||
    'Invitado';

  const initial = displayName.charAt(0).toUpperCase();

  const handleAccount = useCallback(() => {
    if (!isAuthenticated) {
      openLoginModal(() => router.push('/(tabs)/profile/account'));
      return;
    }
    router.push('/(tabs)/profile/account');
  }, [isAuthenticated, openLoginModal, router]);

  const handleNotifications = useCallback(() => {
    if (!isAuthenticated) {
      openLoginModal(() => router.push('/(tabs)/profile/notifications'));
      return;
    }
    router.push('/(tabs)/profile/notifications');
  }, [isAuthenticated, openLoginModal, router]);

  const handleAbout = useCallback(() => {
    router.push('/(tabs)/profile/about');
  }, [router]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 80 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>Perfil</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isAuthenticated ? 'Tu cuenta' : 'Configura tu cuenta'}
          </Text>
        </View>
        <ThemeToggle />
      </View>

      {/* Profile card */}
      <View
        style={[
          styles.profileCard,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <View
          style={[styles.avatar, { backgroundColor: colors.primaryLight }]}
        >
          <Text style={[styles.avatarText, { color: colors.primary }]}>
            {initial}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text
            style={[styles.nameLabel, { color: colors.textOnSurface }]}
            numberOfLines={1}
          >
            {isAuthenticated ? displayName : 'Modo Invitado'}
          </Text>
          {isAuthenticated && user?.email ? (
            <Text
              style={[styles.emailLabel, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {user.email}
            </Text>
          ) : (
            <Text style={[styles.emailLabel, { color: colors.textTertiary }]}>
              Inicia sesion para sincronizar
            </Text>
          )}
        </View>
        {!isAuthenticated && (
          <AppPressable
            onPress={() => openLoginModal()}
            style={[styles.loginChip, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.loginChipText, { color: colors.textInverse }]}>
              Entrar
            </Text>
          </AppPressable>
        )}
      </View>

      {/* Menu section */}
      <View style={styles.menuSection}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
          AJUSTES
        </Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon={<UserCog size={18} color={colors.primary} />}
            label='Cuenta'
            onPress={handleAccount}
            colors={colors}
          />
          <MenuItem
            icon={<Bell size={18} color={colors.primary} />}
            label='Notificaciones'
            onPress={handleNotifications}
            colors={colors}
          />
          <MenuItem
            icon={<Info size={18} color={colors.primary} />}
            label='Acerca de'
            onPress={handleAbout}
            colors={colors}
          />
        </View>
      </View>

      {/* Logout */}
      {isAuthenticated && (
        <AppPressable
          onPress={logout}
          style={[
            styles.logoutButton,
            { backgroundColor: colors.dangerLight },
          ]}
        >
          <LogOut size={18} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>
            Cerrar Sesion
          </Text>
        </AppPressable>
      )}

      {/* Version tag */}
      <Text style={[styles.versionText, { color: colors.textTertiary }]}>
        Kashy v1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    gap: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  nameLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  emailLabel: {
    fontSize: 13,
    fontWeight: '400',
  },
  loginChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  loginChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  menuSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  menuGroup: {
    gap: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 12,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
});
