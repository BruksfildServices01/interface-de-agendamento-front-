// model/agendadoment-Model/barber-product.model.ts

export interface BarberProduct {
  id: number;
  barbershopId: number;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  category: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO EXCLUSIVO PARA CRIAÇÃO
 * (espelha exatamente o JSON que o backend espera)
 */
export type CreateBarberProductDTO = {
  name: string;
  description?: string;
  duration_min: number;
  price: number;
  category?: string;
};



