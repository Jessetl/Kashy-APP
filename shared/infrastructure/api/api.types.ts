export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
  /** Si true, no adjunta el token automáticamente (para login/refresh) */
  skipAuth?: boolean;
}

export interface ApiEnvelope<TData> {
  success: boolean;
  data: TData;
  timestamp: string;
  message?: string;
}

export interface ApiErrorDetail {
  statusCode: number;
  code: string;
  message: string;
}

export interface ApiErrorEnvelope {
  success: false;
  error: ApiErrorDetail;
  timestamp: string;
}

export interface ApiResponse<TData> extends ApiEnvelope<TData> {
  ok: boolean;
  status: number;
}
