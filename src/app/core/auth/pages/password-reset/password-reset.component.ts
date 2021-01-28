import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth.service';
import { getIsLoading } from 'src/app/shared/store/ui.reducer';
import { AppState } from '../../../store/app.reducer';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  isLoading$: Observable<boolean>;
  frmPasswordReset: FormGroup;
  showConfirmMessage = false;


  constructor(
    private store: Store<AppState>,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(getIsLoading);
    this.frmPasswordReset = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      })
    });
  }

  sendPasswordResetRequest() {
    const email = this.frmPasswordReset.controls['email'].value;

    this.authService.sendPasswordResetRequest(email).subscribe((result) => {
      if (result) {
        this.showConfirmMessage = true;
      }
    });
  }
}
