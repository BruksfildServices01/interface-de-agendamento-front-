import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MENU_LINKS } from '../menu-links';
import { TokenStorage } from '../../service/auth/token.storage'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-lateral-mobile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-lateral-mobile.html',
  styleUrls: ['./menu-lateral-mobile.scss'],
})
export class MenuLateralMobile {
  @Input() aberto = false;
  @Output() close = new EventEmitter<void>();

  links = MENU_LINKS;

  constructor(
    private tokenStorage: TokenStorage,  
    private router: Router               
  ) {}

  fechar(): void {
    this.close.emit();
  }

  // Método de logout
  logout(): void {
    // Limpar o token de autenticação
    this.tokenStorage.clear();

    // Redirecionar para a página de login
    this.router.navigateByUrl('/auth/login');
  }
}
