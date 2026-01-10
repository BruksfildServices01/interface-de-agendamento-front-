import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberProductList } from './barber-product-list';

describe('BarberProductList', () => {
  let component: BarberProductList;
  let fixture: ComponentFixture<BarberProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberProductList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberProductList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
