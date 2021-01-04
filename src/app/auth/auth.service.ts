import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UIService } from '../shared/ui.service';

import { AuthData } from "./auth-data.model";
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from '../auth/auth.actions';
import { DbService } from '../shared/db.service';
import { authReducer } from './auth.reducer';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private uiService: UIService,
    private store: Store<fromRoot.State>,
    private dbService: DbService
  ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/']);
        this.dbService.getAndStoreUserById(user.uid);
        this.dbService.getAndStoreUserNotificationsByUserId(user.uid);
      } else {
        this.store.dispatch(new Auth.SetUnauthenticated());
        // this.router.navigate(['/login']);
      }
    })
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .signInWithEmailAndPassword(
        authData.email,
        authData.password
      )
      .then(result => {
        this.dbService.getAndStoreUserById(result.user.uid);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.code, null, 3000, 'error');
      });
  }

  registerUser(signupData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .createUserWithEmailAndPassword(
        signupData.email,
        signupData.password
      ).then(result => {
        this.dbService.createUser({
          userId: result.user.uid,
          email: signupData.email,
          username: signupData.username,
          lang: signupData.lang,
          birthdate: new Date(signupData.birthdate),
          createdOn: new Date(),
          updatedOn: new Date()
        });
        this.dbService.getAndStoreUserById(result.user.uid);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.code, null, 3000, 'error');
      });
  }

  updateEmail(oldEmail, password, newEmail) {
    this.store.dispatch(new UI.StartLoading());
    return new Promise((resolve, reject) => {
      this.afAuth
        .signInWithEmailAndPassword(oldEmail, password)
        .then((userCredential) => {
          userCredential.user.updateEmail(newEmail);
          this.uiService.showSnackbar('account_update_success', null, 3000, 'success');
          this.store.dispatch(new UI.StopLoading());
          resolve(true);
        })
        .catch(error => {
          this.uiService.showSnackbar(error.code, null, 3000, 'error');
          this.store.dispatch(new UI.StopLoading());
        })
      resolve(false);
    })
  }

  resetPassword(code, password) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .confirmPasswordReset(code, password)
      .then(() => {
        this.router.navigate(['login']);
        this.uiService.showSnackbar('reset_password_success', null, 3000, 'success');
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        this.uiService.showSnackbar(error.code, null, 3000, 'error');
        this.store.dispatch(new UI.StopLoading());
      });
  }

  sendPasswordResetRequest(email) {
    this.store.dispatch(new UI.StartLoading());
    return new Promise((resolve, reject) => {
      this.store.select(fromRoot.getCurrentLanguage).subscribe(currentLang => {
        firebase.default.auth().languageCode = currentLang;
      });
      this.afAuth.sendPasswordResetEmail(email).then(
        () => {
          this.store.dispatch(new UI.StopLoading());
          resolve(true);
        },
        error => {
          this.uiService.showSnackbar(error.code, null, 3000, 'error');
          this.store.dispatch(new UI.StopLoading());
          resolve(false);
        }
      );
    })
  }

  logout() {
    this.uiService.showStore();
    console.log('PASSSSSSSSSSS')
    this.router.navigate(['login']).then(() => {
      this.afAuth.signOut();
      this.store.dispatch(new UI.SetCurrentUser(null));
      this.store.dispatch(new UI.SetCurrentUserNotifications([]));
      console.log('PASSSSSSSSSSS 2')
      this.uiService.showStore();
    });
  }
}
