import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

// =======================
// DTOs
// =======================

export type RegisterRequestDTO = {
  barbershop_name: string;
  barbershop_slug: string;
  name: string;
  email: string;
  password: string;
};

export type AuthResponseDTO = {
  token: string;
};

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/auth`;

  // =======================
  // LOGIN
  // =======================
  login(email: string, password: string) {
    return this.http.post<AuthResponseDTO>(`${this.baseUrl}/login`, {
      email,
      password,
    });
  }

  // =======================
  // REGISTER (BARBEIRO / OWNER)
  // =======================
  register(dto: RegisterRequestDTO) {
    return this.http.post<AuthResponseDTO>(
      `${this.baseUrl}/register`,
      dto
    );
  }
}
