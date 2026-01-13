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
  workingHours: WorkingDay[] = [];

  ngOnInit(): void {
    this.date = this.minDate();
    this.loadWorkingHours();
    this.load();  // Carrega os horários disponíveis assim que o componente é inicializado
  }

  // =========================
  // DATA MÍNIMA
  // =========================
  minDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // =========================
  // LOAD - Carregar Horários Disponíveis
  // =========================
  load(): void {
    if (!this.date) return;

    this.loading.set(true);

    this.clientService
      .getAvailability(this.slug, this.date, this.serviceId)
      .subscribe({
        next: (res) => this.slots.set(res.slots || []),  // Atualiza os slots com os horários disponíveis
        complete: () => this.loading.set(false),
      });
  }

  // =========================
  // FILTRO DE PERÍODO
  // =========================
  setPeriod(p: Period): void {
    this.period.set(p);
  }

  // =========================
  // FILTRAGEM DOS SLOTS
  // =========================
  filteredSlots = computed(() => {
    const period = this.period();
    const dayOfWeek = new Date(this.date).getDay();  // Dia da semana (0 = Domingo, 1 = Segunda-feira, etc.)

    // Filtra apenas os slots dentro do horário de trabalho
    const workStart = this.getWorkStartTime(dayOfWeek);
    const workEnd = this.getWorkEndTime(dayOfWeek);

    return this.slots().filter((s) => {
      const slotTime = Number(s.start.split(':')[0]);  // Pegando a hora do slot

      // Verificando se o horário está dentro do horário de trabalho
      if (slotTime < workStart || slotTime >= workEnd) {
        return false;
      }

      // Filtra os slots com base no período selecionado
      if (period === 'morning' && slotTime >= 12) return false;
      if (period === 'afternoon' && (slotTime < 12 || slotTime >= 18)) return false;
      if (period === 'evening' && slotTime < 18) return false;

      return true;
    });
  });

  // =========================
  // GET WORKING HOURS (Início e Fim)
  // =========================
  getWorkStartTime(day: number): number {
    const workDay = this.workingHours.find(w => w.weekday === day);
    return workDay ? parseInt(workDay.start_time.split(':')[0], 10) : 0;
  }

  getWorkEndTime(day: number): number {
    const workDay = this.workingHours.find(w => w.weekday === day);
    return workDay ? parseInt(workDay.end_time.split(':')[0], 10) : 24;
  }

  // =========================
  // PICK - Seleção de Horário
  // =========================
  pick(slot: TimeSlot): void {
    this.select.emit({
      date: this.date,
      time: slot.start,
    });
  }

  // =========================
  // Carregar Horários de Trabalho
  // =========================
  loadWorkingHours(): void {
    this.workingHoursService.get().subscribe((data: WorkingDay[]) => {
      this.workingHours = data;
    });
  }
}
