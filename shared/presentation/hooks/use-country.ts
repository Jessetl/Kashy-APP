import { useCountryStore } from '@/shared/infrastructure/country/country.store';

export function useCountry() {
  const countryCode = useCountryStore((s) => s.countryCode);
  const country = useCountryStore((s) => s.country);
  const setCountry = useCountryStore((s) => s.setCountry);

  return { countryCode, country, setCountry };
}
