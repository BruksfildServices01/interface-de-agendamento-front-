import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorage } from './token.storage';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  private tokens = inject(TokenStorage);
  private router = inject(Router);

  canActivate(): boolean {
    if (!this.tokens.hasToken()) {
      return true;
    }

    // 🔥 manda direto para o layout protegido
    this.router.navigateByUrl('/home', { replaceUrl: true });
    return false;
  }
}

