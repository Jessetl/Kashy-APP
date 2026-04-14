import { ApiHttpError } from '@/shared/infrastructure/api';
import { useAuthStore } from '@/shared/infrastructure/auth/auth.store';
import {
  DEFAULT_COUNTRY_CODE,
  type CountryCode,
} from '@/shared/infrastructure/country/country.constants';
import { useCountryStore } from '@/shared/infrastructure/country/country.store';
import { useLocationStore } from '@/shared/infrastructure/location/location.store';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';

import { GoogleAuthUseCase } from '../../application/google-auth.use-case';
import { AuthDatasource } from '../../infrastructure/auth.datasource';

WebBrowser.maybeCompleteAuthSession();

// IDs de cliente de Google — configura los tuyos en las variables de entorno
// EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID, EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
const GOOGLE_CONFIG = {
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

const googleAuthUseCase = new GoogleAuthUseCase(new AuthDatasource());

function getGoogleAuthErrorMessage(err: unknown): string {
  if (err instanceof ApiHttpError) {
    return err.message;
  }
  return err instanceof Error
    ? err.message
    : 'Error al autenticarse con Google';
}

interface UseGoogleAuthOptions {
  country?: CountryCode;
  onSuccess?: () => void;
}

interface UseGoogleAuthReturn {
  promptAsync: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useGoogleAuth({
  country,
  onSuccess,
}: UseGoogleAuthOptions = {}): UseGoogleAuthReturn {
  const coords = useLocationStore((s) => s.coords);
  const storedCountry = useCountryStore((s) => s.countryCode);
  const setCountry = useCountryStore((s) => s.setCountry);
  const setSession = useAuthStore((s) => s.setSession);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [, response, promptAsyncInternal] =
    Google.useAuthRequest(GOOGLE_CONFIG);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    if (response?.type !== 'success') {
      return;
    }

    const { authentication } = response;
    if (!authentication) return;

    const resolvedCountry = country ?? storedCountry ?? DEFAULT_COUNTRY_CODE;

    setIsLoading(true);
    setError(null);

    googleAuthUseCase
      .execute({
        idToken: authentication.idToken ?? null,
        accessToken: authentication.accessToken ?? null,
        country: resolvedCountry,
        locationLatitude: coords?.latitude ?? 0,
        locationLongitude: coords?.longitude ?? 0,
      })
      .then((session) => {
        setCountry(resolvedCountry);
        setSession(session);
        onSuccess?.();
      })
      .catch((err: unknown) => {
        setError(getGoogleAuthErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const promptAsync = useCallback(() => {
    setError(null);
    void promptAsyncInternal();
  }, [promptAsyncInternal]);

  return { promptAsync, isLoading, error, clearError };
}
