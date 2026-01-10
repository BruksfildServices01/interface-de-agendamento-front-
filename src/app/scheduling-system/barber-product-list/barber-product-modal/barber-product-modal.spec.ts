import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberProductModal } from './barber-product-modal';

describe('BarberProductModal', () => {
  let component: BarberProductModal;
  let fixture: ComponentFixture<BarberProductModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberProductModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberProductModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
