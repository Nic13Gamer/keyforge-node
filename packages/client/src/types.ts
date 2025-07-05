export type License = {
  key: string;
  productId: string;
  type: 'perpetual' | 'timed';
  revoked: boolean;
  maxDevices: number;
  /**
   * Null for `perpetual` licenses.
   */
  expiresAt: Date | null;
  createdAt: Date;
};

export type ActiveDevice = {
  identifier: string;
  name: string;
  activationDate: Date;
};

export type RawPublicApiLicense = Omit<License, 'expiresAt' | 'createdAt'> & {
  /**
   * Date string serialized in JSON.
   */
  expiresAt: string | null;
  /**
   * Date string serialized in JSON.
   */
  createdAt: string;
};

export type RawPublicApiActiveDevice = Omit<ActiveDevice, 'activationDate'> & {
  /**
   * Date string serialized in JSON.
   */
  activationDate: string;
};

export type ValidateLicenseParams = {
  licenseKey: string;
  productId: string | string[];
  deviceIdentifier: string;
};

export type ValidateLicenseReturn =
  | {
      isValid: true;
      license: License;
      device: ActiveDevice;
      error: null;
    }
  | {
      isValid: false;
      license: null;
      device: null;
      error: null | {
        code: 'network_error' | 'unknown_error';
        message: string;
      };
    };

export type ActivateLicenseParams = {
  licenseKey: string;
  productId: string | string[];
  deviceIdentifier: string;
  deviceName: string;
};

export type ActivateLicenseErrorCode =
  | 'network_error'
  | 'unknown_error'
  | 'invalid_license'
  | 'license_revoked'
  | 'license_expired'
  | 'device_already_activated'
  | 'max_devices_reached';

export type ActivateLicenseReturn =
  | {
      isValid: true;
      /**
       * If license tokens are configured for the product, this will contain the token.
       */
      token: string | null;
      device: ActiveDevice;
      license: License;
      error: null;
    }
  | {
      isValid: false;
      token: null;
      device: null;
      license: null;
      error: {
        code: ActivateLicenseErrorCode;
        message: string;
      };
    };
