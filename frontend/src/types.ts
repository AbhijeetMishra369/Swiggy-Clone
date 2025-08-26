export type Address = { line1?: string; city?: string; state?: string; country?: string; postalCode?: string };
export type Restaurant = {
  id: number;
  name: string;
  cuisine: string;
  phone?: string;
  averageRating?: number;
  address?: Address;
};

export type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  available?: boolean;
};