import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskUserToUpdateComponent } from './ask-user-to-update.component';

describe('AskUserToUpdateComponent', () => {
  let component: AskUserToUpdateComponent;
  let fixture: ComponentFixture<AskUserToUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskUserToUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskUserToUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
