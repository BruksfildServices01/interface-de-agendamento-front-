import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private readonly KEY = 'auth_token';

  // 🔁 signal interno (estado reativo)
  private tokenSig = signal<string | null>(this.readFromStorage());

  // leitura inicial (uma vez)
  private readFromStorage(): string | null {
    const t = localStorage.getItem(this.KEY);
    return t && t.trim().length ? t : null;
  }

  // API pública (mantida)
  get(): string | null {
    return this.tokenSig();
  }

  set(token: string): void {
    const t = (token ?? '').trim();
    if (!t) return;

    localStorage.setItem(this.KEY, t);
    this.tokenSig.set(t); // 🔥 atualiza o signal
  }

  clear(): void {
    localStorage.removeItem(this.KEY);
    this.tokenSig.set(null); // 🔥 atualiza o signal
  }

  hasToken(): boolean {
    return !!this.tokenSig();
  }
}
