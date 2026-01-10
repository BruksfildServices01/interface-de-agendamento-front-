// src/app/service/servicos_navigation/app-error.service.ts
import { Injectable, signal } from '@angular/core';

export type AppErrorPayload = {
  title: string;
  message: string;
  details?: string;
};

@Injectable({ providedIn: 'root' })
export class AppErrorService {
  private _open = signal(false);
  private _payload = signal<AppErrorPayload | null>(null);

  // ✅ usado no template do modal
  open() {
    return this._open();
  }

  // ✅ usado no template do modal
  payload() {
    return this._payload();
  }

  // ✅ chamado pelo interceptor (ou por qualquer lugar)
  show(payload: AppErrorPayload) {
    this._payload.set(payload);
    this._open.set(true);
  }

  // ✅ chamado pelo modal (Ok / X / backdrop)
  close() {
    this._open.set(false);
    // opcional: limpar payload depois de fechar
    this._payload.set(null);
  }
}
