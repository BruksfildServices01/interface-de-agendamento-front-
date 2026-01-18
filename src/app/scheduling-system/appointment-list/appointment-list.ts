import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentService } from '../../service/api/appointment.service';
import { Appointment } from '../../model/appointment.model';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-list.html',
  styleUrls: ['./appointment-list.scss'],
})
export class AppointmentList implements OnInit {

  // =========================
  // STATE
  // =========================
  appointments: Appointment[] = [];
  loading = false;
  error: string | null = null;

  // 🔥 SEMPRE YYYY-MM-DD
  selectedDate: string = this.today();

  constructor(
    private service: AppointmentService,
    private cdr: ChangeDetectorRef
  ) {}

  // =========================
  // LIFECYCLE
  // =========================
  ngOnInit(): void {
    this.load();
  }

  // =========================
  // LOAD
  // =========================
  load(): void {
    this.loading = true;
    this.error = null;

    console.log('📅 Buscando agendamentos para:', this.selectedDate);

    this.service.listByDate(this.selectedDate).subscribe({
      next: (data) => {
        this.appointments = Array.isArray(data) ? data : [];
        this.loading = false;

        setTimeout(() => this.cdr.detectChanges());
      },
      error: () => {
        this.loading = false;
        this.error = 'Erro ao carregar agendamentos';
        setTimeout(() => this.cdr.detectChanges());
      },
    });
  }

  // =========================
  // DATE CHANGE
  // =========================
  onDateChange(e: Event): void {
    this.selectedDate = (e.target as HTMLInputElement).value;
    this.load();
  }

  // =========================
  // CANCEL
  // =========================
  confirmCancel(id: number): void {
    const ok = confirm('Deseja cancelar este agendamento?');
    if (!ok) return;

    this.service.cancel(id).subscribe({
      next: (updated) => {
        this.appointments = this.appointments.map(ap =>
          ap.id === updated.id ? updated : ap
        );
        setTimeout(() => this.cdr.detectChanges());
      },
      error: () => {
        alert('Erro ao cancelar agendamento');
      },
    });
  }

  // =========================
  // HELPERS
  // =========================
  formatTime(iso?: string): string {
    return iso ? iso.slice(11, 16) : '';
  }

  statusLabel(status: Appointment['status']): string {
    switch (status) {
      case 'scheduled': return 'Agendado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  }

  trackById(_: number, ap: Appointment): number {
    return ap.id;
  }

  // =========================
  // UTIL
  // =========================
  private today(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // 👉 apenas para exibição
  get formattedDate(): Date {
    return new Date(this.selectedDate + 'T00:00:00');
  }
}
