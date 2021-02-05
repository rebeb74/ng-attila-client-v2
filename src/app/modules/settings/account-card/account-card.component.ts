import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { User } from 'src/app/shared/model/user.model';
import { getIsLoading } from 'src/app/shared/store/ui.reducer';
import { SubscriptionManagerComponent } from 'src/app/shared/subscription-manager/subscription-manager.component';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.scss']
})
export class AccountCardComponent extends SubscriptionManagerComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User>;
  isLoading$: Observable<boolean>;
  accountForm: FormGroup;
  maxDate = new Date();
  minDate = new Date();

  constructor(
    private store: Store<AppState>,
    private settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUser);
    this.isLoading$ = this.store.select(getIsLoading);
    this.setAccountForm();
  }

  setAccountForm() {
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 10);
    this.minDate.setFullYear(this.minDate.getFullYear() - 99);

    this.currentUser$.pipe(takeUntil(this.ngDestroyed$)).subscribe((user: User) => {
      this.accountForm = new FormGroup({
        email: new FormControl(user.email, {
          validators: [Validators.required, Validators.email]
        }),
        username: new FormControl(user.username, {
          validators: [Validators.required, Validators.pattern('.{4,}')]
        }),
        birthdate: new FormControl(user.birthdate, {
          validators: [Validators.required]
        }),
      });
    });
  }

  onUpdateAccount() {
    this.settingsService.onUpdateAccount(this.accountForm).subscribe();
  }

  onDestroy() {
    this.onDestroy();
  }
}
