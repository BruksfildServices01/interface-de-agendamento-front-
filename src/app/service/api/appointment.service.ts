// appointment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Appointment,
  CreateAppointmentDTO,
} from '../../model/appointment.model';

import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly apiUrl = `${environment.apiUrl}/me/appointments`;

  constructor(private http: HttpClient) {}

  create(dto: CreateAppointmentDTO): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, dto);
  }

  listByDate(date: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}?date=${date}`);
  }

  listByMonth(year: number, month: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(
      `${this.apiUrl}/month?year=${year}&month=${month}`
    );
  }

  cancel(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${this.apiUrl}/${id}/cancel`,
      {}
    );
  }

  complete(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${this.apiUrl}/${id}/complete`,
      {}
    );
  }
}

