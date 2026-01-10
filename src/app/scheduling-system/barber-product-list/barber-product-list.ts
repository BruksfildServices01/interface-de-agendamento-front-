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
    private barberProductService: BarberProductService,
    private cdr: ChangeDetectorRef
  ) {}

  products: BarberProduct[] = [];

  loading = false;
  error: string | null = null;

  /* filtros */
  filterText = '';
  filterCategory = '';
  filterPrice = '';

  /* modal */
  showCreateModal = false;

  ngOnInit(): void {
    this.loadProducts();
  }

  /* =========================
     LISTAGEM
  ========================= */

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.barberProductService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges(); // 🔥 garante render
      },
      error: () => {
        this.error = 'Erro ao carregar serviços.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get filteredProducts(): BarberProduct[] {
    let list = [...this.products];

    if (this.filterText) {
      const t = this.filterText.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(t));
    }

    if (this.filterCategory) {
      list = list.filter(p => p.category === this.filterCategory);
    }

    if (this.filterPrice === 'low') {
      list.sort((a, b) => a.price - b.price);
    }

    if (this.filterPrice === 'high') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }

  /* =========================
     MODAL
  ========================= */

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
    this.cdr.detectChanges();

    this.barberProductService.createProduct(dto).subscribe({
      next: () => {
        this.loading = false;
        this.showCreateModal = false;

        // 🔥 ISSO É O QUE FALTAVA
        this.cdr.detectChanges();

        this.loadProducts();
      },
      error: () => {
        this.loading = false;
        this.error = 'Erro ao criar serviço.';
        this.cdr.detectChanges();
      },
    });
  }
}
