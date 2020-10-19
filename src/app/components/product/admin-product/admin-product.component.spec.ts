import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProduct } from './admin-product.component';

describe('ContactAccountComponent', () => {
  let component: AdminProduct;
  let fixture: ComponentFixture<AdminProduct>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProduct ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
