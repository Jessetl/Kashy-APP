import { apiClient } from '@/shared/infrastructure/api/api-client';
import type { CountryCode } from '@/shared/infrastructure/country/country.constants';
import type { ExchangeRate } from '../domain/exchange-rate.entity';

export async function fetchCurrentRate(
  countryCode: CountryCode = 'VE',
): Promise<ExchangeRate> {
  const response = await apiClient<ExchangeRate>('/exchange-rates/current', {
    skipAuth: true,
    headers: { 'X-Currency': countryCode },
  });
  console.log('Exchange rate response:', response.data);
  return response.data;
}
