import { Keyforge } from '../keyforge';
import { CreateLicense, License, UpdateLicense } from './types';

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
}
