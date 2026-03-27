import type { ApiEnvelope, ApiErrorEnvelope } from '@/shared/infrastructure/api/api.types';

export type ParsedApiPayload<T> = {
  successPayload: Partial<ApiEnvelope<T>>;
  errorPayload: Partial<ApiErrorEnvelope>;
  data: T;
};

export function parseApiPayload<T>(payload: unknown): ParsedApiPayload<T> {
  const successPayload = payload as Partial<ApiEnvelope<T>>;
  const errorPayload = payload as Partial<ApiErrorEnvelope>;
  const data = (successPayload.data ?? null) as T;

  return {
    successPayload,
    errorPayload,
    data,
  };
}

export function resolveErrorMessage<T>(parsedPayload: ParsedApiPayload<T>): {
  message: string;
  code?: string;
  statusCode?: number;
  timestamp?: string;
} {
  const { errorPayload, successPayload, data } = parsedPayload;
  const apiError = errorPayload.error;

  const message =
    apiError?.message ??
    successPayload.message ??
    (data as Record<string, unknown>)?.message?.toString() ??
    'Error de servidor';

  return {
    message,
    code: apiError?.code,
    statusCode: apiError?.statusCode,
    timestamp: errorPayload.timestamp,
  };
}
