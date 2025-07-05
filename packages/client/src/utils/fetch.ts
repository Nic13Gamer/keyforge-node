import { baseUrl, userAgent } from '@/config';

const ERROR_CODES = {
  400: 'bad_request',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not_found',
  429: 'too_many_requests',
  500: 'internal_server_error',
} as const;

const headers = {
  'User-Agent': userAgent,
  'Content-Type': 'application/json',
};

export async function safeFetch<T>(
  path: string,
  options?: Omit<RequestInit, 'headers'>
): Promise<
  | { data: T; error: null }
  | { data: null; error: { code: string; message: string } }
> {
  try {
    const response = await fetch(`${baseUrl}${path}`, { ...options, headers });

    if (!response.ok) {
      try {
        const errorData = (await response.json()) as {
          error: { code?: string; message?: string };
        };

        return {
          data: null,
          error: {
            code:
              errorData.error.code ||
              ERROR_CODES[response.status as keyof typeof ERROR_CODES] ||
              'unknown_error',
            message: errorData.error.message || 'An error occurred',
          },
        };
      } catch (error) {
        return {
          data: null,
          error: {
            code:
              ERROR_CODES[response.status as keyof typeof ERROR_CODES] ||
              'unknown_error',
            message: 'An error occurred',
          },
        };
      }
    }

    if (response.headers.get('content-length') === '0') {
      return { data: {} as T, error: null };
    }

    return {
      data: (await response.json()) as T,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: {
        code: 'network_error',
        message: 'Failed to fetch',
      },
    };
  }
}
