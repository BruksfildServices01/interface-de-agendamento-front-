import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { WorkingDay } from '../../model/working.day';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WorkingHoursService {
  private readonly apiUrl = `${environment.apiUrl}/me/working-hours`;

  constructor(private http: HttpClient) {}

  /** 🔄 Carrega horários do backend */
  get(): Observable<WorkingDay[]> {
    return this.http.get<WorkingDay[]>(this.apiUrl);
  }

  /** 💾 Salva horários */
  update(days: WorkingDay[]): Observable<void> {
    return this.http.put<void>(this.apiUrl, days);
  }
}
