import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { WorkingDay } from '../../model/working.day';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class WorkingHoursService {
  private readonly apiUrl = `${environment.apiUrl}/me/working-hours`;

  constructor(private http: HttpClient) { }

  /** 🔄 Carrega horários do backend */
  get(): Observable<WorkingDay[]> {
    return this.http.get<WorkingDay[]>(this.apiUrl);
  }

  update(days: WorkingDay[]): Observable<void> {
  const payload = {
    days: days.map(d => ({
      weekday: d.weekday,
      active: d.active,
      start_time: d.start_time || '',
      end_time: d.end_time || '',
      lunch_start: d.lunch_start || '',
      lunch_end: d.lunch_end || '',
    }))
  };

  return this.http.put<void>(this.apiUrl, payload);
}


}
