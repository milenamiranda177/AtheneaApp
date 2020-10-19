import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoProduct } from './tipo-product.component';

describe('ContactAccountComponent', () => {
  let component: TipoProduct;
  let fixture: ComponentFixture<TipoProduct>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoProduct ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
