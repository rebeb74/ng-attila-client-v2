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
import { UiActions } from 'src/app/shared/store/action-types';
import { selectCurrentLanguage } from 'src/app/shared/store/ui.reducer';
import { AppState } from '../../app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private uiService: UIService,
    private store: Store<AppState>,
    private http: HttpClient,
  ) { }


  login(authData: AuthData): Observable<User> {
    this.store.dispatch(UiActions.startLoading());
    return this.http.post<any>(`${env.apiUrl}/login`, authData)
      .pipe(
        tap(res => {
          console.log('res', res)
          const user: string = res.user;
          const tokens: Tokens = res.tokens;
          this.store.dispatch(AuthActions.login({ user, tokens }))
          this.store.dispatch(UiActions.stopLoading());
        }),
        catchError(error => {
          this.store.dispatch(UiActions.stopLoading());
          console.log('error2', error.error);
          this.uiService.showSnackbar(error.error.message, null, 3000, 'error');
          return of(null);
        })
      );
  }

  registerUser(signupData): Observable<User> {
    this.store.dispatch(UiActions.startLoading());
    return this.http.post<User>(`${env.apiUrl}/user`, signupData)
      .pipe(
        tap(res => {
          console.log('REGISTER RES', res)
          this.login({ username: signupData.username, password: signupData.password } as AuthData).subscribe();
          this.store.dispatch(UiActions.stopLoading());
        }),
        catchError(error => {
          this.store.dispatch(UiActions.stopLoading());
          console.log('error', error.error);
          this.uiService.showSnackbar(error.error.message, null, 3000, 'error');
          return of(null);
        })
      );
  }

  logout() {
    return this.http.post<any>(`${env.apiUrl}/logout`, {'token': this.getRefreshToken()})
      .pipe(
        tap(res => {
          this.store.dispatch(AuthActions.logout());
        }),
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
  }


  resetPassword(code, password) {
    this.store.dispatch(UiActions.startLoading());
    this.afAuth
      .confirmPasswordReset(code, password)
      .then(() => {
        this.router.navigate(['login']);
        this.uiService.showSnackbar('reset_password_success', null, 3000, 'success');
        this.store.dispatch(UiActions.stopLoading());
      })
      .catch(error => {
        this.uiService.showSnackbar(error.code, null, 3000, 'error');
        this.store.dispatch(UiActions.stopLoading());
      });
  }

  sendPasswordResetRequest(email) {
    this.store.dispatch(UiActions.startLoading());
    return new Promise((resolve, reject) => {
      this.store.select(selectCurrentLanguage).subscribe(currentLang => {
        firebase.default.auth().languageCode = currentLang;
      });
      this.afAuth.sendPasswordResetEmail(email).then(
        () => {
          this.store.dispatch(UiActions.stopLoading());
          resolve(true);
        },
        error => {
          this.uiService.showSnackbar(error.code, null, 3000, 'error');
          this.store.dispatch(UiActions.stopLoading());
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
    console.log('PAS')
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeAccessToken(accessToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
  }

  private storeRefreshToken(refreshToken: string) {
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
  }

}
