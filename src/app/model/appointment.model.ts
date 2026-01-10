// ======================================================
// STATUS
// ======================================================

export type AppointmentStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled';

// ======================================================
// ENTITY — resposta real do backend
// ======================================================

export interface Appointment {
  id: number;

  // Relações por ID (SEMPRE confiáveis)
  barbershop_id: number;
  barber_id: number;
  client_id: number;
  barber_product_id: number;

  // Relações opcionais (podem vir vazias)
  client?: AppointmentClient | null;
  barber_product?: AppointmentProduct | null;

  // Datas (ISO string)
  start_time: string;
  end_time: string;

  status: AppointmentStatus;
  notes?: string | null;

  cancelled_at?: string | null;
  completed_at?: string | null;

  created_at: string;
  updated_at: string;
}

// ======================================================
// SUB-ENTITIES (opcionais)
// ======================================================

export interface AppointmentClient {
  id: number;
  name: string;
  phone: string;
  email?: string;
}

export interface AppointmentProduct {
  id: number;
  name: string;
  duration_min: number;
  price: number;
}

// ======================================================
// DTO — criação
// ======================================================

export interface CreateAppointmentDTO {
  client_name: string;
  client_phone: string;
  client_email?: string;

  product_id: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm

  notes?: string;
}
