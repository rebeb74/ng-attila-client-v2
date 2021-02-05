import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskNewFriendComponent } from './ask-new-friend.component';

describe('AskNewFriendComponent', () => {
  let component: AskNewFriendComponent;
  let fixture: ComponentFixture<AskNewFriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskNewFriendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskNewFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
