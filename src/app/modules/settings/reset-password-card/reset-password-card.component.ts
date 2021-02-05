import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, mergeMap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { User } from 'src/app/shared/model/user.model';

@Component({
  selector: 'app-reset-password-card',
  templateUrl: './reset-password-card.component.html',
  styleUrls: ['./reset-password-card.component.css']
})
export class ResetPasswordCardComponent implements OnInit {
  isLoading$: Observable<boolean>;
  showConfirmMessage = false;
  currentUser$: Observable<User>;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUser);
  }

  sendPasswordResetRequest() {
    this.currentUser$
      .pipe(
        mergeMap((currentUser) => this.authService.sendPasswordResetRequest(currentUser.email)),
        first()
      )
      .subscribe((passwordResetRequestSent) => {
        if (passwordResetRequestSent) {
          this.showConfirmMessage = true;
        }
      }
      );
  }
}
