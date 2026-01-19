import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDetailsModal } from './client-details-modal';

describe('ClientDetailsModal', () => {
  let component: ClientDetailsModal;
  let fixture: ComponentFixture<ClientDetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDetailsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientDetailsModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
