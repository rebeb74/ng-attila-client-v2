import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { UIService } from 'src/app/shared/services/ui.service';
import { Notification } from 'src/app/shared/model/notification.model';
import { getCurrentUser, getIsLoggedIn, getIsLoggedOut } from 'src/app/core/auth/store/auth.reducer';
import { getCurrentLanguage, getLanguages } from 'src/app/shared/store/ui.reducer';
import { NotificationEntityService } from 'src/app/shared/services/notification-entity.service';
import { AppState, selectUrl } from '../../store/app.reducer';
import { map, withLatestFrom } from 'rxjs/operators';
import { User } from 'src/app/shared/model/user.model';
import { Router } from '@angular/router';
import { CalendarService } from 'src/app/modules/calendar/services/calendar.service';
import { ChecklistService } from 'src/app/modules/checklist/services/checklist.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  @Output() sidenavNotificationsToggle = new EventEmitter<void>();
  currentLang$: Observable<string>;
  pageName$: Observable<string>;
  languages$: Observable<string[]>;
  currentUserNotifications$: Observable<Notification[]>;
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private uiService: UIService,
    private notificationEntityService: NotificationEntityService,
    private router: Router,
    private calendarService: CalendarService,
    private ChecklistService: ChecklistService
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(getIsLoggedIn);
    this.isLoggedOut$ = this.store.select(getIsLoggedOut);
    this.pageName$ = this.store.select(selectUrl);
    this.currentLang$ = this.store.select(getCurrentLanguage);
    this.languages$ = this.store.select(getLanguages);
    this.currentUserNotifications$ = this.notificationEntityService.entities$
      .pipe(
        withLatestFrom(this.store.select(getCurrentUser)),
        map(([allNotifications, currentUser]: [Notification[], User]) => allNotifications.filter((userNotifications) => userNotifications.notificationUserId === currentUser._id))
      );
  }

  switchLang(newLang) {
    this.uiService.switchLang(newLang);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onToggleSidenavNotifications() {
    this.sidenavNotificationsToggle.emit();
  }

  onLogout() {
    this.router.navigateByUrl('/login');
    this.authService.logout().subscribe();
  }

  addEvent(pageName) {
    if (pageName === 'calendar') {
      this.calendarService.addEvent('task').subscribe();
    } else if (pageName === 'checklist') {
      this.ChecklistService.addChecklist().subscribe();
    }
  }
}
