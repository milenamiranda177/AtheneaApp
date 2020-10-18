import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricLoginComponent } from './historic-login.component';

describe('HistoricLoginComponent', () => {
  let component: HistoricLoginComponent;
  let fixture: ComponentFixture<HistoricLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
