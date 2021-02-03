import { Component, OnDestroy, OnInit } from '@angular/core';
import { UIService } from './shared/services/ui.service';
import { Observable } from 'rxjs';
import { User } from './shared/model/user.model';
import { Store } from '@ngrx/store';
import { AppState } from './core/store/app.reducer';
import { getIsLoggedIn } from './core/auth/store/auth.reducer';
import { SubscriptionManagerComponent } from './shared/subscription-manager/subscription-manager.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends SubscriptionManagerComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User>

  constructor(
    private uiService: UIService,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    this.store.select(getIsLoggedIn).pipe(takeUntil(this.ngDestroyed$)).subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.uiService.webSocketListener();
      }
    });
  }

  ngOnDestroy() {
    this.onDestroy();
  }

}
