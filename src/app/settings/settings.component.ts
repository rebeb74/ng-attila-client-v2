import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UIService } from '../shared/services/ui.service';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { User } from '../shared/model/user.model';
import { DbService } from '../shared/services/db.service';
import { AuthService } from '../auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AskPasswordComponent } from './ask-password.component'
import { map, take } from 'rxjs/operators';
import { UserEntityService } from '../shared/services/user-entity.service';
import { selectCurrentLanguage, selectIsLoading, selectLanguages } from '../shared/store/ui.reducer';
import { AppState } from '../app.reducer';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  languages$: Observable<string[]>;
  currentLang$: Observable<string>;
  isLoading$: Observable<boolean>;
  accountForm: FormGroup;
  maxDate = new Date();
  minDate = new Date();
  showConfirmMessage = false;
  currentUser$: Observable<User>;
  currentUser: User;

  constructor(
    private uiService: UIService,
    private store: Store<AppState>,
    private dateAdapter: DateAdapter<any>,
    private db: DbService,
    private authService: AuthService,
    private dialog: MatDialog,
    private userDataService: UserEntityService
  ) { }

  ngOnInit(): void {

    this.languages$ = this.store.select(selectLanguages);
    this.currentLang$ = this.store.select(selectCurrentLanguage);
    this.currentLang$.subscribe(lang => this.datePickerLocale(lang));
    this.isLoading$ = this.store.select(selectIsLoading);
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 10);
    this.minDate.setFullYear(this.minDate.getFullYear() - 99);
    this.currentUser$ = this.userDataService.entities$.pipe(map((users) => users[0] as User), take(1));
    this.currentUser$.subscribe((user: User) => this.currentUser = user);

    this.accountForm = new FormGroup({
      email: new FormControl(this.currentUser.email, {
        validators: [Validators.required, Validators.email]
      }),
      username: new FormControl(this.currentUser.username, {
        validators: [Validators.required, Validators.pattern('.{4,}')]
      }),
      birthdate: new FormControl(this.currentUser.birthdate, {
        validators: [Validators.required]
      }),
    });
  }

  switchLang(newLang) {
    this.uiService.switchLang(newLang);
  }

  datePickerLocale(lang: string) {
    this.dateAdapter.setLocale(lang + '-' + lang.toUpperCase());
  }

  onUpdateAccount() {
    const dialogRef = this.dialog.open(AskPasswordComponent, {
    });
    dialogRef.afterClosed().subscribe(password => {
      if (password) {
        this.currentUser$.subscribe((user: User) => {
          this.authService
            .login({ username: user.username, password })
            .subscribe(
              (success) => {
                console.log('SUCCESS', success)
                if (!!success) {
                  const user: User = {
                    ...this.currentUser,
                    ...this.accountForm.value
                  }
                  this.userDataService.update(user)
                  this.uiService.showSnackbar('account_update_success', null, 3000, 'success');
                } else {
                  this.uiService.showSnackbar('account_update_failed', null, 3000, 'error');
                }
              },
              (error) => {
                this.uiService.showSnackbar(error, null, 3000, 'error');
              }
            );
        });
      }
    });
  }

  sendPasswordResetRequest() {
    this.userDataService.entities$.pipe(take(1), map(users => users[0])).subscribe((user: User) => {
      this.authService.sendPasswordResetRequest(user.email).then((result) => {
        if (result) {
          this.showConfirmMessage = true;
        }
      })
    }
    )
  };

  addnotif() {
    this.db.addNotification('Bertrand', 'friend_request');
  }
}
