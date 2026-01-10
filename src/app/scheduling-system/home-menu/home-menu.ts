import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-menu.html',
  styleUrl: './home-menu.scss',
})
export class HomeMenu {
  constructor(private router: Router) {}

  // =========================
  // NAVIGATION
  // =========================

  goAppointments(): void {
    this.router.navigateByUrl('/appointments/list');
  }

  goProducts(): void {
    this.router.navigateByUrl('/barber-products');
  }

  goWorkingHours(): void {
    this.router.navigateByUrl('/appointments/create');
  }

  // =========================
  // AFFILIATE LINK
  // =========================

  copyAffiliateLink(): void {
    // depois você pode pegar isso do backend
    const link = `${window.location.origin}/public/barbearia-do-lucas`;

    navigator.clipboard.writeText(link);
    alert('Link copiado para a área de transferência');
  }
}
