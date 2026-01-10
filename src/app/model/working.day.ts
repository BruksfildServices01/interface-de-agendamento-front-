export interface WorkingDay {
  weekday: number;
  label?: string;        // ✅ AGORA É OPCIONAL
  active: boolean;
  start_time: string;
  end_time: string;
  lunch_start?: string;
  lunch_end?: string;
}
