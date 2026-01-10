import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WorkingDay } from '../../model/working.day';
import { WorkingHoursService } from '../../service/api/working-hours.service';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-create.html',
  styleUrl: './appointment-create.scss',
})
export class AppointmentCreate implements OnInit {

  // ======================================================
  // STATE
  // ======================================================

  days = signal<WorkingDay[]>([]);
  loading = signal(false);

  modalOpen = signal(false);
  editingDay = signal<WorkingDay | null>(null);

  constructor(private service: WorkingHoursService) {}

  // ======================================================
  // LIFECYCLE
  // ======================================================

  ngOnInit(): void {
    this.load();
  }

  // ======================================================
  // BACKEND
  // ======================================================

  load(): void {
    this.loading.set(true);

    this.service.get().subscribe({
      next: (data) => {
        this.days.set(data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  saveAll(): void {
    this.service.update(this.days()).subscribe();
  }

  // ======================================================
  // HELPERS
  // ======================================================

  weekdayLabel(day: number): string {
    return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day];
  }

  // ======================================================
  // ACTIONS
  // ======================================================

  openDay(day: WorkingDay): void {
    this.editingDay.set({ ...day });
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.editingDay.set(null);
  }

  saveDay(): void {
    const updated = this.editingDay();
    if (!updated) return;

    // 🧠 limpeza automática
    if (!updated.active) {
      updated.lunch_start = undefined;
      updated.lunch_end = undefined;
    }

    this.days.update(list =>
      list.map(d =>
        d.weekday === updated.weekday ? updated : d
      )
    );

    // 💾 salva no backend automaticamente
    this.saveAll();

    this.closeModal();
  }
}
