import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.prod';
import { Barbershop, MeBarbershopResponse } from '../../model/barbershop.model';

@Injectable({
  providedIn: 'root',
})
export class BarbershopService {
  private apiUrl = `${environment.apiUrl}/me/barbershop`;

  constructor(private http: HttpClient) {}

  // =========================
  // BARBEARIA LOGADA
  // =========================
  getMe(): Observable<Barbershop> {
    return this.http.get<Barbershop>(this.apiUrl);
  }

  // ==================================
  // 👤 PERFIL COMPLETO (barbearia + user)
  // ==================================
  getProfile(): Observable<MeBarbershopResponse> {
    return this.http.get<MeBarbershopResponse>(this.apiUrl);
  }

  // (futuro)
  update(payload: Partial<Barbershop>): Observable<Barbershop> {
    return this.http.patch<Barbershop>(this.apiUrl, payload);
  }
}
