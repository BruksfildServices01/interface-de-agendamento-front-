import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthApi } from '../../service/auth/auth.api';
import { TokenStorage } from '../../service/auth/token.storage';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'],
})
export class LoginPage {
  private authApi = inject(AuthApi);
  private tokenStorage = inject(TokenStorage);
  private router = inject(Router);

  // =========================
  // FORM STATE
  // =========================
  email = signal('');
  password = signal('');

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // =========================
  // VALIDATION
  // =========================
  canSubmit = computed(() => {
    return (
      this.email().trim().length >= 5 &&
      this.password().trim().length > 0 &&
      !this.loading()
    );
  });

  // =========================
  // LOGIN
  // =========================
  login(): void {
    if (!this.canSubmit()) return;

    // 🔥 LIMPA QUALQUER TOKEN ANTIGO (REGRA DE OURO)
    this.tokenStorage.clear();

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authApi
      .login(this.email().trim(), this.password().trim())
      .subscribe({
        next: (res) => {
          this.tokenStorage.set(res.token);

          this.router.navigateByUrl('/home', {
            replaceUrl: true,
          });
        },
        error: (err: any) => {
          const msg =
            err?.error?.message ||
            err?.message ||
            'Email ou senha inválidos.';

          this.errorMessage.set(msg);
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }


  // =========================
  // REGISTER
  // =========================
  goToRegister(): void {
    this.router.navigateByUrl('/auth/register');
  }

}
