import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLateralDesktop } from './menu-lateral-desktop';

describe('MenuLateralDesktop', () => {
  let component: MenuLateralDesktop;
  let fixture: ComponentFixture<MenuLateralDesktop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuLateralDesktop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuLateralDesktop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
