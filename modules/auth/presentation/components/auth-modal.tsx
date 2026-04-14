import { BottomSheetModal } from '@/shared/presentation/components/ui';
import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

type AuthView = 'login' | 'register';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AuthModal = React.memo(function AuthModal({
  visible,
  onClose,
}: AuthModalProps) {
  const [activeView, setActiveView] = useState<AuthView>('login');
  const resetFormRef = useRef<(() => void) | null>(null);

  const handleResetRef = useCallback((reset: () => void) => {
    resetFormRef.current = reset;
  }, []);

  const handleDismiss = useCallback(() => {
    resetFormRef.current?.();
    setActiveView('login');
  }, []);

  const switchToRegister = useCallback(() => {
    resetFormRef.current?.();
    setActiveView('register');
  }, []);

  const switchToLogin = useCallback(() => {
    resetFormRef.current?.();
    setActiveView('login');
  }, []);

  const isRegister = activeView === 'register';

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      onDismiss={handleDismiss}
      heightRatio={isRegister ? 0.88 : 0.75}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        bounces={false}
      >
        {isRegister ? (
          <RegisterForm
            onSwitchToLogin={switchToLogin}
            onResetRef={handleResetRef}
            onSuccess={onClose}
          />
        ) : (
          <LoginForm
            onSuccess={onClose}
            onSwitchToRegister={switchToRegister}
            onResetRef={handleResetRef}
          />
        )}
      </ScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
