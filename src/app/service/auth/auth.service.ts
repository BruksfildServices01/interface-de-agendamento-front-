import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { AuthApi } from './auth.api';
import { TokenStorage } from './token.storage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(AuthApi);
  private tokenStorage = inject(TokenStorage);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  // Computed para verificar se o usuário está autenticado
  isAuthenticated = computed(() => this.tokenStorage.hasToken());

  // Método para extrair o token da resposta do backend
  private extractToken(res: any): string {
    // Ajuste aqui conforme a estrutura do seu backend (assumindo que a resposta agora tem 'token' ou algo similar)
    const token = res?.token ?? res?.accessToken ?? res?.jwt;
    if (!token) throw new Error('Token não retornado pelo backend');
    return token as string;
  }

  // Finaliza o fluxo de autenticação, salvando o token e redirecionando o usuário
  private finishAuthFlow(token: string): void {
    this.tokenStorage.set(token);  // Salva o token
    this.router.navigateByUrl('/dashboard');  // Redireciona para o dashboard após o login
  }

  // Login com email e senha
  login(email: string, password: string): Observable<void> {
    this.loading.set(true);  // Marca que está carregando
    this.error.set(null);  // Limpa erro anterior

    const e = (email ?? '').trim();
    const p = (password ?? '').trim();

    return this.api.login(e, p).pipe(
      map((res: any) => this.extractToken(res)),  // Extrai o token da resposta
      tap((token) => this.finishAuthFlow(token)),  // Salva o token e redireciona
      map(() => void 0),  // Apenas finaliza o fluxo com 'void'
      finalize(() => this.loading.set(false))  // Desativa o estado de loading após a requisição
    );
  }

  // Logout - Limpa o token e redireciona para a página de login
  logout(): void {
    this.tokenStorage.clear();  // Limpa o token
    this.router.navigateByUrl('/login');  // Redireciona para a página de login
  }
}
