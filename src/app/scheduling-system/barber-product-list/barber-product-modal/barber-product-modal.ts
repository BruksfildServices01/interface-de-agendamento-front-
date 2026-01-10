import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  CreateBarberProductDTO,
} from '../../../model/barber-product.model';

@Component({
  selector: 'app-barber-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barber-product-modal.html',
  styleUrls: ['./barber-product-modal.scss'],
})
export class BarberProductModal {
  @Input() open = false;
  @Input() loading = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateBarberProductDTO>();

  form: CreateBarberProductDTO = {
    name: '',
    description: '',
    duration_min: 0,
    price: 0,
    category: '',
  };

  submit(): void {
    if (
      !this.form.name ||
      this.form.duration_min <= 0 ||
      this.form.price <= 0
    ) {
      return;
    }

    this.save.emit({
      ...this.form,
      name: this.form.name.trim(),
      description: this.form.description?.trim() || '',
    });
  }

  cancel(): void {
  if (!this.loading) {
    this.reset();
    this.close.emit();
  }
}


  reset(): void {
    this.form = {
      name: '',
      description: '',
      duration_min: 0,
      price: 0,
      category: '',
    };
  }
}
