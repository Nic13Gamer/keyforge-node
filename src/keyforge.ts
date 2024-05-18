import { version } from '../package.json';
import {
  ErrorResponse,
  GetOptions,
  PatchOptions,
  PostOptions,
  PutOptions,
} from './types';

const defaultBaseUrl = 'https://keyforge.dev/api';
const defaultUserAgent = `resend-node:${version}`;
const baseUrl =
  typeof process !== 'undefined' && process.env
    ? process.env.KEYFORGE_BASE_URL || defaultBaseUrl
    : defaultBaseUrl;
const userAgent =
  typeof process !== 'undefined' && process.env
    ? process.env.KEYFORGE_USER_AGENT || defaultUserAgent
    : defaultUserAgent;

export class Keyforge {
  private readonly headers: Headers;

  constructor(readonly apiKey?: string) {
    if (!apiKey) {
      if (typeof process !== 'undefined' && process.env) {
        this.apiKey = process.env.KEYFORGE_API_KEY;
      }

      if (!this.apiKey) {
        throw new Error(
          'Missing Keyforge API key. Pass it to the constructor `new Keyforge("sk_123")`'
        );
      }
    }

    this.headers = new Headers({
      Authorization: `Bearer ${this.apiKey}`,
      'User-Agent': userAgent,
      'Content-Type': 'application/json',
    });
  }

  async fetchRequest<T>(
    path: string,
    options = {}
  ): Promise<{
    data: T | null;
    error: ErrorResponse | null;
  }> {
    const response = await fetch(`${baseUrl}${path}`, options);

    if (!response.ok) {
      let error: ErrorResponse = {
        message: response.statusText,
        name: 'application_error',
      };

      try {
        error = await response.json();

        return { data: null, error };
      } catch (err) {
        if (err instanceof Error) {
          return { data: null, error: { ...error, message: err.message } };
        }

        return { data: null, error };
      }
    }

    const data = await response.json();
    return { data, error: null };
  }

  async post<T>(path: string, payload?: unknown, options: PostOptions = {}) {
    const requestOptions = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
      ...options,
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  async get<T>(path: string, options: GetOptions = {}) {
    const requestOptions = {
      method: 'GET',
      headers: this.headers,
      ...options,
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  async put<T>(path: string, payload: any, options: PutOptions = {}) {
    const requestOptions = {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(payload),
      ...options,
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  async patch<T>(path: string, payload: any, options: PatchOptions = {}) {
    const requestOptions = {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(payload),
      ...options,
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  async delete<T>(path: string, query?: unknown) {
    const requestOptions = {
      method: 'DELETE',
      headers: this.headers,
      body: JSON.stringify(query),
    };

    return this.fetchRequest<T>(path, requestOptions);
  }
}
