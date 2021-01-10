import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UIService } from 'src/app/shared/services/ui.service';
import { Notification } from 'src/app/shared/model/notification.model';
import { selectIsLoggedIn, selectIsLoggedOut } from 'src/app/auth/auth.reducer';

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
    private store: Store<fromRoot.State>,
    private authService: AuthService,
    private uiService: UIService,
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.isLoggedOut$ = this.store.select(selectIsLoggedOut);
    this.pageName$ = this.store.select(fromRoot.getPageName);
    this.currentLang$ = this.store.select(fromRoot.getCurrentLanguage);
    this.languages$ = this.store.select(fromRoot.getLanguages);
    this.currentUserNotifications$ = this.store.select(fromRoot.getCurrentUserNotifications);
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
    this.authService.logout();
  }


}
