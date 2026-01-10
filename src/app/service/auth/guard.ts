import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorage } from './token.storage';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private tokens = inject(TokenStorage);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.tokens.hasToken()) {
      return true;
    }

    // 🔥 IMPORTANTE
    this.router.navigateByUrl('/login', { replaceUrl: true });
    return false;
  }
}

