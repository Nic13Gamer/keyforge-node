export type LicenseStatus = 'active' | 'expired' | 'revoked';

export type ActiveDevice = {
  identifier: string;
  name: string;
  activationDate: string;
};

export type License = {
  userId: string;
  productId: string;
  key: string;
  type: 'perpetual' | 'timed';
  expiresAt: string | null;
  revoked: boolean;
  maxDevices: number;
  activeDevices: ActiveDevice[];
  email: string | null;
  createdAt: string;
};

export type CreateLicense = {
  productId: string;
  type: 'perpetual' | 'timed';
  maxDevices: number;
  email?: string;
  expiresAt?: Date;
};

export type UpdateLicense = {
  type?: 'perpetual' | 'timed';
  maxDevices?: number;
  email?: string;
  expiresAt?: Date;
  revoked?: boolean;
};

export type ActivateLicenseDevice = {
  identifier: string;
  name: string;
};
