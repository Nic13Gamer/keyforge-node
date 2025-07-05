import type {
  ActiveDevice,
  License,
  RawPublicApiActiveDevice,
  RawPublicApiLicense,
} from '@/types';

export function convertRawPublicApiLicense(
  rawLicense: RawPublicApiLicense
): License {
  return {
    ...rawLicense,
    expiresAt:
      rawLicense.expiresAt !== null ? new Date(rawLicense.expiresAt) : null,
    createdAt: new Date(rawLicense.createdAt),
  };
}

export function convertRawPublicApiActiveDevice(
  rawDevice: RawPublicApiActiveDevice
): ActiveDevice {
  return {
    ...rawDevice,
    activationDate: new Date(rawDevice.activationDate),
  };
}
