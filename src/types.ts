export const KEYFORGE_ERROR_CODES_BY_KEY = {
  invalid_parameters: 400,
  rate_limit_exceeded: 429,
  missing_api_key: 401,
  invalid_api_key: 403,
  not_found: 404,
  method_not_allowed: 405,
  application_error: 500,
  internal_server_error: 500,
} as const;

export type KEYFORGE_ERROR_CODE_KEY = keyof typeof KEYFORGE_ERROR_CODES_BY_KEY;

export type ErrorResponse = {
  message: string;
  name: KEYFORGE_ERROR_CODE_KEY;
};

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
