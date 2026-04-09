import { AppPressable } from '@/shared/presentation/components/ui/app-pressable';
import { useAuth } from '@/shared/presentation/hooks/auth/use-auth';
import { useAppTheme } from '@/shared/presentation/hooks/use-app-theme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user, logout, openLoginModal } = useAuth();

  const displayName =
    (isAuthenticated && `${user?.firstName} ${user?.lastName}`.trim()) ||
    'Invitado';

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 16, paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Perfil</Text>
      <Text style={[styles.subtitle, { color: colors.gradientEnd }]}>
        {isAuthenticated ? 'Tu cuenta' : 'Configura tu cuenta'}
      </Text>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <Text style={[styles.avatarText, { color: colors.textOnSurface }]}>
            {initial}
          </Text>
        </View>
        <Text style={[styles.nameLabel, { color: colors.text }]}>
          {isAuthenticated ? displayName : 'Modo Invitado'}
        </Text>
        {isAuthenticated && user?.email && (
          <Text style={[styles.emailLabel, { color: colors.gradientEnd }]}>
            {user.email}
          </Text>
        )}

        {!isAuthenticated && (
          <AppPressable
            onPress={() => openLoginModal()}
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          >
            <Text
              style={[styles.primaryButtonText, { color: colors.textInverse }]}
            >
              Iniciar Sesión
            </Text>
          </AppPressable>
        )}
      </View>

      {/* Settings options */}
      {['Cuenta', 'Notificaciones', 'Apariencia', 'Acerca de'].map((option) => (
        <View
          key={option}
          style={[
            styles.option,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <Text style={[styles.optionText, { color: colors.textOnSurface }]}>
            {option}
          </Text>
        </View>
      ))}

      {/* Logout */}
      {isAuthenticated && (
        <AppPressable
          onPress={logout}
          style={[styles.logoutButton, { backgroundColor: colors.dangerLight }]}
        >
          <Text style={[styles.logoutButtonText, { color: colors.danger }]}>
            Cerrar Sesión
          </Text>
        </AppPressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    marginTop: -4,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
  },
  nameLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  emailLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  primaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  option: {
    borderRadius: 12,
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
