import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core'; 
import { User } from '../auth/user.model';
import { DbService } from '../shared/db.service';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AskPasswordComponent } from './ask-password.component'
import { take } from 'rxjs/operators';

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

  constructor(
    private uiService: UIService,
    private store: Store<fromRoot.State>,
    private dateAdapter: DateAdapter<any>,
    private db: DbService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    
    this.uiService.setCurrentPageName('settings');
    this.store.select(fromRoot.getCurrentLanguage).subscribe(lang => this.datePickerLocale(lang));
    this.languages$ = this.store.select(fromRoot.getLanguages);
    this.currentLang$ = this.store.select(fromRoot.getCurrentLanguage);
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 10);
    this.minDate.setFullYear(this.minDate.getFullYear() - 99);
    this.store.select(fromRoot.getCurrentUser).pipe(take(1)).subscribe((user: User) => {
      this.accountForm = new FormGroup({
        email: new FormControl(user.email, {
          validators: [Validators.required, Validators.email]
        }),
        username: new FormControl(user.username, {
          validators: [Validators.required, Validators.pattern('.{4,}')]
        }),
        birthdate: new FormControl(new Date(user.birthdate), {
          validators: [Validators.required]
        }),
      });
    })
  }

  switchLang(newLang) {
    this.uiService.switchLang(newLang);
  }

  datePickerLocale(lang: string) {
    this.dateAdapter.setLocale(lang + '-' + lang.toUpperCase());
  } 

  onUpdateAccount() {
    this.store.select(fromRoot.getCurrentUser).subscribe(user => {
      const dialogRef = this.dialog.open(AskPasswordComponent, {
      });
      dialogRef.afterClosed().subscribe(password => {
        if (password){
          this.authService
          .updateEmail(user.email, password, this.accountForm.value.email)
          .then((result) => {
            if(result) {
              this.db.updateUserById(user.userId, {
                ...user,
                email: this.accountForm.value.email,
                username: this.accountForm.value.username,
                birthdate: this.accountForm.value.birthdate,
                updatedOn: new Date()
              });
            }
          })
        }
      });
    });
  }

  sendPasswordResetRequest() {
    this.store.select(fromRoot.getCurrentUser).subscribe((user: User) => {
      this.authService.sendPasswordResetRequest(user.email).then((result) => {
        if (result) {
          this.showConfirmMessage = true;
        }
      })
    }
    )};
    
    addnotif() {
      this.db.addNotification('bertrandpetit10@gmail.com', 'friend_request');
    }
}
