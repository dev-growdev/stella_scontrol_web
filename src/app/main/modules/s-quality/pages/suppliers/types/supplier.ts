export interface ISupplier {
  id: string;
  name: string;
  email: string;
  continent: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  phone?: string;
  contactName?: string;
  enable: boolean;
}

export interface ISupplierCreate extends Omit<ISupplier, 'id'> {}
