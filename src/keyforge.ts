import { version } from '../package.json';
import { KeyforgeError } from './error';
import { Licenses } from './licenses/licenses';
import { Products } from './products/products';
import {
  GetOptions,
  KEYFORGE_ERROR_CODES_BY_KEY,
  PatchOptions,
  PostOptions,
  PutOptions,
} from './types';

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

  readonly validateLicense = this.licenses.validate;

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

  async fetchRequest<T>(path: string, options = {}): Promise<T | null> {
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

        const message = body.message || body.error.issues || body.error.message;

        error = {
          message,
          status: response.status,
          name: KEYFORGE_ERROR_CODES_BY_KEY[
            response.status as keyof typeof KEYFORGE_ERROR_CODES_BY_KEY
          ],
        };

        throw error;
      } catch (err) {
        throw error;
      }
    }

    const payload = await response.json();
    return payload.data || null;
  }

  async post<T>(path: string, payload?: unknown, options: PostOptions = {}) {
    const requestOptions = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
      ...options,
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }

  async get<T>(path: string, options: GetOptions = {}) {
    const requestOptions = {
      method: 'GET',
      headers: this.headers,
      ...options,
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }

  async put<T>(path: string, payload: any, options: PutOptions = {}) {
    const requestOptions = {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(payload),
      ...options,
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }

  async patch<T>(path: string, payload: any, options: PatchOptions = {}) {
    const requestOptions = {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(payload),
      ...options,
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }

  async delete<T>(path: string, query?: unknown) {
    const requestOptions = {
      method: 'DELETE',
      headers: this.headers,
      body: JSON.stringify(query),
    };

    return await this.fetchRequest<T>(path, requestOptions);
  }
}
