import type { License, LicenseStatus } from './licenses/types';

export function getLicenseStatus(license: License): LicenseStatus {
  if (license.revoked) {
    return 'revoked';
  }

  if (
    license.type === 'timed' &&
    license.expiresAt &&
    new Date(license.expiresAt) < new Date()
  ) {
    return 'expired';
  }

  return 'active';
}
