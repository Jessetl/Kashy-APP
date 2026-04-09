import {
  AppButton,
  AppTextInput,
  DividerWithText,
  ErrorBanner,
  SocialButton,
} from '@/shared/presentation/components/ui';
import { AppPressable } from '@/shared/presentation/components/ui/app-pressable';
import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { useLogin } from '../hooks/use-login';

interface LoginFormValues {
  email: string;
  password: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
  onResetRef: (reset: () => void) => void;
}

export const LoginForm = React.memo(function LoginForm({
  onSuccess,
  onSwitchToRegister,
  onResetRef,
}: LoginFormProps) {
  const colors = useThemeColors();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { isLoading, error, submitLogin, clearError } = useLogin(onSuccess);

  const handleFormSubmit = handleSubmit(async (values) => {
    await submitLogin(values);
  });

  // Exponer reset al padre
  React.useEffect(() => {
    onResetRef(() => {
      reset();
      clearError();
    });
  }, [clearError, onResetRef, reset]);

  const handleSocialLogin = useCallback((provider: string) => {
    console.log(`[Auth] Inicio de sesión con ${provider}`);
  }, []);

  return (
    <>
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
        <Controller
          control={control}
          name='email'
          rules={{
            required: 'El email es requerido',
            pattern: {
              value: EMAIL_REGEX,
              message: 'El formato del email no es válido',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldWrapper}>
              <AppTextInput
                label='Email'
                placeholder='tu@email.com'
                value={value}
                onBlur={onBlur}
                onChangeText={(text) => {
                  clearError();
                  onChange(text);
                }}
                keyboardType='email-address'
                autoCapitalize='none'
                editable={!isLoading}
                hasError={!!errors.email}
              />
              {errors.email && (
                <Text style={[styles.fieldError, { color: colors.danger }]}>
                  {errors.email.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name='password'
          rules={{ required: 'La contraseña es requerida' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldWrapper}>
              <AppTextInput
                label='Contraseña'
                placeholder='••••••••'
                value={value}
                onBlur={onBlur}
                onChangeText={(text) => {
                  clearError();
                  onChange(text);
                }}
                secureTextEntry
                editable={!isLoading}
                hasError={!!errors.password}
              />
              {errors.password && (
                <Text style={[styles.fieldError, { color: colors.danger }]}>
                  {errors.password.message}
                </Text>
              )}
            </View>
          )}
        />

        <AppButton
          title='Iniciar Sesión'
          onPress={() => {
            void handleFormSubmit();
          }}
          loading={isLoading}
          style={styles.submitButton}
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

      {/* Switch to Register */}
      <View style={styles.switchRow}>
        <Text style={[styles.switchText, { color: colors.textSecondary }]}>
          ¿No tienes cuenta?
        </Text>
        <AppPressable onPress={onSwitchToRegister}>
          <Text style={[styles.switchLink, { color: colors.primary }]}>
            Regístrate
          </Text>
        </AppPressable>
      </View>
    </>
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
  fieldWrapper: {
    gap: 4,
  },
  fieldError: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  submitButton: {
    marginTop: 4,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  switchText: {
    fontSize: 14,
    fontWeight: '400',
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
