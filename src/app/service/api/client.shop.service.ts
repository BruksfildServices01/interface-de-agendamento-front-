import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ClientShop } from '../../model/client.shop';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientShopService {
  private readonly baseUrl = `${environment.apiUrl}/me/clients`;

  constructor(private http: HttpClient) {}

  // ==================================================
  // 👥 LISTAR CLIENTES DO BARBEIRO
  // ==================================================
  list(query?: string): Observable<ClientShop[]> {
    let params = new HttpParams();

    if (query && query.trim().length > 0) {
      params = params.set('query', query.trim());
    }

    return this.http.get<ClientShop[]>(this.baseUrl, { params });
  }
}
