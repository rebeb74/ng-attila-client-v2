import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavNotificationsComponent } from './sidenav-notifications.component';

describe('SidenavNotificationsComponent', () => {
  let component: SidenavNotificationsComponent;
  let fixture: ComponentFixture<SidenavNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
