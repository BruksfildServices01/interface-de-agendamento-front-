import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../service/api/appointment.service';
import { Appointment } from '../../model/appointment.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-list.html',
  styleUrls: ['./appointment-list.scss'],
})
export class AppointmentList implements OnInit {
  appointments: Appointment[] = [];
  loading = false;

  selectedDate = this.today();

  constructor(
    private service: AppointmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.listByDate(this.selectedDate).subscribe({
      next: (data) => {
        this.appointments = data ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onDateChange(e: Event): void {
    this.selectedDate = (e.target as HTMLInputElement).value;
    this.load();
  }

  formatTime(iso?: string): string {
    if (!iso) return '';
    return iso.slice(11, 16); // HH:mm direto do backend
  }

  statusLabel(status: Appointment['status']): string {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }

  trackById(_: number, a: Appointment) {
    return a.id;
  }

  private today(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Confirma o cancelamento com alert
  confirmCancel(id: number): void {
    const confirmation = confirm('Você tem certeza de que deseja cancelar este agendamento?');
    if (confirmation) {
      this.service.cancel(id).subscribe({
        next: (updatedAppointment) => {
          console.log('Agendamento cancelado:', updatedAppointment);

          // Atualiza a lista de agendamentos após o cancelamento
          this.appointments = this.appointments.filter(
            ap => ap.id !== updatedAppointment.id
          );
          
          // Chama a função de recarregar para garantir que o estado seja refletido
          this.load();
        },
        error: (err) => {
          alert('Erro ao cancelar o agendamento!');
        }
      });
    }
  }
}
