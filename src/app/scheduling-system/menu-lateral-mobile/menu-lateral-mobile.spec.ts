import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLateralMobile } from './menu-lateral-mobile';

describe('MenuLateralMobile', () => {
  let component: MenuLateralMobile;
  let fixture: ComponentFixture<MenuLateralMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuLateralMobile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuLateralMobile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
