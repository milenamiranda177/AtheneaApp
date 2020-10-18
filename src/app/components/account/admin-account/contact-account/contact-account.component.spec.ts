import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAccountComponent } from './contact-account.component';

describe('ContactAccountComponent', () => {
  let component: ContactAccountComponent;
  let fixture: ComponentFixture<ContactAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
