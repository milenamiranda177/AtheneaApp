import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitLogin } from './init-login.component';

describe('AdminLoginComponent', () => {
  let component: InitLogin;
  let fixture: ComponentFixture<InitLogin>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitLogin ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
