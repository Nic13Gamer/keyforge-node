export type LicenseStatus = 'active' | 'expired' | 'revoked';

export type LicenseType = 'perpetual' | 'timed';

export type LicenseDevice = {
  identifier: string;
  name: string;
  activationDate: string;
};

export type License = {
  userId: string;
  productId: string;
  key: string;
  type: LicenseType;
  expiresAt: string | null;
  revoked: boolean;
  maxDevices: number;
  activeDevices: LicenseDevice[];
  email: string | null;
  createdAt: string;
};

export type CreateLicenseParams = {
  productId: string;
  type: LicenseType;
  maxDevices: number;
  email?: string;
  expiresAt?: Date;
};

export type UpdateLicenseParams = {
  type?: LicenseType;
  maxDevices?: number;
  email?: string;
  expiresAt?: Date;
  revoked?: boolean;
};

export type ActivateLicenseDevice = {
  identifier: string;
  name: string;
};

export type ValidateLicenseParams = {
  deviceIdentifier?: string;
  productId?: string;
};

type ValidateLicenseNotFoundResult = {
  isValid: false;
  status: null;
  device: null;
  license: null;
};

type ValidateLicenseSuccessResult = {
  isValid: boolean;
  status: LicenseStatus;
  device: LicenseDevice | null;
  license: License;
};

export type ValidateLicenseResult =
  | ValidateLicenseNotFoundResult
  | ValidateLicenseSuccessResult;
