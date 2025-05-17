import { version } from '../package.json';
import { KeyforgeError } from './error';
import { Licenses } from './licenses/licenses';
import { Portal } from './portal/portal';
import { Products } from './products/products';
import {
  DeleteOptions,
  GetOptions,
  KEYFORGE_ERROR_CODES_BY_KEY,
  PatchOptions,
  PostOptions,
  PutOptions,
} from './types';
import { mergeHeaders } from './utils';

const defaultBaseUrl = 'https://keyforge.dev/api';
const defaultUserAgent = `keyforge-node:${version}`;
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

  readonly products = new Products(this);
  readonly licenses = new Licenses(this);
  readonly portal = new Portal(this);

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

  async fetchRequest<T>(path: string, options = {}): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, options);

    if (!response.ok) {
      const bodyText = await response.text();

      let error: KeyforgeError = {
        message: bodyText,
        status: response.status,
        name: KEYFORGE_ERROR_CODES_BY_KEY[
          response.status as keyof typeof KEYFORGE_ERROR_CODES_BY_KEY
        ],
      };

      try {
        const body = JSON.parse(bodyText);

        const message = body.message || body.error.message;

        error = {
          message,
          status: response.status,
          name: KEYFORGE_ERROR_CODES_BY_KEY[
            response.status as keyof typeof KEYFORGE_ERROR_CODES_BY_KEY
          ],
        };

        throw new KeyforgeError(error.message, error.name, error.status);
      } catch (err) {
        throw new KeyforgeError(error.message, error.name, error.status);
      }
    }

    if (response.headers.get('content-length') === '0') {
      return {} as T;
    }

    try {
      const data = await response.json();
      return data;
    } catch (error) {
      return {} as T;
    }
  }

  async post<T>(path: string, payload?: unknown, options: PostOptions = {}) {
    const requestOptions = {
      method: 'POST',
      headers: mergeHeaders(this.headers, options.headers),
      body: JSON.stringify(payload ?? {}),
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }

  async get<T>(path: string, options: GetOptions = {}) {
    const requestOptions = {
      method: 'GET',
      headers: mergeHeaders(this.headers, options.headers),
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }

  async put<T>(path: string, payload: any, options: PutOptions = {}) {
    const requestOptions = {
      method: 'PUT',
      headers: mergeHeaders(this.headers, options.headers),
      body: JSON.stringify(payload ?? {}),
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }

  async patch<T>(path: string, payload: any, options: PatchOptions = {}) {
    const requestOptions = {
      method: 'PATCH',
      headers: mergeHeaders(this.headers, options.headers),
      body: JSON.stringify(payload ?? {}),
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }

  async delete<T>(path: string, options: DeleteOptions = {}) {
    const requestOptions = {
      method: 'DELETE',
      headers: mergeHeaders(this.headers, options.headers),
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }
}
