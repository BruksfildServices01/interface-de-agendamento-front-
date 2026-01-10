import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MENU_LINKS } from '../menu-links';

@Component({
  selector: 'app-menu-lateral-desktop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-lateral-desktop.html',
  styleUrl: './menu-lateral-desktop.scss',
})
export class MenuLateralDesktop {
  @Input() aberto = true;
  @Output() toggle = new EventEmitter<void>();

  links = MENU_LINKS;

  onToggle(): void {
    this.toggle.emit();
  }

  trackByTo(_: number, item: { to: string }) {
  return item.to;
}

}
