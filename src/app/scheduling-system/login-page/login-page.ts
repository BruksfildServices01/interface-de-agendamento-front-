import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../service/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'],
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  // =========================
  // FORM STATE
  // =========================
  email = signal('');
  password = signal('');

  // =========================
  // UI STATE (delegado)
  // =========================
  loading = this.auth.loading;
  errorMessage = this.auth.error;

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
    this.auth.login(this.email(), this.password());
  }

  // =========================
  // REGISTER
  // =========================
  goToRegister(): void {
    this.router.navigateByUrl('/auth/register');
  }
}
