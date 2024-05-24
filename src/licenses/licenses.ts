import { Keyforge } from '../keyforge';
import { getLicenseStatus } from '../utils';
import {
  ActivateLicenseDevice,
  ActiveDevice,
  CreateLicense,
  License,
  LicenseStatus,
  UpdateLicense,
  ValidateLicenseParams,
} from './types';

export class Licenses {
  constructor(private readonly keyforge: Keyforge) {}

  async get(key: string): Promise<License> {
    const data = await this.keyforge.get<License>(`/v1/licenses/${key}`);
    return data;
  }

  async create(params: CreateLicense): Promise<License> {
    const data = await this.keyforge.post<License>('/v1/licenses', params);
    return data;
  }

  async update(key: string, params: UpdateLicense): Promise<License> {
    const data = await this.keyforge.patch<License>(
      `/v1/licenses/${key}`,
      params
    );
    return data;
  }

  async delete(key: string): Promise<void> {
    await this.keyforge.delete(`/v1/licenses/${key}`);
    return;
  }

  async resetDevices(key: string): Promise<License> {
    const data = await this.keyforge.post<License>(
      `/v1/licenses/${key}/reset-devices`
    );
    return data;
  }

  async activate(key: string, device: ActivateLicenseDevice): Promise<License> {
    const data = await this.keyforge.post<License>(
      `/v1/licenses/${key}/activate`,
      device
    );
    return data;
  }

  async revoke(key: string): Promise<License> {
    const data = await this.update(key, { revoked: true });
    return data;
  }

  async unrevoke(key: string): Promise<License> {
    const data = await this.update(key, { revoked: false });
    return data;
  }

  /**
   * Check if a license is valid. You can also check if a license is valid for a specific device or product.
   *
   * @param key The license key.
   * @param params If you want to check if the license is valid for a specific device, pass the `deviceIdentifier` here. If you want to check if the license is valid for a specific product, pass the `productId` here.
   */
  async validate(
    key: string,
    params?: ValidateLicenseParams
  ): Promise<{
    isValid: boolean;
    status: LicenseStatus;
    device: ActiveDevice | null;
    license: License;
  }> {
    const license = await this.get(key);

    const status = getLicenseStatus(license);
    const isValid = status === 'active';

    if (params?.productId && license.productId !== params.productId) {
      return {
        isValid: false,
        status,
        device: null,
        license,
      };
    }

    if (status === 'active' && params?.deviceIdentifier) {
      const device = license.activeDevices.find(
        (device) => device.identifier === params.deviceIdentifier
      );

      if (!device) {
        return {
          isValid: false,
          status,
          device: null,
          license,
        };
      }

      return {
        isValid: true,
        status,
        device,
        license,
      };
    }

    return {
      isValid,
      status,
      device: null,
      license,
    };
  }
}
