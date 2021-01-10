import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UIService } from '../../shared/services/ui.service';

import { AuthData } from "../auth-data.model";
import * as fromRoot from '../../app.reducer';
import * as UI from '../../shared/store/ui.actions';
import * as Auth from '../auth.actions';
import { DbService } from '../../shared/services/db.service';
import { authReducer, selectIsLoggedIn } from '../auth.reducer';
import * as firebase from 'firebase/app';
import { catchError, mapTo, take, tap } from 'rxjs/operators';
// import { AppState } from '../../app.reducer';
import { AuthActions } from '../action-types';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/model/user.model';
import { environment as env } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Tokens } from '../model/tokens.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private uiService: UIService,
    private store: Store<fromRoot.State>,
    private dbService: DbService,
    private http: HttpClient
  ) { }

  initAuthListener() {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        // this.store.dispatch(AuthActions.login({user}));
        this.router.navigate(['/']);
        this.dbService.getAndStoreUserById(user.uid);
        this.dbService.getAndStoreUserNotificationsByUserId(user.uid);
      } else {
        this.router.navigate(['/login']);
      }
    })
  }

  login(authData: AuthData): Observable<User> {
    return this.http.post<any>(`${env.apiUrl}/login`, authData)
      .pipe(
        tap(res => {
          const user: string = res.user;
          const tokens: Tokens = res.tokens;
          this.store.dispatch(AuthActions.login({ user, tokens }))
          this.router.navigateByUrl('/');
        }),
        catchError(error => {
          console.log('error', error.error);
          return of(null);
        })
      );
    // this.store.dispatch(new UI.StartLoading());
    // this.afAuth
    //   .signInWithEmailAndPassword(
    //     authData.email,
    //     authData.password
    //   )
    //   .then(result => {
    //     this.store.dispatch(new UI.StopLoading());
    //   })
    //   .catch(error => {
    //     this.store.dispatch(new UI.StopLoading());
    //     this.uiService.showSnackbar(error.code, null, 3000, 'error');
    //   });
  }

  registerUser(signupData): Observable<User> {
    console.log('signupData', signupData)
    return this.http.post<User>(`${env.apiUrl}/user`, signupData)
      .pipe(
        tap(res => {
          console.log('REGISTER RES', res)
          this.login({ username: signupData.username, password: signupData.password } as AuthData).subscribe()
        }),
        catchError(error => {
          console.log('error', error.error);
          return of(null);
        })
      );

    // this.store.dispatch(new UI.StartLoading());
    // this.afAuth
    //   .createUserWithEmailAndPassword(
    //     signupData.email,
    //     signupData.password
    //   ).then(result => {
    //     this.dbService.createUser({
    //       _id: result.user.uid,
    //       email: signupData.email,
    //       username: signupData.username,
    //       lang: signupData.lang,
    //       birthdate: new Date(signupData.birthdate).toISOString(),
    //       createdOn: new Date().toISOString(),
    //       updatedOn: new Date().toISOString()
    //     });
    //     this.store.dispatch(new UI.StopLoading());
    //   })
    //   .catch(error => {
    //     this.store.dispatch(new UI.StopLoading());
    //     this.uiService.showSnackbar(error.code, null, 3000, 'error');
    //   });
  }

  logout() {
    this.store.dispatch(new UI.SetCurrentUser(null));
    this.store.dispatch(new UI.SetCurrentUserNotifications([]));
    return this.http.post<any>(`${env.apiUrl}/logout`, {
      'token': this.getRefreshToken()
    })
      .pipe(
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
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
          resolve(false);
        })
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

  refreshToken() {
    return this.http.post<any>(`${env.apiUrl}/token`, {
      'token': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeAccessToken(tokens.accessToken);
      this.storeRefreshToken(tokens.refreshToken);
    }));
  }



  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeAccessToken(accessToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
  }

  private storeRefreshToken(refreshToken: string) {
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
  }

}
