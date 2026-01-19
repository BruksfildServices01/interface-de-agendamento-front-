import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BarbershopService } from '../../service/api/barbershop.service';
import { Barbershop } from '../../model/barbershop.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit {
  // =============================
  // STATE
  // =============================
  loading = true;
  saving = false;

  barbershop!: Barbershop;

  constructor(
    private barbershopService: BarbershopService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  // =============================
  // LIFECYCLE
  // =============================
  ngOnInit(): void {
    this.loadProfile();
  }

  // =============================
  // DATA
  // =============================
  loadProfile(): void {
    this.loading = true;
    this.cdr.detectChanges();

    // 🔥 CONTRATO REAL: retorna Barbershop
    this.barbershopService.getMe().subscribe({
      next: (data) => {
        // ⚠️ normalização temporária do backend bugado
        this.barbershop = {
          ...data,
          timezone: (data as any).Timezone ?? data.timezone,
        };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        alert('Erro ao carregar perfil');
      },
    });
  }

  // =============================
  // ACTIONS
  // =============================
  save(): void {
    if (!this.barbershop) return;

    this.saving = true;
    this.cdr.detectChanges();

    this.barbershopService.update(this.barbershop).subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();
        alert('Perfil atualizado com sucesso');
      },
      error: () => {
        this.saving = false;
        this.cdr.detectChanges();
        alert('Erro ao salvar perfil');
      },
    });
  }

  goBack(): void {
    this.router.navigateByUrl('/home');
  }
}
