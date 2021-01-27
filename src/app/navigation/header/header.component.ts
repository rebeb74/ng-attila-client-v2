import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UIService } from 'src/app/shared/services/ui.service';
import { Notification } from 'src/app/shared/model/notification.model';
import { getCurrentUser, getIsLoggedIn, getIsLoggedOut } from 'src/app/auth/auth.reducer';
import { getCurrentLanguage, getLanguages } from 'src/app/shared/store/ui.reducer';
import { NotificationEntityService } from 'src/app/shared/store/notification-entity.service';
import { AppState , selectUrl } from '../../app.reducer';
import { map, withLatestFrom } from 'rxjs/operators';
import { User } from 'src/app/shared/model/user.model';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(getIsLoggedIn);
    this.isLoggedOut$ = this.store.select(getIsLoggedOut);
    this.pageName$ = this.store.select(selectUrl);
    this.currentLang$ = this.store.select(getCurrentLanguage);
    this.languages$ = this.store.select(getLanguages);
    this.currentUserNotifications$ = this.notificationDataService.entities$
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

  addEvent($event){
    this.uiService.addEvent($event);
  }

}
