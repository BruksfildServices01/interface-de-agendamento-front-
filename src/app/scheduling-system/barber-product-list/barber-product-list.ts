import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BarberProductService } from '../../service/api/barber-product.service';
import {
  BarberProduct,
  CreateBarberProductDTO,
} from '../../model/barber-product.model';

import { BarberProductModal } from './barber-product-modal/barber-product-modal';

@Component({
  selector: 'app-barber-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarberProductModal,
  ],
  templateUrl: './barber-product-list.html',
  styleUrls: ['./barber-product-list.scss'],
})
export class BarberProductList implements OnInit {

  constructor(
    private service: BarberProductService,
    private cdr: ChangeDetectorRef // ✅ VOLTOU
  ) {}

  // =========================
  // DATA
  // =========================
  products: BarberProduct[] = [];
  filtered: BarberProduct[] = [];

  // =========================
  // STATE
  // =========================
  loading = false;
  error: string | null = null;

  // =========================
  // FILTERS
  // =========================
  filterText = '';
  filterCategory = '';
  filterPrice = '';

  // =========================
  // MODAL
  // =========================
  showCreateModal = false;

  ngOnInit(): void {
    this.loadProducts();
  }

  // =========================
  // LOAD
  // =========================
  loadProducts(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges(); // 🔥 mostra loading

    this.service.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.loading = false;

        this.cdr.detectChanges(); // 🔥 renderiza lista
      },
      error: () => {
        this.error = 'Erro ao carregar serviços.';
        this.loading = false;

        this.cdr.detectChanges(); // 🔥 renderiza erro
      },
    });
  }

  // =========================
  // FILTER LOGIC
  // =========================
  applyFilters(): void {
    let list = [...this.products];

    if (this.filterText) {
      const t = this.filterText.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(t)
      );
    }

    if (this.filterCategory) {
      list = list.filter(
        p => p.category === this.filterCategory
      );
    }

    if (this.filterPrice === 'low') {
      list.sort((a, b) => a.price - b.price);
    }

    if (this.filterPrice === 'high') {
      list.sort((a, b) => b.price - a.price);
    }

    this.filtered = list;
  }

  // =========================
  // FILTER EVENTS
  // =========================
  onFilterChange(): void {
    this.applyFilters();
  }

  // =========================
  // MODAL
  // =========================
  openCreate(): void {
    this.showCreateModal = true;
    this.cdr.detectChanges(); // 🔥 abre imediatamente
  }

  closeCreate(): void {
    this.showCreateModal = false;
    this.cdr.detectChanges(); // 🔥 fecha imediatamente
  }

  saveProduct(dto: CreateBarberProductDTO): void {
    this.loading = true;
    this.cdr.detectChanges(); // 🔥 bloqueia UI

    this.service.createProduct(dto).subscribe({
      next: () => {
        this.showCreateModal = false;
        this.loadProducts(); // 🔥 recarrega lista
      },
      error: () => {
        this.error = 'Erro ao criar serviço.';
        this.loading = false;

        this.cdr.detectChanges();
      },
    });
  }
}
