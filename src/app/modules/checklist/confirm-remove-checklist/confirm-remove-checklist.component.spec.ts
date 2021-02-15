import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRemoveChecklistComponent } from './confirm-remove-checklist.component';

describe('ConfirmRemoveChecklistComponent', () => {
  let component: ConfirmRemoveChecklistComponent;
  let fixture: ComponentFixture<ConfirmRemoveChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmRemoveChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRemoveChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
