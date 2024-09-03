import { Keyforge } from '../keyforge';
import { Product } from '../products/types';
import { CreatePrivateSessionParams, UpdatePortalProductParams } from './types';

export class Portal {
  constructor(private readonly keyforge: Keyforge) {}

  /**
   * Update the portal settings for a product.
   *
   * It is recommended to use `keyforge.products.update()` instead.
   *
   * @param id The product ID.
   * @param params The portal settings to update.
   * @returns The updated product.
   */
  async updateProduct(
    id: string,
    params: UpdatePortalProductParams
  ): Promise<Product> {
    const data = await this.keyforge.products.update(id, {
      portalShow: params.show,
      portalAllowDeviceReset: params.allowDeviceReset,
    });
    return data;
  }

  /**
   * Create a private portal session.
   *
   * In private portal sessions, customers can only manage licenses for your products. Private session URLs expire after 12 hours.
   *
   * @param params Email to create a private session for.
   * @returns The session URL.
   */
  async createPrivateSession(
    params: CreatePrivateSessionParams
  ): Promise<{ url: string }> {
    const data = await this.keyforge.post<{ url: string }>(
      '/v1/portal/sessions/private',
      params
    );

    return data;
  }
}
