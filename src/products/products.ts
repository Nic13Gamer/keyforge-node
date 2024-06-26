import { Keyforge } from '../keyforge';
import { CreateProductParams, Product, UpdateProductParams } from './types';

export class Products {
  constructor(private readonly keyforge: Keyforge) {}

  async list(): Promise<Product[]> {
    const data = await this.keyforge.get<Product[]>('/v1/products');
    return data;
  }

  async get(id: string): Promise<Product> {
    const data = await this.keyforge.get<Product>(`/v1/products/${id}`);
    return data;
  }

  async create(params: CreateProductParams): Promise<Product> {
    const data = await this.keyforge.post<Product>('/v1/products', params);
    return data;
  }

  async update(id: string, params: UpdateProductParams): Promise<Product> {
    const data = await this.keyforge.patch<Product>(
      `/v1/products/${id}`,
      params
    );
    return data;
  }

  async delete(id: string): Promise<void> {
    await this.keyforge.delete(`/v1/products/${id}`);
    return;
  }
}
