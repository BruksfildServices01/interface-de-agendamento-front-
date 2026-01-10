// src/app/service/auth/auth.interceptor.ts
import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { TokenStorage } from './token.storage';
import { AppErrorService } from '../servicos_navigation/app-error.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private tokens = inject(TokenStorage);
  private appError = inject(AppErrorService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // =========================
    // 1) Anexa Bearer Token
    // =========================
    const token = this.tokens.get();

    // não anexar token em rotas públicas
    const isPublic =
      req.url.includes('/api/auth') ||
      req.url.includes('/login') ||
      req.url.includes('/register');

    const authReq =
      token && !isPublic
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    // =========================
    // 2) Trata erros
    // =========================
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (!(err instanceof HttpErrorResponse)) {
          return throwError(() => err);
        }

        // --------
        // 401
        // --------
        if (err.status === 401) {
          const msg = this.extractMessage(err);

          const invalidToken =
            msg.includes('token') &&
            (msg.includes('invalid') ||
              msg.includes('expired') ||
              msg.includes('inválido') ||
              msg.includes('expirado'));

          if (invalidToken) {
            // token morreu mesmo -> login
            this.tokens.clear();
            this.router.navigateByUrl('/login');
            return throwError(() => err);
          }

          // 401 esperado (regra/fluxo/permissão) -> NÃO vai pro login
          this.router.navigateByUrl('/tournaments');

          // ⚠️ aqui depende da assinatura do seu AppErrorService
          // Vou chamar show(payload) (objeto), que é o formato mais comum.
          this.appError.show({
            title: 'Ação não autorizada',
            message: 'Não foi possível executar essa ação.',
            details: `${err.status} • ${req.method} ${req.url}`,
          });

          return throwError(() => err);
        }

        // --------
        // 403
        // --------
        if (err.status === 403) {
          this.router.navigateByUrl('/tournaments');
          this.appError.show({
            title: 'Sem permissão',
            message: 'Você não tem permissão para executar essa ação.',
            details: `${err.status} • ${req.method} ${req.url}`,
          });
          return throwError(() => err);
        }

        // --------
        // 5xx
        // --------
        if (err.status >= 500) {
          this.router.navigateByUrl('/tournaments');
          this.appError.show({
            title: 'Erro no servidor',
            message: 'O servidor falhou ao processar sua solicitação.',
            details: `${err.status} • ${req.method} ${req.url}`,
          });
          return throwError(() => err);
        }

        return throwError(() => err);
      })
    );
  }

  private extractMessage(err: HttpErrorResponse): string {
    const body: any = err.error;
    if (!body) return '';
    if (typeof body === 'string') return body.toLowerCase();
    if (body?.message) return String(body.message).toLowerCase();
    if (body?.error) return String(body.error).toLowerCase();
    return '';
  }
}
