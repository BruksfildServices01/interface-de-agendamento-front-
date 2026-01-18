// client.model.ts

// ==========================
// 👤 CLIENTE
// ==========================
export interface Client {
  id: number;
  barbershopId: number;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================
// ✂️ SERVIÇOS (PRODUTOS)
// ==========================
export interface PublicService {
  id: number;
  name: string;
  description?: string;
  durationMin: number;
  price: number;
  category?: string;
}

// ==========================
// ⏰ HORÁRIOS DISPONÍVEIS
// ==========================
export interface TimeSlot {
  start: string; // "14:00"
  end: string;   // "14:30"
}

// ==========================
// 📆 DISPONIBILIDADE
// ==========================
export interface AvailabilityResponse {
  date: string;
  slots: TimeSlot[];
}

// ==========================
// 📝 CRIAÇÃO DE AGENDAMENTO (PUBLIC)
// ==========================
export interface PublicCreateAppointmentRequest {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  productId: number;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  notes?: string;
}


