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

import { useRegister, type RegisterFormValues } from '../hooks/use-register';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onResetRef: (reset: () => void) => void;
}

export const RegisterForm = React.memo(function RegisterForm({
  onSwitchToLogin,
  onResetRef,
}: RegisterFormProps) {
  const colors = useThemeColors();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { isLoading, error, successMessage, submitRegister, clearError } =
    useRegister();

  const handleFormSubmit = handleSubmit(async (values) => {
    await submitRegister(values);
  });

  // Exponer reset al padre
  React.useEffect(() => {
    onResetRef(() => {
      reset();
      clearError();
    });
  }, [clearError, onResetRef, reset]);

  const handleSocialLogin = useCallback((provider: string) => {
    console.log(`[Auth] Registro con ${provider}`);
  }, []);

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textOnSurface }]}>
          Crear Cuenta
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Completa tus datos para registrarte
        </Text>
      </View>

      <ErrorBanner message={error} />

      {successMessage && (
        <View
          style={[
            styles.successBanner,
            { backgroundColor: colors.primary + '15' },
          ]}
        >
          <Text style={[styles.successText, { color: colors.primary }]}>
            {successMessage}
          </Text>
        </View>
      )}

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.nameRow}>
          <View style={styles.nameField}>
            <Controller
              control={control}
              name='firstName'
              rules={{ required: 'El nombre es requerido' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldWrapper}>
                  <AppTextInput
                    label='Nombre'
                    placeholder='Juan'
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      clearError();
                      onChange(text);
                    }}
                    autoCapitalize='words'
                    editable={!isLoading}
                    hasError={!!errors.firstName}
                  />
                  {errors.firstName && (
                    <Text style={[styles.fieldError, { color: colors.danger }]}>
                      {errors.firstName.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
          <View style={styles.nameField}>
            <Controller
              control={control}
              name='lastName'
              rules={{ required: 'El apellido es requerido' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldWrapper}>
                  <AppTextInput
                    label='Apellido'
                    placeholder='Pérez'
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      clearError();
                      onChange(text);
                    }}
                    autoCapitalize='words'
                    editable={!isLoading}
                    hasError={!!errors.lastName}
                  />
                  {errors.lastName && (
                    <Text style={[styles.fieldError, { color: colors.danger }]}>
                      {errors.lastName.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        </View>

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
          rules={{
            required: 'La contraseña es requerida',
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldWrapper}>
              <AppTextInput
                label='Contraseña'
                placeholder='Mínimo 6 caracteres'
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
          title='Crear Cuenta'
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

      {/* Switch to Login */}
      <View style={styles.switchRow}>
        <Text style={[styles.switchText, { color: colors.textSecondary }]}>
          ¿Ya tienes cuenta?
        </Text>
        <AppPressable onPress={onSwitchToLogin}>
          <Text style={[styles.switchLink, { color: colors.primary }]}>
            Inicia Sesión
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
    gap: 14,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  locationRetry: {
    fontSize: 13,
    fontWeight: '700',
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
  successBanner: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  successText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
