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

export type CreateProductParams = {
  name: string;
  description?: string;
  supportEmail?: string;
};

export type UpdateProductParams = {
  name?: string;
  description?: string;
  supportEmail?: string;
  portalShow?: boolean;
  portalAllowDeviceReset?: boolean;
};
