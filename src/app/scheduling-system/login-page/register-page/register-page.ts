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
  // STATE
  // =========================
  barbershopName = signal('');
  barbershopSlug = signal(''); // 🔒 invisível para o usuário

  name = signal('');
  email = signal('');
  password = signal('');

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // =========================
  // HELPERS
  // =========================
  private slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  onBarbershopNameChange(value: string) {
    this.barbershopName.set(value);
    this.barbershopSlug.set(this.slugify(value));
  }

  // =========================
  // VALIDATION
  // =========================
  canSubmit = computed(() =>
    !this.loading() &&
    this.barbershopName().trim().length >= 3 &&
    this.barbershopSlug().trim().length >= 3 &&
    this.name().trim().length >= 2 &&
    this.email().trim().length >= 5 &&
    this.password().trim().length >= 6
  );

  // =========================
  // SUBMIT
  // =========================
  submit() {
    if (!this.canSubmit()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const payload = {
      barbershop_name: this.barbershopName().trim(),
      barbershop_slug: this.barbershopSlug(),
      name: this.name().trim(),
      email: this.email().trim(),
      password: this.password().trim(),
    };

    this.authApi.register(payload).subscribe({
      next: (res) => {
        this.tokenStorage.set(res.token);
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      error: (err) => {
        const msg =
          err?.error?.message ||
          err?.error?.error ||
          'Erro ao criar conta.';
        this.errorMessage.set(msg);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/auth/login');
  }
}
