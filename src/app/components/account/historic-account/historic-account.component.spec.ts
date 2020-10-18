import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricAccountComponent } from './historic-account.component';

describe('HistoricAccountComponent', () => {
  let component: HistoricAccountComponent;
  let fixture: ComponentFixture<HistoricAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
