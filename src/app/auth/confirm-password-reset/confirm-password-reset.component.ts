import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { AuthService } from '../services/auth.service';
import { selectIsLoading } from 'src/app/shared/store/ui.reducer';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-confirm-password-reset',
  templateUrl: './confirm-password-reset.component.html',
  styleUrls: ['./confirm-password-reset.component.css']
})
export class ConfirmPasswordResetComponent implements OnInit {
  isLoading$: Observable<boolean>;
  frmSetNewPassword: FormGroup; 

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.frmSetNewPassword = new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.pattern('.{4,}')]
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required]
      })
    });
  }

  setPassword() {
    const password = this.frmSetNewPassword.controls['password'].value;
    const confirmPassword = this.frmSetNewPassword.controls['confirmPassword'].value;

    if (password !== confirmPassword) {
      // react to error
      return;
    }

    const code = this.route.snapshot.queryParams['oobCode'];
    this.authService.resetPassword(code, password);
  }
}
