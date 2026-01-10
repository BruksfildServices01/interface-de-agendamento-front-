// src/app/core/services/navigation.service.ts
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private history: string[] = [];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.history.push(event.urlAfterRedirects);
      });
  }

  public goBack(fallback: string = '/'): void {
    this.history.pop(); // remove current
    if (this.history.length > 0) {
      const previousUrl = this.history.pop()!;
      this.router.navigateByUrl(previousUrl);
    } else {
      this.router.navigateByUrl(fallback);
    }
  }

  public getHistory(): string[] {
    return [...this.history];
  }
}
