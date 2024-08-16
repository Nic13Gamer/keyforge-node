import { KeyforgeError } from '../error';
import { Keyforge } from '../keyforge';
import {
  ActivateLicenseParams,
  CreateLicenseParams,
  License,
  UpdateLicenseParams,
  ValidateLicenseParams,
  ValidateLicenseResult,
} from './types';

export class Licenses {
  constructor(private readonly keyforge: Keyforge) {}

  /**
   * Get a license.
   *
   * @param key The license key.
   * @returns The license.
   */
  async get(key: string): Promise<License> {
    const data = await this.keyforge.get<License>(`/v1/licenses/${key}`);
    return data;
  }

  /**
   * Create a new license.
   *
   * @param params The license parameters.
   * @returns The created license.
   */
  async create(params: CreateLicenseParams): Promise<License> {
    const data = await this.keyforge.post<License>('/v1/licenses', params);
    return data;
  }

  /**
   * Update a license.
   *
   * @param key The license key.
   * @param params The license parameters to update.
   * @returns The updated license.
   */
  async update(key: string, params: UpdateLicenseParams): Promise<License> {
    const data = await this.keyforge.patch<License>(
      `/v1/licenses/${key}`,
      params
    );
    return data;
  }

  /**
   * Delete a license.
   *
   * @param key The license key.
   */
  async delete(key: string): Promise<void> {
    await this.keyforge.delete(`/v1/licenses/${key}`);
    return;
  }

  /**
   * Reset the active devices of a license.
   *
   * @param key The license key.
   * @returns The license with the updated active devices.
   */
  async resetDevices(key: string): Promise<License> {
    const data = await this.keyforge.post<License>(
      `/v1/licenses/${key}/reset-devices`
    );
    return data;
  }

  /**
   * Activate a license on a device.
   *
   * @param key The license key.
   * @param params Product ID and device information.
   * @returns The activated license.
   */
  async activate(key: string, params: ActivateLicenseParams): Promise<License> {
    const data = await this.keyforge.post<License>(
      `/v1/licenses/${key}/activate`,
      params
    );
    return data;
  }

  /**
   * Revoke a license. This will make the license invalid.
   *
   * @param key The license key.
   * @returns The revoked license.
   */
  async revoke(key: string): Promise<License> {
    const data = await this.update(key, { revoked: true });
    return data;
  }

  /**
   * Unrevoke a license. This will make the license valid again.
   *
   * @param key The license key.
   * @returns The unrevoked license.
   */
  async unrevoke(key: string): Promise<License> {
    const data = await this.update(key, { revoked: false });
    return data;
  }

  /**
   * Check if a license is valid. You can also check if a license is valid for a specific device or product (recommended).
   *
   * @param key The license key.
   * @param params If you want to check if the license is valid for a specific device, pass the `deviceIdentifier` here. If you want to check if the license is valid for a specific product, pass the `productId` here.
   * @returns The validation result.
   *
   * @example
   *
   * ```ts
   * const { isValid } = await keyforge.licenses.validate(
   *  'ABCDE-ABCDE-ABCDE-ABCDE-ABCDE',
   *  {
   *    deviceIdentifier: 'some_device_id',
   *    productId: 'p_123456',
   *  }
   * );
   *
   * console.log(isValid); // true or false
   * ```
   */
  async validate(
    key: string,
    params?: ValidateLicenseParams
  ): Promise<ValidateLicenseResult> {
    let validation: ValidateLicenseResult;

    try {
      validation = await this.keyforge.post<ValidateLicenseResult>(
        `/v1/licenses/${key}/validate`,
        params
      );
    } catch (error) {
      if (error instanceof KeyforgeError && error.name === 'not_found') {
        return {
          isValid: false,
          status: null,
          device: null,
          license: null,
        };
      }

      throw error;
    }

    return validation;
  }
}
