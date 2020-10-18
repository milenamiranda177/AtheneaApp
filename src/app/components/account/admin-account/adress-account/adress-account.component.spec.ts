import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdressAccountComponent } from './adress-account.component';

describe('AdressAccountComponent', () => {
  let component: AdressAccountComponent;
  let fixture: ComponentFixture<AdressAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdressAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdressAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
