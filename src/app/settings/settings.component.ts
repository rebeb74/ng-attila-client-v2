import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UIService } from '../shared/services/ui.service';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Share, User } from '../shared/model/user.model';
import { AuthService } from '../auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AskPasswordComponent } from './ask-password.component'
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import { UserEntityService } from '../shared/services/user-entity.service';
import { selectCurrentLanguage, selectIsLoading, selectLanguages } from '../shared/store/ui.reducer';
import { AppState } from '../app.reducer';
import { NotificationEntityService } from '../shared/services/notification-entity.service';
import { AskNewShareUserComponent } from './ask-new-share-user.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
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
  userId: string = JSON.parse(localStorage.getItem('user'))
  currentUserShareNotValid$: Observable<Share[]>
  currentUserShareValid$: Observable<Share[]>


  constructor(
    private uiService: UIService,
    private store: Store<AppState>,
    private dateAdapter: DateAdapter<any>,
    private authService: AuthService,
    private dialog: MatDialog,
    private userDataService: UserEntityService,
    private notificationDataService: NotificationEntityService
  ) { }

  ngOnInit(): void {
    const userId: string = JSON.parse(localStorage.getItem('user'))
    this.languages$ = this.store.select(selectLanguages);
    this.currentLang$ = this.store.select(selectCurrentLanguage);
    this.currentLang$.subscribe(lang => this.datePickerLocale(lang));
    this.isLoading$ = this.store.select(selectIsLoading);
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 10);
    this.minDate.setFullYear(this.minDate.getFullYear() - 99);
    this.currentUser$ = this.userDataService.entities$.pipe(map((users: User[]) => users.find((user: User) => user._id === userId)), take(1));
    this.currentUser$.subscribe((user: User) => this.currentUser = user);


    this.currentUserShareValid$ = this.userDataService.entities$
      .pipe(
        map(users => {
          const currentUser = users.find(user => user._id === this.userId);
          var shareValid: Share[] = []
          currentUser.share.forEach(share => {
            const shareUser = users.find(user => user._id === share.userId);
            shareUser.share.forEach(shareUserShare => {
              if (shareUserShare.userId === currentUser._id) {
                shareValid.push({
                  userId: shareUser._id,
                  email: shareUser.email,
                  username: shareUser.username
                });
              }
            });
          });
          return shareValid;
        })
      );
    this.currentUserShareNotValid$ = this.userDataService.entities$
      .pipe(
        withLatestFrom(this.currentUserShareValid$),
        map(([users, allShareValid]) => {
          const currentUser = users.find(user => user._id === this.userId);
          const shareNotValid: Share[] = currentUser.share.filter(share => !allShareValid.find(shareValid => shareValid.userId === share.userId));
          return shareNotValid;
        })
      );

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
    const askPassword = this.dialog.open(AskPasswordComponent, {
    });
    askPassword.afterClosed().subscribe(password => {
      if (password) {
        this.currentUser$.subscribe((user: User) => {
          this.authService
            .login({ username: user.username, password })
            .pipe(take(1))
            .subscribe(
              (success) => {
                if (!!success) {
                  const user: User = {
                    ...this.currentUser,
                    ...this.accountForm.value
                  }
                  this.userDataService.update(user).subscribe(
                    (success) => {
                      this.uiService.showSnackbar('account_update_success', null, 3000, 'success');
                    },
                    (error) => {
                      this.accountForm.patchValue(this.currentUser);
                      this.uiService.showSnackbar(error.error.error.code, null, 3000, 'error');
                    }
                  );
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

  addnotif() {
    this.uiService.addNotification(this.userId, '5ffde8802fddc7503cf3def0', 'friend_request');
  }

  sendPasswordResetRequest() {
    this.userDataService.entities$.pipe(take(1), map(users => users.find(user => user._id === this.userId))).subscribe((user: User) => {
      this.authService.sendPasswordResetRequest(user.email).subscribe(
        (result) => {
          if (result) {
            this.showConfirmMessage = true;
          }
        })
    }
    )
  };

  addShareUser() {
    const askNewShareUser = this.dialog.open(AskNewShareUserComponent, {
      data: {
      }
    });
    askNewShareUser.afterClosed().subscribe(newShareUsername => {

      if (newShareUsername) {
        this.userDataService.entities$.pipe(take(1)).subscribe(
          allUsers => {
            if (allUsers.find(user => user.username === newShareUsername) === undefined) {
              this.uiService.showSnackbar('user_not_found', null, 3000, 'error');
            } else {
              const currentUser: User = allUsers.find(user => user._id === this.userId);
              if (newShareUsername === currentUser.username) {
                return;
              }
              const newShareUser: User = allUsers.find(user => user.username === newShareUsername);
              var newShare = JSON.parse(JSON.stringify(currentUser.share));
              newShare.push({
                userId: newShareUser._id,
                email: newShareUser.email,
                username: newShareUser.username
              });
              const user: User = {
                ...currentUser,
                share: newShare
              }
              this.userDataService.update(user);
              this.uiService.addNotification(newShareUser._id, currentUser._id, 'friend_request');
            }
          }
        )
      }
    });
  }

  removeShareUser() {

  }
}
