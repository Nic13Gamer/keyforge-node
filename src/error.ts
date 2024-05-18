import { type KEYFORGE_ERROR_CODES_BY_KEY } from './types';

export class KeyforgeError extends Error {
  constructor(
    readonly message: string,
    readonly name: (typeof KEYFORGE_ERROR_CODES_BY_KEY)[keyof typeof KEYFORGE_ERROR_CODES_BY_KEY],
    readonly status: number
  ) {
    super(message);
    this.name = name;
    this.status = status;
  }
}
