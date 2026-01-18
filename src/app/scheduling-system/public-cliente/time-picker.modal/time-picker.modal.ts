import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
  computed,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClientService } from '../../../service/api/client.service';
import { WorkingHoursService } from '../../../service/api/working-hours.service';
import { TimeSlot } from '../../../model/client.model';
import { WorkingDay } from '../../../model/working.day';

type Period = 'morning' | 'afternoon' | 'evening' | null;

@Component({
  selector: 'app-time-picker-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-picker.modal.html',
  styleUrls: ['./time-picker.modal.scss'],
})
export class TimePickerModal implements OnInit {
  private clientService = inject(ClientService);
  private workingHoursService = inject(WorkingHoursService);

  // =========================
  // INPUT / OUTPUT (modal)
  // =========================
  @Input({ required: true }) slug!: string;
  @Input({ required: true }) serviceId!: number;

  @Output() select = new EventEmitter<{ date: string; time: string }>();
  @Output() close = new EventEmitter<void>();

  // =========================
  // STATE
  // =========================
  date = '';
  slots = signal<TimeSlot[]>([]);
  loading = signal(false);

  period = signal<Period>(null);
  workingHours = signal<WorkingDay[]>([]);
  dayInactive = signal(false);

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    this.date = this.minDate();
    this.loadWorkingHours();
  }

  // =========================
  // DATA MÍNIMA
  // =========================
  minDate(): string {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 120); // regra do backend
    return d.toISOString().split('T')[0];
  }

  // =========================
  // WORKING HOURS (1º PASSO)
  // =========================
  loadWorkingHours(): void {
    this.workingHoursService.get().subscribe({
      next: (data) => {
        this.workingHours.set(data || []);
        this.load(); // 🔥 só depois chama slots
      },
    });
  }

  // =========================
  // LOAD SLOTS (2º PASSO)
  // =========================
  load(): void {
    if (!this.date) return;

    const weekday = new Date(this.date).getDay();
    const workDay = this.workingHours().find(d => d.weekday === weekday);

    // 🚫 DIA FECHADO
    if (!workDay || !workDay.active) {
      this.dayInactive.set(true);
      this.slots.set([]);
      return;
    }

    this.dayInactive.set(false);
    this.loading.set(true);

    this.clientService
      .getAvailability(this.slug, this.date, this.serviceId)
      .subscribe({
        next: (res) => this.slots.set(res.slots || []),
        complete: () => this.loading.set(false),
      });
  }

  // =========================
  // PERIOD FILTER (UX)
  // =========================
  setPeriod(p: Period): void {
    this.period.set(p);
  }

  // =========================
  // FILTERED SLOTS (FRONT ONLY)
  // =========================
  filteredSlots = computed(() => {
    const period = this.period();
    const weekday = new Date(this.date).getDay();
    const workDay = this.workingHours().find(d => d.weekday === weekday);

    if (!workDay || !workDay.active) return [];

    const start = Number(workDay.start_time.split(':')[0]);
    const end = Number(workDay.end_time.split(':')[0]);

    return this.slots().filter(s => {
      const hour = Number(s.start.split(':')[0]);

      if (hour < start || hour >= end) return false;

      if (period === 'morning' && hour >= 12) return false;
      if (period === 'afternoon' && (hour < 12 || hour >= 18)) return false;
      if (period === 'evening' && hour < 18) return false;

      return true;
    });
  });

  // =========================
  // PICK
  // =========================
  pick(slot: TimeSlot): void {
    this.select.emit({
      date: this.date,
      time: slot.start,
    });
  }
}
