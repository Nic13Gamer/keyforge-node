export const KEYFORGE_ERROR_CODES_BY_KEY = {
  400: 'invalid_parameters',
  429: 'rate_limit_exceeded',
  401: 'missing_api_key',
  403: 'invalid_api_key',
  404: 'not_found',
  405: 'method_not_allowed',
  500: 'internal_server_error',
} as const;

export type KEYFORGE_ERROR_CODE_KEY = keyof typeof KEYFORGE_ERROR_CODES_BY_KEY;

export type GetOptions = {
  query?: { [key: string]: any };
};

export type PostOptions = {
  query?: { [key: string]: any };
};

export type PatchOptions = {
  query?: { [key: string]: any };
};

export type PutOptions = {
  query?: { [key: string]: any };
};
