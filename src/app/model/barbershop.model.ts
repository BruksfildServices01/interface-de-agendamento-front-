export interface Barbershop {
  id: number;
  name: string;
  slug: string;

  phone?: string;
  address?: string;

  min_advance_minutes?: number;
  timezone?: string;

  created_at: string;
  updated_at: string;
}

export interface MeBarbershopResponse {
  barbershop: {
    id: number;
    name: string;
    phone?: string;
    address?: string;
    timezone?: string;
    slug: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
  };
}

