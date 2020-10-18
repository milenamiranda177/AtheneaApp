import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsVehiclesComponent } from './contracts-vehicles.component';

describe('ContractsVehiclesComponent', () => {
  let component: ContractsVehiclesComponent;
  let fixture: ComponentFixture<ContractsVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
