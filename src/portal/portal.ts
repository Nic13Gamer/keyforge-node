import { Keyforge } from '../keyforge';
import { Product } from '../products/types';
import { UpdatePortalProductParams } from './types';

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
}
