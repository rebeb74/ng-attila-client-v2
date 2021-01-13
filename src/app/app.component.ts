import { Component, OnInit } from '@angular/core';
import { UIService } from './shared/services/ui.service';
import { Observable } from 'rxjs';
import { User } from './shared/model/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/core';
import { AuthActions } from './auth/action-types';
import { Tokens } from './auth/model/tokens.model';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser$: Observable<User>
  loading = true;

  constructor(
    private uiService: UIService,
    private store: Store<AppState>,
    private router: Router
  ) {
  }

  ngOnInit() {
    // this.router.navigateByUrl('/')

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
