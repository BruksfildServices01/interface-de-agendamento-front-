import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { MenuLateralDesktop } from '../../scheduling-system/menu-lateral-desktop/menu-lateral-desktop';
import { MenuLateralMobile } from '../../scheduling-system/menu-lateral-mobile/menu-lateral-mobile';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, MenuLateralDesktop, MenuLateralMobile],
  templateUrl: './app-layout.html',
  styleUrls: ['./app-layout.scss'],
})
export class AppLayout {
  mobile = window.matchMedia('(max-width: 900px)').matches;
  desktopAberto = true;
  mobileAberto = false;

  toggleMenu() {
    this.mobile ? this.mobileAberto = !this.mobileAberto
                : this.desktopAberto = !this.desktopAberto;
  }

  closeMobile() {
    this.mobileAberto = false;
  }
}
