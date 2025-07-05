import type {
  ValidateAndRefreshTokenParams,
  ValidateAndRefreshTokenReturn,
} from './types';
import {
  fetchToken,
  unsecureDecodeToken,
  verifyToken,
  verifyTokenSignature,
} from './utils';

export { fetchToken, unsecureDecodeToken, verifyToken, verifyTokenSignature };

/**
 * Verifies if a token is valid and refreshes it if necessary. Recommended to use on startup.
 *
 * It can be slow if the token needs to be refreshed.
 *
 * For periodic token checks, use `verifyToken` directly.
 */
export async function validateAndRefreshToken({
  token,
  publicKeyJwk,
  productId,
  deviceIdentifier,
  refreshBefore = 259200000,
  shouldRefresh = true,
}: ValidateAndRefreshTokenParams): Promise<ValidateAndRefreshTokenReturn> {
  const verifyResult = await verifyToken({
    token,
    publicKeyJwk,
    productId,
    deviceIdentifier,
  });

  // The token is invalid
  if (!verifyResult.isValid) {
    let licenseKey: string | null = null;
    try {
      licenseKey = unsecureDecodeToken(token).license.key || null;
    } catch {
      licenseKey = null;
    }

    const isSignatureValid = await verifyTokenSignature({
      token,
      publicKeyJwk,
    });

    // Try to refresh token
    if (
      shouldRefresh &&
      verifyResult.error.code === 'invalid_token' &&
      isSignatureValid &&
      licenseKey
    ) {
      const fetchResult = await fetchToken({
        licenseKey,
        productId,
        deviceIdentifier,
      });

      if (!fetchResult.isValid) {
        return {
          isValid: false,
          didRefresh: false,
          data: null,
          token: null,
          error: fetchResult.error,
        };
      }

      const newVerifyResult = await verifyToken({
        token: fetchResult.token,
        publicKeyJwk,
        productId,
        deviceIdentifier,
      });

      if (!newVerifyResult.isValid) {
        return {
          isValid: false,
          didRefresh: true,
          data: null,
          token: null,
          error: newVerifyResult.error,
        };
      }

      return {
        isValid: true,
        didRefresh: true,
        data: newVerifyResult.data,
        token: fetchResult.token,
        error: null,
      };
    }

    return {
      isValid: false,
      didRefresh: false,
      data: null,
      token: null,
      error: verifyResult.error,
    };
  }

  // The token is valid, check if it needs to be refreshed
  if (
    shouldRefresh &&
    verifyResult.data.claims.exp &&
    verifyResult.data.claims.exp * 1000 - Date.now() < refreshBefore
  ) {
    const fetchResult = await fetchToken({
      licenseKey: unsecureDecodeToken(token).license.key,
      productId,
      deviceIdentifier,
    });

    if (fetchResult.isValid) {
      const newVerifyResult = await verifyToken({
        token: fetchResult.token,
        publicKeyJwk,
        productId,
        deviceIdentifier,
      });

      if (newVerifyResult.isValid) {
        return {
          isValid: true,
          didRefresh: true,
          data: newVerifyResult.data,
          token: fetchResult.token,
          error: null,
        };
      }
    }

    return {
      isValid: true,
      didRefresh: false,
      data: verifyResult.data,
      token,
      error: null,
    };
  }

  // The token is valid and does not need to be refreshed
  return {
    isValid: true,
    didRefresh: false,
    data: verifyResult.data,
    token,
    error: null,
  };
}
