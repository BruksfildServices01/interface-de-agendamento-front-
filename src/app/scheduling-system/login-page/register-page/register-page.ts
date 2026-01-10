import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApi } from '../../../service/auth/auth.api';
import { TokenStorage } from '../../../service/auth/token.storage';

type AccountType = 'ORGANIZADOR' | 'VIEWER';

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

  name = signal('');
  email = signal('');
  password = signal('');
  accountType = signal<AccountType>('ORGANIZADOR');

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  canSubmit = computed(() =>
    !this.loading() &&
    this.name().trim().length >= 2 &&
    this.email().trim().length >= 5 &&
    this.password().trim().length >= 6
  );

  submit() {
    if (!this.canSubmit()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const dto = {
      name: this.name().trim(),
      email: this.email().trim(),
      password: this.password().trim(),
    };

    const req$ =
      this.accountType() === 'ORGANIZADOR'
        ? this.authApi.registerOrganizador(dto)
        : this.authApi.registerViewer(dto);

    req$.subscribe({
      next: (res) => {
        this.tokenStorage.set(res.token);
        this.router.navigateByUrl('/tournaments'); // Redireciona após o registro
      },
      error: (err) => {
        const msg =
          err?.error?.message ||
          err?.message ||
          'Não foi possível criar sua conta. Tente novamente.';
        this.errorMessage.set(msg);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
