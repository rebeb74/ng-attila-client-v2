import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordCardComponent } from './reset-password-card.component';

describe('ResetPasswordCardComponent', () => {
  let component: ResetPasswordCardComponent;
  let fixture: ComponentFixture<ResetPasswordCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
