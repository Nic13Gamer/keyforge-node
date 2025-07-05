import { safeFetch } from '@/utils/fetch';
import {
  compactVerify,
  decodeJwt,
  jwtVerify,
  type JWK,
  type JWTPayload,
} from 'jose';
import {
  VERIFY_TOKEN_ERROR_MESSAGES,
  type FetchTokenErrorCode,
  type FetchTokenParams,
  type RawTokenPayload,
  type TokenPayload,
  type VerifyTokenErrorCode,
  type VerifyTokenParams,
} from './types';

/**
 * Verifies if a token is valid and returns its data.
 *
 * Does not need an internet connection.
 */
export async function verifyToken({
  token,
  publicKeyJwk,
  deviceIdentifier,
  productId,
}: VerifyTokenParams): Promise<
  | { isValid: true; data: TokenPayload & { claims: JWTPayload }; error: null }
  | {
      isValid: false;
      data: null;
      error: { code: VerifyTokenErrorCode; message: string };
    }
> {
  let rawPayload: RawTokenPayload & JWTPayload;

  try {
    const jwk =
      typeof publicKeyJwk === 'string'
        ? JSON.parse(publicKeyJwk)
        : publicKeyJwk;

    rawPayload = (await jwtVerify<RawTokenPayload & JWTPayload>(token, jwk))
      .payload;
  } catch (error) {
    return {
      isValid: false,
      data: null,
      error: {
        code: 'invalid_token',
        message: VERIFY_TOKEN_ERROR_MESSAGES.invalid_token,
      },
    };
  }

  if (productId) {
    const ids = Array.isArray(productId) ? productId : [productId];

    if (!ids.includes(rawPayload.license.productId)) {
      return {
        isValid: false,
        data: null,
        error: {
          code: 'product_mismatch',
          message: VERIFY_TOKEN_ERROR_MESSAGES.product_mismatch,
        },
      };
    }
  }

  if (deviceIdentifier && rawPayload.device.identifier !== deviceIdentifier) {
    return {
      isValid: false,
      data: null,
      error: {
        code: 'device_mismatch',
        message: VERIFY_TOKEN_ERROR_MESSAGES.device_mismatch,
      },
    };
  }

  if (
    rawPayload.license.expiresAt &&
    rawPayload.license.expiresAt < Math.floor(new Date().getTime() / 1000)
  ) {
    return {
      isValid: false,
      data: null,
      error: {
        code: 'expired_license',
        message: VERIFY_TOKEN_ERROR_MESSAGES.expired_license,
      },
    };
  }

  return {
    isValid: true,
    data: {
      ...convertRawTokenPayload(rawPayload),
      claims: Object.fromEntries(
        Object.entries(rawPayload).filter(
          ([key]) => !['license', 'device'].includes(key)
        )
      ),
    },
    error: null,
  };
}

/**
 * Fetches a license token from the API.
 *
 * It does not verify if the token is valid for a given product or device.
 */
export async function fetchToken(params: FetchTokenParams): Promise<
  | { isValid: true; token: string; error: null }
  | {
      isValid: false;
      token: null;
      error: { code: FetchTokenErrorCode; message: string };
    }
> {
  const { data, error } = await safeFetch<{ isValid: true; token: string }>(
    '/v1/public/licenses/token',
    { method: 'POST', body: JSON.stringify(params) }
  );

  if (error) {
    return {
      isValid: false,
      token: null,
      error: {
        code: error.code as FetchTokenErrorCode,
        message: error.message,
      },
    };
  }

  return {
    isValid: true,
    token: data.token,
    error: null,
  };
}

/**
 * Decodes the data of a token without verifying its signature.
 *
 * **Warning:** Do not use this function to verify the validity of a token. Use `verifyToken` instead.
 */
export const unsecureDecodeToken = (token: string) =>
  decodeJwt(token) as RawTokenPayload;

export const convertRawTokenPayload = (
  rawPayload: RawTokenPayload
): TokenPayload => ({
  license: {
    ...rawPayload.license,
    expiresAt:
      rawPayload.license.expiresAt !== null
        ? new Date(rawPayload.license.expiresAt * 1000)
        : null,
  },
  device: {
    ...rawPayload.device,
    activationDate: new Date(rawPayload.device.activationDate * 1000),
  },
});

/**
 * Verifies if the signature of a token is valid.
 *
 * **Warning:** Do not use this function to verify the validity of a token. Use `verifyToken` instead.
 */
export async function verifyTokenSignature({
  token,
  publicKeyJwk,
}: {
  token: string;
  publicKeyJwk: string | JWK;
}) {
  try {
    const jwk =
      typeof publicKeyJwk === 'string'
        ? JSON.parse(publicKeyJwk)
        : publicKeyJwk;

    await compactVerify(token, jwk);

    return true;
  } catch {
    return false;
  }
}
