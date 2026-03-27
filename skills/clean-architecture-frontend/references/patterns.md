# Patrones de Arquitectura — Referencia

Patrones compartidos, integración con Expo Router, flujo de datos end-to-end y manejo de estado. Lee esta referencia cuando necesites entender cómo se conectan las piezas entre sí.

**Premisa**: todo el código de features vive en `modules/`. El directorio `app/` solo contiene rutas y layouts de Expo Router.

## Tabla de Contenidos

1. [Shared — Infraestructura Compartida](#shared--infraestructura-compartida)
2. [Integración con Expo Router](#integración-con-expo-router)
3. [Flujo Completo de un Request](#flujo-completo-de-un-request)
4. [Patrones de Manejo de Estado](#patrones-de-manejo-de-estado)

---

## Shared — Infraestructura Compartida

### API Client

```typescript
// shared/infrastructure/api/api-client.ts

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
  skipAuth?: boolean;
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  // Auto-attach token desde auth store
  // Auto-refresh en 401 con mutex
  // Ver implementación real en shared/infrastructure/api/api-client.ts
}
```

### Result Type

Para operaciones que pueden fallar de forma controlada, usa `Result<T, E>` en lugar de throw/catch descontrolado:

```typescript
// shared/domain/types/result.type.ts

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export const Result = {
  ok: <T>(data: T): Result<T, never> => ({ success: true, data }),
  fail: <E>(error: E): Result<never, E> => ({ success: false, error }),
} as const;
```

---

## Integración con Expo Router

Expo Router escanea el directorio `app/` y trata **cada archivo con default export como una ruta**. Esto significa que componentes, hooks, y lógica de negocio NUNCA deben vivir en `app/`.

### Patrón: thin wrapper (re-export)

Las screens viven en `modules/` pero Expo Router requiere archivos en `app/`. La solución es que los archivos de `app/` sean **re-exports de 1 línea**:

```typescript
// app/(tabs)/index.tsx
export { default } from '@/modules/home/presentation/screens/home.screen';
```

```typescript
// app/(tabs)/supermarket.tsx
export { default } from '@/modules/supermarket/presentation/screens/supermarket.screen';
```

```typescript
// app/(tabs)/debts.tsx
export { default } from '@/modules/debts/presentation/screens/debts.screen';
```

```typescript
// app/(tabs)/profile.tsx
export { default } from '@/modules/profile/presentation/screens/profile.screen';
```

### Patrón: layouts con providers

Los layouts (`_layout.tsx`) son la excepción: pueden tener más de 1 línea porque configuran navegación y providers. Pero deben importar componentes desde `shared/`, no definirlos inline:

```typescript
// app/_layout.tsx
import { AppThemeProvider } from '@/shared/infrastructure/theme';
import { LoginModal } from '@/shared/presentation/components/auth/login-modal';
import { useSessionRestore } from '@/shared/presentation/hooks/auth/use-session-restore';

export default function RootLayout() {
  useSessionRestore();
  return (
    <AppThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' />
      </Stack>
      <LoginModal />
    </AppThemeProvider>
  );
}
```

```typescript
// app/(tabs)/_layout.tsx
import { CustomTabBar } from '@/shared/presentation/components/custom-tab-bar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen name='index' options={{ title: 'Home' }} />
      <Tabs.Screen name='supermarket' options={{ title: 'Supermercado' }} />
      {/* ... */}
    </Tabs>
  );
}
```

### Regla: máxima lógica en app/

- **Re-exports** (`app/(tabs)/index.tsx`): 1 línea, solo re-export
- **Layouts** (`app/_layout.tsx`): imports de `shared/` + configuración de navegación
- **NUNCA**: definir componentes, hooks, stores, use cases, entities, o cualquier lógica dentro de `app/`

---

## Flujo Completo de un Request

Para entender cómo se conectan todas las capas, este es el viaje de un login desde que el usuario toca el botón hasta que ve el resultado:

```
┌─────────────┐    ┌──────────────┐    ┌───────────────┐    ┌──────────────┐
│   UI Touch   │───▶│  useLogin()  │───▶│ LoginUseCase  │───▶│  AuthRepo    │
│  (Button)    │    │  (Hook)      │    │  .execute()   │    │  .login()    │
└─────────────┘    └──────────────┘    └───────────────┘    └──────┬───────┘
                                                                    │
                          ┌──────────────┐    ┌──────────────────┐  │
                          │  AuthLocal   │◀───│   AuthRepoImpl   │◀─┘
                          │  .saveTokens │    │   (coordina)     │
                          └──────────────┘    └────────┬─────────┘
                                                       │
                                              ┌────────▼─────────┐
                                              │   AuthAPI         │
                                              │   .login()        │
                                              │   (fetch POST)    │
                                              └──────────────────┘
```

1. **UI** → El usuario toca "Iniciar sesión"
2. **Hook** → `useLogin().mutate(credentials)` dispara el TanStack Mutation
3. **Use Case** → `LoginUseCase.execute()` valida input con Zod, llama al repositorio
4. **Repository** → `AuthRepositoryImpl.login()` coordina entre API y Local datasources
5. **API Datasource** → `AuthApiDatasource.login()` hace el POST con fetch
6. **Local Datasource** → `AuthLocalDatasource.saveTokens()` persiste los tokens en MMKV
7. **Mapper** → `UserMapper.fromLoginResponse()` transforma el DTO en Entity
8. **Hook** → TanStack Query actualiza el estado → React re-renderiza la UI

### Ubicación de cada pieza

| Pieza | Ubicación |
|-------|-----------|
| Button (UI) | `modules/auth/presentation/components/login-form.tsx` |
| Hook | `shared/presentation/hooks/auth/use-login.ts` (global) o `modules/auth/presentation/hooks/use-login.ts` |
| Use Case | `modules/auth/application/login.use-case.ts` |
| Repository | `modules/auth/infrastructure/auth.datasource.ts` |
| API Client | `shared/infrastructure/api/api-client.ts` |
| Storage | `shared/infrastructure/storage/app-storage.ts` |
| Screen (thin wrapper) | `app/(tabs)/index.tsx` → re-export |

---

## Patrones de Manejo de Estado

### Estado del Servidor — TanStack Query

Para datos que vienen del servidor (listas, perfiles, configuraciones), usa TanStack Query. El caché, refetch, y sincronización los maneja la librería.

```typescript
// modules/supermarket/presentation/hooks/use-products.ts

import { useQuery } from '@tanstack/react-query';
import { GetProductsUseCase } from '../../application/get-products.use-case';

// ... composición de dependencias

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProductsUseCase.execute(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
```

### Estado del Cliente — Zustand

Para estado que NO viene del servidor (UI state, preferencias, sesión), usa Zustand con slices por módulo.

```typescript
// shared/infrastructure/auth/auth.store.ts (global, usado por 2+ módulos)

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvZustandStorage } from '@/shared/infrastructure/storage/app-storage';

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: (session) => set({ /* ... */ }),
      clearSession: () => set({ /* ... */ }),
    }),
    {
      name: 'auth-session',
      storage: createJSONStorage(() => mmkvZustandStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
```

### Cuándo Usar Cada Herramienta

| Dato                         | Herramienta     | Por qué                                    |
| ---------------------------- | --------------- | ------------------------------------------ |
| Lista de productos del server | TanStack Query  | Es estado del servidor, necesita caché     |
| Usuario autenticado          | Zustand + MMKV  | Se necesita globalmente y persiste          |
| Modal abierto/cerrado        | Zustand o local | Es estado de UI, no viene del servidor     |
| Formulario en progreso       | React Hook Form | Es estado de formulario, local al form     |
| Token de autenticación       | MMKV (via Zustand persist) | Persiste entre sesiones, síncrono |

### Dónde vive el store

| Tipo de store | Ubicación | Ejemplo |
|---------------|-----------|---------|
| Store global (2+ módulos) | `shared/infrastructure/[nombre]/[nombre].store.ts` | `shared/infrastructure/auth/auth.store.ts` |
| Store de feature (1 módulo) | `modules/[feature]/presentation/store/[nombre].store.ts` | `modules/supermarket/presentation/store/cart.store.ts` |
| Store de tema | `shared/infrastructure/theme/theme.store.ts` | Dark mode, colores |

**NUNCA** dentro de `app/` — los stores siempre viven en `modules/` o `shared/`.
