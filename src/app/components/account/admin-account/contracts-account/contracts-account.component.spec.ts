import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAccountComponent } from './contracts-account.component';

describe('ContractsAccountComponent', () => {
  let component: ContractsAccountComponent;
  let fixture: ComponentFixture<ContractsAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
