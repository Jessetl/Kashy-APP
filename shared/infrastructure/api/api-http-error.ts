export class ApiHttpError extends Error {
  readonly status: number;
  readonly statusCode?: number;
  readonly code?: string;
  readonly timestamp?: string;

  constructor(params: {
    message: string;
    status: number;
    statusCode?: number;
    code?: string;
    timestamp?: string;
  }) {
    super(params.message);
    this.name = 'ApiHttpError';
    this.status = params.status;
    this.statusCode = params.statusCode;
    this.code = params.code;
    this.timestamp = params.timestamp;
  }
}
