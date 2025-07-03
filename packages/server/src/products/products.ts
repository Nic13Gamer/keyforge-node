import { Keyforge } from '../keyforge';
import { CreateProductParams, Product, UpdateProductParams } from './types';

export class Products {
  constructor(private readonly keyforge: Keyforge) {}

  /**
   * Get all products.
   *
   * @returns The list of products.
   */
  async list(): Promise<Product[]> {
    const data = await this.keyforge.get<Product[]>('/v1/products');
    return data;
  }

  /**
   * Get a product.
   *
   * @param id The product ID.
   * @returns The product.
   */
  async get(id: string): Promise<Product> {
    const data = await this.keyforge.get<Product>(`/v1/products/${id}`);
    return data;
  }

  /**
   * Create a new product.
   *
   * @param params The product parameters.
   * @returns The created product.
   */
  async create(params: CreateProductParams): Promise<Product> {
    const data = await this.keyforge.post<Product>('/v1/products', params);
    return data;
  }

  /**
   * Update a product.
   *
   * @param id The product ID.
   * @param params The product parameters to update.
   * @returns The updated product.
   */
  async update(id: string, params: UpdateProductParams): Promise<Product> {
    const data = await this.keyforge.patch<Product>(
      `/v1/products/${id}`,
      params
    );
    return data;
  }

  /**
   * Delete a product.
   *
   * @param id The product ID.
   */
  async delete(id: string): Promise<void> {
    await this.keyforge.delete(`/v1/products/${id}`);
    return;
  }
}
