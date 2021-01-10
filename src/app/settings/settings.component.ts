import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UIService } from '../shared/services/ui.service';
import * as fromRoot from '../app.reducer';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { User } from '../shared/model/user.model';
import { DbService } from '../shared/services/db.service';
import { AuthService } from '../auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AskPasswordComponent } from './ask-password.component'
import { map, take, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { UserEntityService } from '../shared/services/user-entity.service';

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
    private store: Store<fromRoot.State>,
    private dateAdapter: DateAdapter<any>,
    private db: DbService,
    private authService: AuthService,
    private dialog: MatDialog,
    private userDataService: UserEntityService
  ) { }

  ngOnInit(): void {

    this.uiService.setCurrentPageName('settings');
    this.store.select(fromRoot.getCurrentLanguage).subscribe(lang => this.datePickerLocale(lang));
    this.languages$ = this.store.select(fromRoot.getLanguages);
    this.currentLang$ = this.store.select(fromRoot.getCurrentLanguage);
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 10);
    this.minDate.setFullYear(this.minDate.getFullYear() - 99);
    this.currentUser$ = this.userDataService.entities$.pipe(
      map((users) => users[0] as User),
      take(1)
    )
    this.currentUser$.subscribe((user: User) => this.currentUser = user)

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
          this.authService
            .updateEmail(this.currentUser.email, password, this.accountForm.value.email)
            .then((result) => {
              if (result) {
                const user: User = {
                  ...this.currentUser,
                  ...this.accountForm.value
                }
                this.userDataService.update(user)
                // this.db.updateUserById(this.currentUser.userId, {
                //   ...this.currentUser,
                //   email: this.accountForm.value.email,
                //   username: this.accountForm.value.username,
                //   birthdate: this.accountForm.value.birthdate,
                //   updatedOn: new Date().toISOString()
                // });
              }
            })
        }
      });
    // this.store.select(fromRoot.getCurrentUser).pipe(take(1)).subscribe(user => {
    //   const dialogRef = this.dialog.open(AskPasswordComponent, {
    //   });
    //   dialogRef.afterClosed().subscribe(password => {
    //     if (password) {
    //       this.authService
    //         .updateEmail(user.email, password, this.accountForm.value.email)
    //         .then((result) => {
    //           if (result) {
    //             this.db.updateUserById(user.userId, {
    //               ...user,
    //               email: this.accountForm.value.email,
    //               username: this.accountForm.value.username,
    //               birthdate: this.accountForm.value.birthdate,
    //               updatedOn: new Date().toISOString()
    //             });
    //           }
    //         })
    //     }
    //   });
    // });
  }

  sendPasswordResetRequest() {
    this.store.select(fromRoot.getCurrentUser).pipe(take(1)).subscribe((user: User) => {
      this.authService.sendPasswordResetRequest(user.email).then((result) => {
        if (result) {
          this.showConfirmMessage = true;
        }
      })
    }
    )
  };

  addnotif() {
    this.db.addNotification('bertrandpetit10@gmail.com', 'friend_request');
  }
}
