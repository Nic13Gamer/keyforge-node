export type Product = {
  id: string;
  userId: string;
  name: string;
  description: string;
  supportEmail: string;
  createdAt: string;
  portalShow: boolean;
  portalAllowDeviceReset: boolean;
};

export type CreateProduct = {
  name: string;
  description?: string;
  supportEmail?: string;
};

export type UpdateProduct = {
  name?: string;
  description?: string;
  supportEmail?: string;
  portalShow?: boolean;
  portalAllowDeviceReset?: boolean;
};
