import { useAuthStore } from '@/shared/infrastructure/auth/auth.store';
import { AppThemeProvider } from '@/shared/infrastructure/theme';
import { LoginModal } from '@/modules/auth/presentation/components/login-modal';
import { useSessionRestore } from '@/modules/auth/presentation/hooks/use-session-restore';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

function LoginModalGlobal() {
  const isVisible = useAuthStore((s) => s.isLoginModalVisible);
  const close = useAuthStore((s) => s.closeLoginModal);

  return <LoginModal visible={isVisible} onClose={close} />;
}

function AppContent() {
  // Restaurar sesión silenciosamente al abrir la app
  useSessionRestore();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' />
      </Stack>
      <LoginModalGlobal />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AppThemeProvider>
        <AppContent />
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
