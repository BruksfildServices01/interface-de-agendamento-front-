import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export type ErrorDecision =
  | { action: 'ignore' }
  | { action: 'message'; message: string }
  | { action: 'navigate'; to: string; message?: string };

@Injectable({
  providedIn: 'root',
})
export class ErrorRuleService {
  constructor(private router: Router) {}

  handle(err: unknown): ErrorDecision {
    if (!(err instanceof HttpErrorResponse)) {
      return {
        action: 'message',
        message: 'Erro inesperado.',
      };
    }

    switch (err.status) {
      case 401:
        // 401 já é tratado no interceptor
        return { action: 'ignore' };

      case 403:
      case 404:
        return {
          action: 'message',
          message: 'Você não tem acesso a este recurso.',
        };

      case 0:
        return {
          action: 'message',
          message: 'Falha de comunicação com o servidor.',
        };

      default:
        return {
          action: 'message',
          message: 'Erro ao carregar os dados.',
        };
    }
  }
}
