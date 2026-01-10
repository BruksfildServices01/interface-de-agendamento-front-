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
import { TimeSlot } from '../../../model/client.model';

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

  // =========================
  // INPUT / OUTPUT
  // =========================
  @Input({ required: true }) slug!: string;
  @Input({ required: true }) serviceId!: number;

  @Output() select = new EventEmitter<{ date: string; time: string }>();
  @Output() close = new EventEmitter<void>();

  // =========================
  // ESTADO
  // =========================
  date = '';
  slots = signal<TimeSlot[]>([]);
  loading = signal(false);

  period = signal<Period>(null);

  ngOnInit(): void {
    this.date = this.minDate();
    this.load();
  }

  // =========================
  // DATA MÍNIMA
  // =========================
  minDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // =========================
  // LOAD
  // =========================
  load(): void {
    if (!this.date) return;

    this.loading.set(true);

    this.clientService
      .getAvailability(this.slug, this.date, this.serviceId)
      .subscribe({
        next: (res) => this.slots.set(res.slots || []),
        complete: () => this.loading.set(false),
      });
  }

  // =========================
  // FILTRO DE PERÍODO
  // =========================
  setPeriod(p: Period): void {
    this.period.set(p);
  }

  filteredSlots = computed(() => {
    const period = this.period();
    if (!period) return this.slots();

    return this.slots().filter((s) => {
      const hour = Number(s.start.split(':')[0]);

      if (period === 'morning') return hour < 12;
      if (period === 'afternoon') return hour >= 12 && hour < 18;
      if (period === 'evening') return hour >= 18;

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
