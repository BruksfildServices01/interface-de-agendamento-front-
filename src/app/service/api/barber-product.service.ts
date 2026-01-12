// service/agendamento-api/barber-product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  BarberProduct,
  CreateBarberProductDTO,
} from '../../model/barber-product.model';

import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class BarberProductService {
  private apiUrl = `${environment.apiUrl}/me/products`;

  constructor(private http: HttpClient) {}

  // =========================
  // LISTAR SERVIÇOS
  // =========================
  getProducts(): Observable<BarberProduct[]> {
    return this.http.get<BarberProduct[]>(this.apiUrl);
  }

  // =========================
  // CRIAR SERVIÇO
  // =========================
  createProduct(
    payload: CreateBarberProductDTO
  ): Observable<BarberProduct> {
    return this.http.post<BarberProduct>(this.apiUrl, payload);
  }

  // =========================
  // ATUALIZAR SERVIÇO
  // (quando existir endpoint)
  // =========================
  updateProduct(
    id: number,
    payload: Partial<CreateBarberProductDTO>
  ): Observable<BarberProduct> {
    return this.http.patch<BarberProduct>(
      `${this.apiUrl}/${id}`,
      payload
    );
  }
}
