import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  OnInit,
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
export class ServicePickerModal implements OnInit {

  constructor(private clientService: ClientService) {}

  // =========================
  // INPUT / OUTPUT
  // =========================
  @Input({ required: true }) slug!: string;
  @Output() select = new EventEmitter<PublicService>();
  @Output() close = new EventEmitter<void>();

  // =========================
  // STATE
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

  filtersOpen = false;

  appliedFilters = signal({
    query: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    minDuration: undefined as number | undefined,
    maxDuration: undefined as number | undefined,
  });

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    this.load();
  }

  // =========================
  // LOAD
  // =========================
  load(): void {
    this.loading.set(true);

    this.clientService.getServices(this.slug).subscribe({
      next: (res) => {
        this.services.set(res.products || []);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  // =========================
  // FILTROS
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
  // LISTA FILTRADA
  // =========================
  filteredServices = computed(() => {
    const f = this.appliedFilters();

    return this.services().filter(s => {
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
  // ACTION
  // =========================
  pick(service: PublicService): void {
    this.select.emit(service);
  }
}
