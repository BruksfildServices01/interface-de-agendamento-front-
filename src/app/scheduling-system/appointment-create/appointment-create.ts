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

  // =========================
  // STATE
  // =========================

  days = signal<WorkingDay[]>([]);
  loading = signal(false);

  modalOpen = signal(false);
  editingDay = signal<WorkingDay | null>(null);

  constructor(private service: WorkingHoursService) {}

  // =========================
  // LIFECYCLE
  // =========================

  ngOnInit(): void {
    this.load();
  }

  // =========================
  // LOAD / BACKEND
  // =========================

  load(): void {
    this.loading.set(true);

    this.service.get().subscribe({
      next: (data) => {
        // ✅ Se já existem horários no backend
        if (data && data.length > 0) {
          this.days.set(data);
          this.loading.set(false);
          return;
        }

        // 🧠 Caso contrário, cria padrão
        const defaults = this.createDefaultDays();
        this.days.set(defaults);

        // 💾 Salva automaticamente no backend
        this.service.update(defaults).subscribe({
          complete: () => this.loading.set(false),
        });
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  saveAll(): void {
    this.service.update(this.days()).subscribe();
  }

  // =========================
  // DEFAULT DAYS
  // =========================

  private createDefaultDays(): WorkingDay[] {
    return [0, 1, 2, 3, 4, 5, 6].map((weekday) =>
      this.defaultDay(weekday)
    );
  }

  private defaultDay(weekday: number): WorkingDay {
    const isWeekday = weekday >= 1 && weekday <= 5;

    return {
      weekday,
      active: isWeekday,
      start_time: isWeekday ? '09:00' : '',
      end_time: isWeekday ? '17:00' : '',
      lunch_start: undefined,
      lunch_end: undefined,
    };
  }

  // =========================
  // HELPERS
  // =========================

  weekdayLabel(day: number): string {
    return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day];
  }

  // =========================
  // ACTIONS
  // =========================

  openDay(day: WorkingDay): void {
    // clone para não editar direto a lista
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
      updated.start_time = '';
      updated.end_time = '';
      updated.lunch_start = undefined;
      updated.lunch_end = undefined;
    }

    this.days.update(list =>
      list.map(d =>
        d.weekday === updated.weekday ? updated : d
      )
    );

    // 💾 salva no backend
    this.saveAll();

    this.closeModal();
  }
}
