import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UIService } from 'src/app/shared/services/ui.service';
import { Notification } from 'src/app/shared/model/notification.model';
import { selectIsLoggedIn, selectIsLoggedOut } from 'src/app/auth/auth.reducer';
import { selectCurrentLanguage, selectLanguages } from 'src/app/shared/store/ui.reducer';
import { NotificationEntityService } from 'src/app/shared/services/notification-entity.service';
import { AppState , selectUrl } from '../../app.reducer';
import { map } from 'rxjs/operators';

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
    private notificationDataService: NotificationEntityService,
  ) {
  }

  ngOnInit(): void {
    const userId: string = JSON.parse(localStorage.getItem('user'))
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.isLoggedOut$ = this.store.select(selectIsLoggedOut);
    this.pageName$ = this.store.select(selectUrl);
    this.currentLang$ = this.store.select(selectCurrentLanguage);
    this.languages$ = this.store.select(selectLanguages);
    this.currentUserNotifications$ = this.notificationDataService.entities$
      .pipe(
        map((allNotifications: Notification[]) => allNotifications.filter((userNotifications) => userNotifications.notificationUserId === userId))
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
    this.authService.logout().subscribe();
  }


}
