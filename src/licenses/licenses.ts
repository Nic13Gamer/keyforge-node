import { Keyforge } from '../keyforge';
import { getLicenseStatus } from '../utils';
import {
  ActivateLicenseDevice,
  CreateLicense,
  License,
  LicenseStatus,
  UpdateLicense,
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

  async validate(key: string): Promise<{
    isValid: boolean;
    status: LicenseStatus;
    license: License;
  } | null> {
    const license = await this.get(key);

    if (!license) {
      return null;
    }

    const status = getLicenseStatus(license);

    return {
      isValid: status === 'active',
      status,
      license,
    };
  }
}
