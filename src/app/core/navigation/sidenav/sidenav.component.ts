import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { UIService } from 'src/app/shared/services/ui.service';
import { getIsLoggedIn, getIsLoggedOut } from 'src/app/core/auth/store/auth.reducer';
import { getCurrentLanguage, getLanguages } from 'src/app/shared/store/ui.reducer';
import { AppState } from '../../store/app.reducer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>()
  currentLang$: Observable<string>;
  languages$: Observable<string[]>;
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private uiService: UIService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(getIsLoggedIn);
    this.isLoggedOut$ = this.store.select(getIsLoggedOut);
    this.currentLang$ = this.store.select(getCurrentLanguage);
    this.languages$ = this.store.select(getLanguages);
  }

  switchLang(newLang) {
    this.onClose();
    setTimeout(() => {
      this.uiService.switchLang(newLang);
    }, 400);
  }

  onClose() {
    this.sidenavClose.emit();
  }

  onLogout() {
    this.router.navigateByUrl('/login');
    this.onClose();
    this.authService.logout().subscribe();
  }
}
