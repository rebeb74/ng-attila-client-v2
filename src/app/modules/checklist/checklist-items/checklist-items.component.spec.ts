import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistItemsComponent } from './checklist-items.component';

describe('ChecklistItemsComponent', () => {
  let component: ChecklistItemsComponent;
  let fixture: ComponentFixture<ChecklistItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
