import type {
  ActivateLicenseErrorCode,
  ActivateLicenseParams,
  ActivateLicenseReturn,
  RawPublicApiActiveDevice,
  RawPublicApiLicense,
  ValidateLicenseParams,
  ValidateLicenseReturn,
} from './types';
import { safeFetch } from './utils/fetch';
import {
  convertRawPublicApiActiveDevice,
  convertRawPublicApiLicense,
} from './utils/license';

export async function validateLicense(
  params: ValidateLicenseParams
): Promise<ValidateLicenseReturn> {
  const { data, error } = await safeFetch<{
    isValid: boolean;
    license: RawPublicApiLicense;
    device: RawPublicApiActiveDevice;
  }>('/v1/public/licenses/validate', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  if (error || !data.isValid) {
    return {
      isValid: false,
      license: null,
      device: null,
      error: error
        ? {
            code: error.code as 'network_error' | 'unknown_error',
            message: error.message,
          }
        : null,
    };
  }

  return {
    isValid: data.isValid,
    license: convertRawPublicApiLicense(data.license),
    device: convertRawPublicApiActiveDevice(data.device),
    error: null,
  };
}

export async function activateLicense(
  params: ActivateLicenseParams
): Promise<ActivateLicenseReturn> {
  const { data, error } = await safeFetch<{
    isValid: true;
    token?: string;
    license: RawPublicApiLicense;
    device: RawPublicApiActiveDevice;
  }>('/v1/public/licenses/activate', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  if (error) {
    return {
      isValid: false,
      license: null,
      device: null,
      token: null,
      error: {
        code: error.code as ActivateLicenseErrorCode,
        message: error.message,
      },
    };
  }

  return {
    isValid: data.isValid,
    token: data.token || null,
    license: convertRawPublicApiLicense(data.license),
    device: convertRawPublicApiActiveDevice(data.device),
    error: null,
  };
}
