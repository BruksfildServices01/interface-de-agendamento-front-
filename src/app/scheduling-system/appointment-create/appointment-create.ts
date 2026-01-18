import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WorkingDay } from '../../model/working.day';
import { WorkingHoursService } from '../../service/api/working-hours.service';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-create.html',
  styleUrls: ['./appointment-create.scss'],
})
export class AppointmentCreate implements OnInit {

  // =========================
  // STATE
  // =========================
  days: WorkingDay[] = [];
  loading = false;

  modalOpen = false;
  editingDay: WorkingDay | null = null;

  constructor(
    private service: WorkingHoursService,
    private cdr: ChangeDetectorRef
  ) {}

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
    this.loading = true;
    this.cdr.detectChanges();

    this.service.get().subscribe({
      next: (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.days = data;
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        const defaults = this.createDefaultDays();
        this.days = defaults;

        this.service.update(defaults).subscribe({
          complete: () => {
            this.loading = false;
            this.cdr.detectChanges();
          },
        });
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  saveAll(): void {
    this.service.update(this.days).subscribe();
  }

  // =========================
  // DEFAULT DAYS
  // =========================
  private createDefaultDays(): WorkingDay[] {
    return [0, 1, 2, 3, 4, 5, 6].map(d => this.defaultDay(d));
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
    this.editingDay = { ...day };
    this.modalOpen = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingDay = null;
    this.cdr.detectChanges();
  }

  saveDay(): void {
    if (!this.editingDay) return;

    const updated = this.editingDay;

    // limpeza automática
    if (!updated.active) {
      updated.start_time = '';
      updated.end_time = '';
      updated.lunch_start = undefined;
      updated.lunch_end = undefined;
    }

    this.days = this.days.map(d =>
      d.weekday === updated.weekday ? updated : d
    );

    this.saveAll();
    this.closeModal();
  }
}
