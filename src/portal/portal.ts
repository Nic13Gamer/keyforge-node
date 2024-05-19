import { Keyforge } from '../keyforge';
import { Product } from '../products/types';
import { UpdatePortalProduct } from './types';

export class Portal {
  constructor(private readonly keyforge: Keyforge) {}

  async updateProduct(
    id: string,
    params: UpdatePortalProduct
  ): Promise<Product> {
    const data = await this.keyforge.products.update(id, {
      portalShow: params.show,
      portalAllowDeviceReset: params.allowDeviceReset,
    });
    return data;
  }
}
