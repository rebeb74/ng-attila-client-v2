import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { getCurrentLanguage, getIsLoading } from 'src/app/shared/store/ui.reducer';
import { AppState } from '../../../store/app.reducer';
import { SubscriptionManagerComponent } from 'src/app/shared/subscription-manager/subscription-manager.component';
import { first, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent extends SubscriptionManagerComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  maxDate = new Date();
  minDate = new Date();
  isLoading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private dateAdapter: DateAdapter<any>,
  ) {
    super();
  }

  ngOnInit() {
    this.store.select(getCurrentLanguage).pipe(takeUntil(this.ngDestroyed$)).subscribe((lang) => this.datePickerLocale(lang));
    this.isLoading$ = this.store.select(getIsLoading);
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 10);
    this.minDate.setFullYear(this.minDate.getFullYear() - 99);
    this.signupForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      username: new FormControl('', {
        validators: [Validators.required, Validators.pattern('.{4,}')]
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.pattern('.{6,}')]
      }),
      birthdate: new FormControl('', {
        validators: [Validators.required]
      })
    });
  }

  onSubmit() {
    this.store.select(getCurrentLanguage).pipe(takeUntil(this.ngDestroyed$)).subscribe((currentLang) => {
      this.authService.registerUser({
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        username: this.signupForm.value.username,
        birthdate: this.signupForm.value.birthdate,
        lang: currentLang.toString()
      }).pipe(first()).subscribe();
    });
  }

  datePickerLocale(lang: string) {
    this.dateAdapter.setLocale(lang + '-' + lang.toUpperCase());
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}
