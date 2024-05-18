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

  async get(key: string): Promise<License | null> {
    const data = await this.keyforge.get<License>(`/v1/licenses/${key}`);
    return data;
  }

  async create(params: CreateLicense): Promise<License | null> {
    const data = await this.keyforge.post<License>('/v1/licenses', params);
    return data;
  }

  async update(key: string, params: UpdateLicense): Promise<License | null> {
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

  async resetDevices(key: string): Promise<License | null> {
    const data = await this.keyforge.post<License>(
      `/v1/licenses/${key}/reset-devices`
    );
    return data;
  }

  async activate(
    key: string,
    device: ActivateLicenseDevice
  ): Promise<License | null> {
    const data = await this.keyforge.post<License>(
      `/v1/licenses/${key}/activate`,
      device
    );
    return data;
  }

  async validate(
    key: string,
    params?: ValidateLicenseParams
  ): Promise<{
    isValid: boolean;
    status: LicenseStatus;
    device: ActiveDevice | null;
    license: License;
  } | null> {
    const license = await this.get(key);

    if (!license) {
      return null;
    }

    const status = getLicenseStatus(license);
    const isValid = status === 'active';

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
