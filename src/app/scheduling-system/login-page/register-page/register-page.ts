import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, RegisterPayload } from '../../../service/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.scss'],
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  // =========================
  // FORM STATE
  // =========================
  barbershopName = signal('');
  barbershopSlug = signal('');

  name = signal('');
  email = signal('');
  password = signal('');

  // =========================
  // UI STATE (delegado)
  // =========================
  loading = this.auth.loading;
  errorMessage = this.auth.error;

  // =========================
  // HELPERS
  // =========================

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

    const payload: RegisterPayload = {
      barbershop_name: this.barbershopName().trim(),
      barbershop_slug: this.barbershopSlug(),
      name: this.name().trim(),
      email: this.email().trim(),
      password: this.password().trim(),
    };

    this.auth.register(payload);
  }

  // =========================
  // LOGIN
  // =========================
  goToLogin(): void {
    this.router.navigateByUrl('/auth/login');
  }
}
