import type { JWK } from 'jose';

export type TokenPayload = {
  license: {
    productId: string;
    /**
     * The license key.
     */
    key: string;
    type: 'perpetual' | 'timed';
    /**
     * Null for `perpetual` licenses.
     */
    expiresAt: Date | null;
    maxDevices: number;
    email: string | null;
  };
  device: {
    identifier: string;
    name: string;
    activationDate: Date;
  };
};

export type RawTokenPayload = {
  license: Omit<TokenPayload['license'], 'expiresAt'> & {
    /**
     * The timestap in **seconds** when the license expires.
     *
     * Null for `perpetual` licenses.
     */
    expiresAt: number | null;
  };
  device: Omit<TokenPayload['device'], 'activationDate'> & {
    /**
     * The timestamp in **seconds** when the device was activated.
     */
    activationDate: number;
  };
};

export const VERIFY_TOKEN_ERROR_MESSAGES = {
  invalid_token: 'The provided token is invalid.',
  expired_license: 'The license has expired.',
  device_mismatch: 'The device identifier does not match the license.',
  product_mismatch: 'The product ID does not match the license.',
} as const;
export type VerifyTokenErrorCode = keyof typeof VERIFY_TOKEN_ERROR_MESSAGES;

export type VerifyTokenParams = {
  token: string;
  publicKeyJwk: string | JWK;
  deviceIdentifier?: string;
  productId?: string | string[];
};

export type FetchTokenErrorCode =
  | 'network_error'
  | 'unknown_error'
  | 'invalid_license'
  | 'license_revoked'
  | 'license_expired';

export type FetchTokenParams = {
  licenseKey: string;
  productId: string | string[];
  deviceIdentifier: string;
};

export type ValidateAndRefreshTokenErrorCode =
  | VerifyTokenErrorCode
  | FetchTokenErrorCode;

export type ValidateAndRefreshTokenParams = {
  token: string;
  publicKeyJwk: string | JWK;
  productId: string | string[];
  deviceIdentifier: string;
  /**
   * Should refresh the token if it is expired or in the refresh window.
   *
   * Set to `false` if no internet connection is available.
   *
   * @default true
   */
  shouldRefresh?: boolean;
  /**
   * Time in milliseconds before token expiration to trigger a refresh.
   *
   * The refresh needs internet access, set `shouldRefresh` to `false` if no internet connection is available.
   *
   * @default 259200000 (3 days)
   */
  refreshBefore?: number;
};

export type ValidateAndRefreshTokenReturn =
  | {
      isValid: true;
      didRefresh: boolean;
      data: TokenPayload;
      token: string;
      error: null;
    }
  | {
      isValid: false;
      didRefresh: boolean;
      data: null;
      token: null;
      error: { code: ValidateAndRefreshTokenErrorCode; message: string };
    };
