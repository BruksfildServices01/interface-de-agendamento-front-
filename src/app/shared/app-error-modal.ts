import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AppErrorService } from '../service/servicos_navigation/app-error.service';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="aem" *ngIf="svc.open()">
    <div class="aem__backdrop" (click)="close()"></div>

    <div class="aem__card" role="dialog" aria-modal="true">
      <div class="aem__head">
        <h3 class="aem__title">{{ svc.payload()?.title }}</h3>
        <button class="aem__x" type="button" (click)="close()">×</button>
      </div>

      <p class="aem__msg">{{ svc.payload()?.message }}</p>

      <pre class="aem__details" *ngIf="svc.payload()?.details as d">{{ d }}</pre>

      <div class="aem__actions">
        <button class="aem__btn" type="button" (click)="close()">Ok</button>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .aem { position: fixed; inset: 0; z-index: 9999; }
    .aem__backdrop { position: absolute; inset: 0; background: rgba(0,0,0,.55); }
    .aem__card {
      position: absolute; left: 50%; top: 12%;
      transform: translateX(-50%);
      width: min(560px, calc(100vw - 32px));
      background: #111; color: #fff;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 14px;
      box-shadow: 0 18px 60px rgba(0,0,0,.5);
      padding: 14px;
    }
    .aem__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .aem__title { margin: 0; font-size: 16px; }
    .aem__x { background: transparent; border: 0; color: #fff; font-size: 22px; cursor: pointer; line-height: 1; }
    .aem__msg { margin: 10px 0 0; opacity: .95; }
    .aem__details {
      margin: 10px 0 0;
      padding: 10px;
      background: rgba(255,255,255,.06);
      border-radius: 10px;
      overflow: auto;
      max-height: 160px;
      font-size: 12px;
    }
    .aem__actions { display: flex; justify-content: flex-end; margin-top: 12px; }
    .aem__btn {
      border: 0; cursor: pointer;
      padding: 10px 14px;
      border-radius: 10px;
      background: #fff; color: #111;
      font-weight: 700;
    }
  `],
})
export class AppErrorModal {
  readonly svc = inject(AppErrorService);
  close(): void { this.svc.close(); }
}
