import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'public-layout',
  imports: [RouterOutlet],
  template: `
    <main class="public-container">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class PublicLayout {}
