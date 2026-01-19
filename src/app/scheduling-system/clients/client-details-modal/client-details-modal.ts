import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientShop } from '../../../model/client.shop';

@Component({
  selector: 'app-client-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-details-modal.html',
  styleUrls: ['./client-details-modal.scss'],
})
export class ClientDetailsModal {
  @Input() client!: ClientShop;
  @Input() isOpen = false;

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
