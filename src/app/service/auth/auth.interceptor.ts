import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { TokenStorage } from './token.storage';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private tokens = inject(TokenStorage);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.tokens.get();

    if (!token) {
      return next.handle(req);
    }

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(authReq);
  }
}
