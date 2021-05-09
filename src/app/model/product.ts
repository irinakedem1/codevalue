export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  creationDate: number;
  image: string;
}

export type Products = Product[];
