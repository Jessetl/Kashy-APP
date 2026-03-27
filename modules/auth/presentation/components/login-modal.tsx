import {
  AppButton,
  AppTextInput,
  BottomSheetModal,
  DividerWithText,
  ErrorBanner,
  SocialButton,
} from '@/shared/presentation/components/ui';
import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useLogin } from '../hooks/use-login';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LoginModal = React.memo(function LoginModal({
  visible,
  onClose,
}: LoginModalProps) {
  const colors = useThemeColors();

  const {
    email,
    password,
    isLoading,
    error,
    setEmail,
    setPassword,
    handleLogin,
    clearError,
    resetForm,
  } = useLogin(onClose);

  const handleChangeEmail = useCallback(
    (text: string) => {
      clearError();
      setEmail(text);
    },
    [clearError, setEmail],
  );

  const handleChangePassword = useCallback(
    (text: string) => {
      clearError();
      setPassword(text);
    },
    [clearError, setPassword],
  );

  const handleSocialLogin = useCallback((provider: string) => {
    console.log(`[Auth] Inicio de sesión con ${provider}`);
  }, []);

  return (
    <BottomSheetModal visible={visible} onClose={onClose} onDismiss={resetForm}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textOnSurface }]}>
          Iniciar Sesión
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Ingresa tus credenciales para continuar
        </Text>
      </View>

      <ErrorBanner message={error} />

      {/* Form */}
      <View style={styles.form}>
        <AppTextInput
          label='Email'
          placeholder='tu@email.com'
          value={email}
          onChangeText={handleChangeEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          editable={!isLoading}
          hasError={!!error}
        />

        <AppTextInput
          label='Contraseña'
          placeholder='••••••••'
          value={password}
          onChangeText={handleChangePassword}
          secureTextEntry
          editable={!isLoading}
          hasError={!!error}
        />

        <AppButton
          title='Iniciar Sesión'
          onPress={handleLogin}
          loading={isLoading}
          style={styles.loginButton}
        />
      </View>

      <DividerWithText text='o continúa con' />

      {/* Social Login */}
      <View style={styles.socialRow}>
        <SocialButton provider='Google' icon='G' onPress={handleSocialLogin} />
        <SocialButton
          provider='Facebook'
          icon='f'
          iconColor='#1877F2'
          onPress={handleSocialLogin}
        />
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  loginButton: {
    marginTop: 4,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
