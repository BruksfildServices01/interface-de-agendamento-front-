import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BarbershopService } from '../../service/api/barbershop.service';

@Component({
  selector: 'app-home-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-menu.html',
  styleUrls: ['./home-menu.scss'],
})
export class HomeMenu {
  private router = inject(Router);
  private barbershopService = inject(BarbershopService);

  slug = '';

  ngOnInit(): void {
    this.barbershopService.getMe().subscribe({
      next: (b) => {
        this.slug = b.slug;
      },
    });
  }

  // =============================
  // NAVIGATION
  // =============================
  goAppointments(): void {
    this.router.navigateByUrl('/appointments/list');
  }

  goProducts(): void {
    this.router.navigateByUrl('/barber-products');
  }

  goClients(): void {
    this.router.navigateByUrl('/clientes');
  }

  goWorkingHours(): void {
    this.router.navigateByUrl('/appointments/create');
  }

  // =============================
  // PUBLIC LINK
  // =============================
  copyAffiliateLink(): void {
    const link = `${window.location.origin}/public/${this.slug}`;
    navigator.clipboard.writeText(link);
    alert('Link copiado para a área de transferência');
  }
}
