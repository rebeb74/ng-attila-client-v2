import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { UserEntityService } from './shared/services/user-entity.service';
import { UIService } from './shared/services/ui.service';
import { Observable } from 'rxjs';
import { User } from './shared/model/user.model';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/core';
import { AuthActions } from './auth/action-types';
import { Tokens } from './auth/model/tokens.model';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { selectIsLoggedIn } from './auth/auth.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser$: Observable<User>
  loading = true;

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private userDataService: UserEntityService,
    private store: Store<AppState>,
    private router: Router
  ) {
  }

  ngOnInit() {
    const tokens: Tokens = {
      accessToken: localStorage.getItem('ACCESS_TOKEN'),
      refreshToken: localStorage.getItem('REFRESH_TOKEN')
    }
    const user: string = JSON.parse(localStorage.getItem('user'))
    if (tokens.accessToken) {
      this.store.dispatch(AuthActions.login({ user, tokens }));
    }

    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });

    this.uiService.initLang();
 
  }

}
