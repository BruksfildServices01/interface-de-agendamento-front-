import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClientShop } from '../../model/client.shop';
import { ClientShopService } from '../../service/api/client.shop.service';
import { ClientDetailsModal } from './client-details-modal/client-details-modal';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClientDetailsModal,
  ],
  templateUrl: './clients.html',
  styleUrls: ['./clients.scss'],
})
export class Clients implements OnInit {
  // =============================
  // STATE
  // =============================
  clients: ClientShop[] = [];
  loading = true;
  search = '';

  selectedClient: ClientShop | null = null;
  modalOpen = false;

  constructor(
    private clientShopService: ClientShopService,
    private cdr: ChangeDetectorRef // 🔑 FUNDAMENTAL
  ) {}

  // =============================
  // LIFECYCLE
  // =============================
  ngOnInit(): void {
    this.loadClients();
  }

  // =============================
  // DATA
  // =============================
  loadClients(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.clientShopService.list(this.search).subscribe({
      next: (clients) => {
        this.clients = clients;
        this.loading = false;
        this.cdr.detectChanges(); // 🔥 força render
      },
      error: () => {
        this.clients = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSearchChange(): void {
    this.loadClients();
  }

  // =============================
  // MODAL
  // =============================
  openClient(client: ClientShop): void {
    this.selectedClient = client;
    this.modalOpen = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedClient = null;
    this.cdr.detectChanges();
  }
}
