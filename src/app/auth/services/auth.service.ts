import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UIService } from '../../shared/services/ui.service';

import { AuthData } from "../auth-data.model";
import { catchError, map, mapTo, take, tap } from 'rxjs/operators';
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
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  currentLang: string;

  constructor(
    private uiService: UIService,
    private store: Store<AppState>,
    private http: HttpClient,
    private router: Router
  ) { }


  login(authData: AuthData): Observable<User> {
    this.store.dispatch(UiActions.startLoading());
    return this.http.post<any>(`${env.apiUrl}/login`, authData)
      .pipe(
        take(1),
        tap(res => {
          const user: string = res.user;
          const tokens: Tokens = res.tokens;
          this.store.dispatch(AuthActions.login({ user, tokens }))
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

  registerUser(signupData): Observable<User> {
    this.store.dispatch(UiActions.startLoading());
    return this.http.post<User>(`${env.apiUrl}/user`, signupData)
      .pipe(
        take(1),
        tap(res => {
          this.login({ username: signupData.username, password: signupData.password } as AuthData).subscribe();
          this.store.dispatch(UiActions.stopLoading());
          this.router.navigateByUrl('/');
        }),
        catchError(error => {
          this.store.dispatch(UiActions.stopLoading());
          console.log('error', error.error);
          this.uiService.showSnackbar(error.error.code, null, 3000, 'error');
          return of(null);
        })
      );
  }

  logout() {
    return this.http.post<any>(`${env.apiUrl}/logout`, {'token': this.getRefreshToken()})
      .pipe(
        take(1),
        tap(res => {
          this.store.dispatch(AuthActions.logout());
        }),
        mapTo(true),
        catchError(error => {
          console.log('error', error.error);
          return of(false);
        }));
  }


  resetPassword(token, password): Observable<boolean> {
    this.store.dispatch(UiActions.startLoading());
    return this.http.post<any>(`${env.apiUrl}/reset-confirm/${token}`, { password })
      .pipe(
        take(1),
        tap(res => {
          this.store.dispatch(UiActions.stopLoading())
        })
      );
  }

  sendPasswordResetRequest(email): Observable<boolean> {
    this.store.dispatch(UiActions.startLoading());
    this.store.select(selectCurrentLanguage).subscribe((lang: string) => {
      this.currentLang = lang
    });
    return this.http.post<any>(`${env.apiUrl}/reset`, {lang: this.currentLang, email})
      .pipe(
        take(1),
        tap(res => this.store.dispatch(UiActions.stopLoading())),
        map(emailSent => emailSent.emailSent)
        );
  }

  refreshToken() {
    return this.http.post<any>(`${env.apiUrl}/token`, {
      'token': this.getRefreshToken()
    }).pipe(take(1),tap((tokens: Tokens) => {
      this.storeAccessToken(tokens.accessToken);
      this.storeRefreshToken(tokens.refreshToken);
    }));
  }

  getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
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

  validatePasswordResetLink(token: string): Observable<boolean> {
    return this.http.get<any>(`${env.apiUrl}/reset-confirm/${token}`)
      .pipe(
        take(1),
        map(res => res)
      );
  }

}
