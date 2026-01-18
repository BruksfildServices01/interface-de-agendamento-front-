import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthApi } from './auth.api';
import { TokenStorage } from './token.storage';

// =======================
// PAYLOADS
// =======================

export interface RegisterPayload {
  barbershop_name: string;
  barbershop_slug: string;
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(AuthApi);
  private tokenStorage = inject(TokenStorage);
  private router = inject(Router);

  // =======================
  // STATE
  // =======================

  private loadingSig = signal(false);
  private errorSig = signal<string | null>(null);

  loading = this.loadingSig.asReadonly();
  error = this.errorSig.asReadonly();

  isAuthenticated = computed(() => this.tokenStorage.hasToken());

  // =======================
  // LOGIN
  // =======================

  login(email: string, password: string): void {
    if (this.loadingSig()) return;

    this.tokenStorage.clear(); // 🔥 regra de ouro
    this.loadingSig.set(true);
    this.errorSig.set(null);

    this.api
      .login(email.trim(), password.trim())
      .pipe(finalize(() => this.loadingSig.set(false)))
      .subscribe({
        next: (res) => {
          this.finishAuth(res.token);
        },
        error: (err) => {
          this.errorSig.set(
            err?.error?.message ||
              err?.message ||
              'Email ou senha inválidos.'
          );
        },
      });
  }

  // =======================
  // REGISTER
  // =======================

  register(payload: RegisterPayload): void {
    if (this.loadingSig()) return;

    this.tokenStorage.clear();
    this.loadingSig.set(true);
    this.errorSig.set(null);

    this.api
      .register(payload)
      .pipe(finalize(() => this.loadingSig.set(false)))
      .subscribe({
        next: (res) => {
          this.finishAuth(res.token);
        },
        error: (err) => {
          this.errorSig.set(
            err?.error?.message ||
              err?.message ||
              'Não foi possível criar sua conta.'
          );
        },
      });
  }

  // =======================
  // LOGOUT
  // =======================

  logout(): void {
    this.tokenStorage.clear();
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }

  // =======================
  // PRIVATE HELPERS
  // =======================

  private finishAuth(token: string): void {
    this.tokenStorage.set(token);
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
