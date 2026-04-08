import { apiClient } from '@/shared/infrastructure/api/api-client';
import { secureStorage } from '@/shared/infrastructure/storage/app-storage';
import type { ExchangeRate } from '../domain/exchange-rate.entity';

const CACHE_KEY = 'exchange-rate-cache';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos

interface CachedRate {
  rate: ExchangeRate;
  cachedAt: number;
}

export async function fetchCurrentRate(): Promise<ExchangeRate> {
  // Intentar leer cache primero
  const cached = await readCache();
  if (cached) {
    return cached;
  }

  try {
    const response = await apiClient<ExchangeRate>('/exchange-rates/current', {
      skipAuth: true,
    });
    const rate = response.data;
    await writeCache(rate);
    return rate;
  } catch {
    // Si falla la API, intentar usar la cache expirada como fallback
    const fallback = await readCache(true);
    if (fallback) {
      return fallback;
    }

    throw new Error('No se pudo obtener la tasa de cambio');
  }
}

async function readCache(ignoreExpiry = false): Promise<ExchangeRate | null> {
  try {
    const raw = await secureStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CachedRate;
    const isExpired = Date.now() - parsed.cachedAt > CACHE_TTL_MS;

    if (isExpired && !ignoreExpiry) {
      return null;
    }
    return parsed.rate;
  } catch {
    return null;
  }
}

async function writeCache(rate: ExchangeRate): Promise<void> {
  const cached: CachedRate = { rate, cachedAt: Date.now() };
  await secureStorage.setItem(CACHE_KEY, JSON.stringify(cached));
}
