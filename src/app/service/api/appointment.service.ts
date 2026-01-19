// appointment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  Appointment,
  CreateAppointmentDTO,
} from '../../model/appointment.model';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly apiUrl = `${environment.apiUrl}/me/appointments`;

  constructor(private http: HttpClient) {}

  // ======================================================
  // CREATE (inalterado)
  // ======================================================
  create(dto: CreateAppointmentDTO): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, dto);
  }

  // ======================================================
  // LIST BY DATE (✅ ADAPTER APLICADO)
  // ======================================================
  listByDate(date: string): Observable<Appointment[]> {
    return this.http
      .get<{ data: any[] }>(`${this.apiUrl}?date=${date}`)
      .pipe(
        map(res =>
          (res.data || []).map((raw): Appointment => ({
            id: raw.id,

            // IDs — backend não envia, mas o model exige
            barbershop_id: raw.barbershop_id ?? 0,
            barber_id: raw.barber_id ?? 0,
            client_id: raw.client_id ?? 0,
            barber_product_id: raw.product_id ?? 0,

            start_time: raw.start_time,
            end_time: raw.end_time,

            status: raw.status,
            notes: raw.notes ?? null,

            // 🔥 ADAPTER PRINCIPAL
            client: raw.client_name
              ? {
                  id: 0,
                  name: raw.client_name,
                  phone: '',
                }
              : null,

            barber_product: raw.product_name
              ? {
                  id: 0,
                  name: raw.product_name,
                  duration_min: 0,
                  price: 0,
                }
              : null,

            cancelled_at: raw.cancelled_at ?? null,
            completed_at: raw.completed_at ?? null,

            created_at: raw.created_at ?? '',
            updated_at: raw.updated_at ?? '',
          }))
        )
      );
  }

  // ======================================================
  // LIST BY MONTH (inalterado)
  // ======================================================
  listByMonth(year: number, month: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(
      `${this.apiUrl}/month?year=${year}&month=${month}`
    );
  }

  // ======================================================
  // CANCEL (inalterado)
  // ======================================================
  cancel(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${this.apiUrl}/${id}/cancel`,
      {}
    );
  }

  // ======================================================
  // COMPLETE (inalterado)
  // ======================================================
  complete(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${this.apiUrl}/${id}/complete`,
      {}
    );
  }
}
