import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClientService } from '../../../service/api/client.service';
import { PublicService } from '../../../model/client.model';

@Component({
  selector: 'app-service-picker-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-picker.modal.html',
  styleUrls: ['./service-picker.modal.scss'],
})
export class ServicePickerModal {
  private clientService = inject(ClientService);

  // =========================
  // INPUT / OUTPUT
  // =========================
  @Input({ required: true }) slug!: string;
  @Output() select = new EventEmitter<PublicService>();
  @Output() close = new EventEmitter<void>();

  // =========================
  // ESTADO BASE
  // =========================
  services = signal<PublicService[]>([]);
  loading = signal(false);

  // =========================
  // FILTROS (EDITÁVEIS)
  // =========================
  query = '';
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;

  // =========================
  // FILTROS APLICADOS (USADOS)
  // =========================
  appliedFilters = signal<{
    query: string;
    minPrice?: number;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
  }>({
    query: '',
  });

  filtersOpen = false;

  constructor() {
    // 🔥 carrega serviços quando slug estiver disponível
    effect(() => {
      if (this.slug) {
        this.load();
      }
    });
  }

  // =========================
  // LOAD (BACKEND)
  // =========================
  load(): void {
    this.loading.set(true);

    this.clientService
      .getServices(this.slug)
      .subscribe({
        next: (res) => this.services.set(res.products),
        complete: () => this.loading.set(false),
      });
  }

  // =========================
  // APLICAR FILTROS (BOTÃO)
  // =========================
  applyFilters(): void {
    this.appliedFilters.set({
      query: this.query.trim(),
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minDuration: this.minDuration,
      maxDuration: this.maxDuration,
    });

    this.filtersOpen = false;
  }

  // =========================
  // LIMPAR FILTROS
  // =========================
  clearFilters(): void {
    this.query = '';
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.minDuration = undefined;
    this.maxDuration = undefined;

    this.appliedFilters.set({ query: '' });
  }

  // =========================
  // LISTA FILTRADA (UX)
  // =========================
  filteredServices = computed(() => {
    const f = this.appliedFilters();

    return this.services().filter((s) => {
      if (f.query && !s.name.toLowerCase().includes(f.query.toLowerCase())) {
        return false;
      }
      if (f.minPrice != null && s.price < f.minPrice) return false;
      if (f.maxPrice != null && s.price > f.maxPrice) return false;
      if (f.minDuration != null && s.durationMin < f.minDuration) return false;
      if (f.maxDuration != null && s.durationMin > f.maxDuration) return false;
      return true;
    });
  });

  // =========================
  // AÇÃO
  // =========================
  pick(service: PublicService): void {
    this.select.emit(service);
  }
}
