import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// Tipos de DTOs para Login e Registro
export type RegisterRequestDTO = {
  name: string;
  email: string;
  password: string;
};

export type LoginResponseDTO = { 
  token: string; 
  // Adicionar qualquer outra informação relevante do login, por exemplo:
  // user: User;
};

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/auth`;  // Base URL para autenticação

  // Método de login com email e senha
  login(email: string, password: string) {
    return this.http.post<LoginResponseDTO>(`${this.base}/login`, {
      email,
      password,
    });
  }

  // Método para registrar um organizador
  registerOrganizador(dto: RegisterRequestDTO) {
    return this.http.post<LoginResponseDTO>(
      `${this.base}/register/organizador`,
      dto
    );
  }

  
  registerViewer(dto: RegisterRequestDTO) {
    return this.http.post<LoginResponseDTO>(
      `${this.base}/register/viewer`,
      dto
    );
  }
}
