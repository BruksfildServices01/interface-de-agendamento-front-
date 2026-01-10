import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppErrorModal } from './shared/app-error-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppErrorModal,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
