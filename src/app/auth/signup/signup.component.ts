import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core'; 

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import * as fromRoot from '../../app.reducer';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  maxDate = new Date();
  minDate = new Date();
  isLoading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>,
    private uiService: UIService,
    private dateAdapter: DateAdapter<any>
  ) { }

  ngOnInit() {
    // this.translate();
    this.store.select(fromRoot.getCurrentLanguage).subscribe(lang => this.datePickerLocale(lang));
    this.uiService.setCurrentPageName('signup');
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
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
    this.store.select(fromRoot.getCurrentLanguage).subscribe(currentLang => {
      this.authService.registerUser({
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        username: this.signupForm.value.username,
        birthdate: this.signupForm.value.birthdate,
        lang: currentLang
      });
    });
  }

  datePickerLocale(lang: string) {
    this.dateAdapter.setLocale(lang + '-' + lang.toUpperCase());
  } 

}
