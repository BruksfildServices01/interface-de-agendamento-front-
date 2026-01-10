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
