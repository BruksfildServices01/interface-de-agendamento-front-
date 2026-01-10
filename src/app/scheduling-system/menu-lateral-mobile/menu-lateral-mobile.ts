import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MENU_LINKS } from '../menu-links';

@Component({
  selector: 'app-menu-lateral-mobile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-lateral-mobile.html',
  styleUrl: './menu-lateral-mobile.scss',
})
export class MenuLateralMobile {
  @Input() aberto = false;
  @Output() close = new EventEmitter<void>();

  links = MENU_LINKS;

  fechar(): void {
    this.close.emit();
  }
}
