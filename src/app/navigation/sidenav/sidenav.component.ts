import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/auth.service';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>()
  isAuth$: Observable<boolean>;
  currentLang$: Observable<string>;
  languages$: Observable<string[]>;
  
  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService,
    private uiService: UIService
  ) {
    this.uiService.initLang();
  }

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
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
