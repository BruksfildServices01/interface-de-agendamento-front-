// client.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  PublicService,
  AvailabilityResponse,
  PublicCreateAppointmentRequest,
} from '../../model/client.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==================================================
  // ✂️ LISTAR SERVIÇOS (PUBLIC)
  // ==================================================
  getServices(
    slug: string,
    params?: {
      category?: string;
      query?: string;
    }
  ): Observable<{ barbershop: any; products: PublicService[] }> {
    let httpParams = new HttpParams();

    if (params?.category) {
      httpParams = httpParams.set('category', params.category);
    }

    if (params?.query) {
      httpParams = httpParams.set('query', params.query);
    }

    return this.http
      .get<any>(`${this.baseUrl}/public/${slug}/products`, {
        params: httpParams,
      })
      .pipe(
        map((res) => ({
          barbershop: res.barbershop,
          products: (res.products || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            durationMin: p.duration_min, // 🔥 FIX PRINCIPAL
            price: p.price,
            category: p.category,
          })),
        }))
      );
  }

  // ==================================================
  // ⏰ DISPONIBILIDADE
  // ==================================================
  getAvailability(
    slug: string,
    date: string,
    productId: number
  ): Observable<AvailabilityResponse> {
    return this.http.get<AvailabilityResponse>(
      `${this.baseUrl}/public/${slug}/availability`,
      {
        params: {
          date,
          product_id: productId,
        },
      }
    );
  }

  // ==================================================
// 📆 CRIAR AGENDAMENTO (PUBLIC)
// ==================================================
createAppointment(
  slug: string,
  payload: PublicCreateAppointmentRequest
): Observable<any> {

  const body: any = {
    client_name: payload.clientName.trim(),
    client_phone: payload.clientPhone.trim(),
    product_id: payload.productId,
    date: payload.date,
    time: payload.time,
  };

  // ✅ só envia se existir
  if (payload.clientEmail?.trim()) {
    body.client_email = payload.clientEmail.trim();
  }

  if (payload.notes?.trim()) {
    body.notes = payload.notes.trim();
  }

  return this.http.post(
    `${this.baseUrl}/public/${slug}/appointments`,
    body
  );
}


}
