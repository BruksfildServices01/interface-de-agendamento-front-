import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthApi } from '../../../service/auth/auth.api';
import { TokenStorage } from '../../../service/auth/token.storage';

@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.scss'],
})
export class RegisterPage {
  private authApi = inject(AuthApi);
  private tokenStorage = inject(TokenStorage);
  private router = inject(Router);

  // =========================
  // FORM STATE
  // =========================
  barbershopName = signal('');
  barbershopSlug = signal('');

  name = signal('');
  email = signal('');
  password = signal('');

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // =========================
  // HELPERS
  // =========================

  /**
   * Gera slug automaticamente
   * "Barbearia do Lucas" -> "barbearia-do-lucas"
   */
  private generateSlug(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  onBarbershopNameChange(value: string): void {
    this.barbershopName.set(value);
    this.barbershopSlug.set(this.generateSlug(value));
  }

  // =========================
  // VALIDATION
  // =========================
  canSubmit = computed(() => {
    return (
      !this.loading() &&
      this.barbershopName().trim().length >= 3 &&
      this.name().trim().length >= 2 &&
      this.email().trim().length >= 5 &&
      this.password().trim().length >= 6
    );
  });

  // =========================
  // REGISTER
  // =========================
  submit(): void {
  if (!this.canSubmit()) return;

  // 🔥 LIMPA QUALQUER TOKEN ANTIGO
  this.tokenStorage.clear();

  this.loading.set(true);
  this.errorMessage.set(null);

  this.authApi
    .register({
      barbershop_name: this.barbershopName().trim(),
      barbershop_slug: this.barbershopSlug(),
      name: this.name().trim(),
      email: this.email().trim(),
      password: this.password().trim(),
    })
    .subscribe({
      next: (res) => {
        this.tokenStorage.set(res.token);
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      error: (err: any) => {
        const msg =
          err?.error?.message ||
          err?.message ||
          'Não foi possível criar sua conta.';
        this.errorMessage.set(msg);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
}


  // =========================
  // NAVIGATION
  // =========================
  goToLogin(): void {
    this.router.navigateByUrl('/auth/login');
  }
}
