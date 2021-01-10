import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UIService } from 'src/app/shared/services/ui.service';
import { selectIsLoggedIn, selectIsLoggedOut } from 'src/app/auth/auth.reducer';

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
    private store: Store<fromRoot.State>,
    private authService: AuthService,
    private uiService: UIService
  ) {
    this.uiService.initLang();
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.isLoggedOut$ = this.store.select(selectIsLoggedOut);
    this.currentLang$ = this.store.select(fromRoot.getCurrentLanguage);
    this.languages$ = this.store.select(fromRoot.getLanguages);
  }

  switchLang(newLang) {
    this.uiService.switchLang(newLang);
    this.onClose();
  }

  onClose(){
    this.sidenavClose.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }
}
