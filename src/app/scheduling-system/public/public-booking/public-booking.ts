import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ClientService } from '../../../service/api/client.service';
import {
  PublicService,
  PublicCreateAppointmentRequest,
} from '../../../model/client.model';

import { ServicePickerModal } from '../service-picker.modal/service-picker.modal';
import { TimePickerModal } from '../time-picker.modal/time-picker.modal';

@Component({
  selector: 'app-public-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ServicePickerModal, TimePickerModal],
  templateUrl: './public-booking.html',
  styleUrls: ['./public-booking.scss'],
})
export class PublicBooking {
  private route = inject(ActivatedRoute);
  private clientService = inject(ClientService);

  slug = signal('');

  selectedService = signal<PublicService | null>(null);
  selectedDate = signal<string | null>(null);
  selectedTime = signal<string | null>(null);

  clientName = signal('');
  clientPhone = signal('');
  clientEmail = signal('');
  notes = signal('');

  serviceModalOpen = signal(false);
  timeModalOpen = signal(false);

  loading = signal(false);
  success = signal(false);

  createdAppointment = signal<{
    serviceName: string;
    date: string;
    time: string;
  } | null>(null);

  constructor() {
    this.slug.set(this.route.snapshot.paramMap.get('slug') || '');
  }

  onServiceSelected(service: PublicService) {
    this.selectedService.set(service);
    this.selectedDate.set(null);
    this.selectedTime.set(null);
    this.serviceModalOpen.set(false);
  }

  onTimeSelected(date: string, time: string) {
    this.selectedDate.set(date);
    this.selectedTime.set(time);
    this.timeModalOpen.set(false);
  }

  canSubmit = computed(() =>
    !!this.selectedService() &&
    !!this.selectedDate() &&
    !!this.selectedTime() &&
    this.clientName().trim().length > 0 &&
    this.clientPhone().trim().length > 0 &&
    !this.loading()
  );

  confirm() {
    if (!this.canSubmit()) return;

    const payload: PublicCreateAppointmentRequest = {
      clientName: this.clientName(),
      clientPhone: this.clientPhone(),
      clientEmail: this.clientEmail() || undefined,
      productId: this.selectedService()!.id,
      date: this.selectedDate()!,
      time: this.selectedTime()!,
      notes: this.notes() || undefined,
    };

    this.loading.set(true);

    this.clientService.createAppointment(this.slug(), payload).subscribe({
      next: () => {
        this.createdAppointment.set({
          serviceName: this.selectedService()!.name,
          date: this.selectedDate()!,
          time: this.selectedTime()!,
        });
        this.success.set(true);
        this.resetForm();
      },
      complete: () => this.loading.set(false),
    });
  }

  closeSuccess() {
    this.success.set(false);
    this.createdAppointment.set(null);
  }

  resetForm() {
    this.selectedService.set(null);
    this.selectedDate.set(null);
    this.selectedTime.set(null);

    this.clientName.set('');
    this.clientPhone.set('');
    this.clientEmail.set('');
    this.notes.set('');
  }
}
