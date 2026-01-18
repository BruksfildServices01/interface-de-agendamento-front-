// appointment-agenda.model.ts

export type AppointmentAgendaStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled';

export interface AppointmentAgenda {
  id: number;

  start_time: string;
  end_time: string;

  status: AppointmentAgendaStatus;

  client_name: string;
  product_name: string;

  notes?: string | null;
}
