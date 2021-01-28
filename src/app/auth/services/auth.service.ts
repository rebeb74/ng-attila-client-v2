import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UIService } from '../../shared/services/ui.service';

import { AuthData } from '../auth-data.model';
import { catchError, concatMap, first, map, mapTo, tap } from 'rxjs/operators';
import { AuthActions } from '../action-types';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/model/user.model';
import { environment as env } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Tokens } from '../model/tokens.model';
import { of } from 'rxjs';
import { UiActions } from 'src/app/shared/store/action-types';
import { getCurrentLanguage } from 'src/app/shared/store/ui.reducer';
import { AppState } from '../../app.reducer';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { UserSocketService } from 'src/app/shared/services/user-socket.service';
import { NotificationSocketService } from 'src/app/shared/services/notification-socket.service';

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
    private router: Router,
    private storageService: StorageService,
    private userSocketService: UserSocketService,
    private NotificationSocketService: NotificationSocketService
  ) { }


  login(authData: AuthData): Observable<User> {
    this.store.dispatch(UiActions.startLoading());
    return this.http.post<any>(`${env.apiUrl}/login`, authData)
      .pipe(
        first(),
        tap((loginRes) => {
          const user: User = loginRes.user;
          const tokens: Tokens = loginRes.tokens;
          this.storeTokensAndUser(tokens, user);
          this.store.dispatch(AuthActions.login({ user }));
          this.store.dispatch(UiActions.stopLoading());
        }),
        catchError((error) => {
          this.store.dispatch(UiActions.stopLoading());
          console.log('error', error.error);
          this.uiService.showSnackbar(error.error.message, null, 5000, 'error');
          return of(null);
        })
      );
  }

  registerUser(signupData): Observable<User> {
    this.store.dispatch(UiActions.startLoading());
    return this.http.post<User>(`${env.apiUrl}/user`, signupData)
      .pipe(
        first(),
        concatMap(() => this.login({ username: signupData.username, password: signupData.password } as AuthData)),
        tap(() => {
          this.store.dispatch(UiActions.stopLoading());
          this.router.navigateByUrl('/');
        }),
        catchError((error) => {
          this.store.dispatch(UiActions.stopLoading());
          console.log('error', error.error);
          this.uiService.showSnackbar(error.error.code, null, 5000, 'error');
          return of(null);
        })
      );
  }

  logout() {
    return this.http.post<any>(`${env.apiUrl}/logout`, { 'token': this.getRefreshToken() })
      .pipe(
        first(),
        tap(() => {
          this.removeTokens();
          this.store.dispatch(AuthActions.logout());
          this.userSocketService.disconnect();
          this.NotificationSocketService.disconnect();
        }),
        mapTo(true),
        catchError((error) => {
          console.log('error', error.error);
          return of(false);
        }));
  }

  getKey(): Observable<any> {
    return this.http.get<any>(`${env.apiUrl}/key`);
  }


  resetPassword(token, password): Observable<boolean> {
    this.store.dispatch(UiActions.startLoading());
    return this.http.post<any>(`${env.apiUrl}/reset-confirm/${token}`, { password })
      .pipe(
        first(),
        tap(() => {
          this.store.dispatch(UiActions.stopLoading());
        })
      );
  }

  sendPasswordResetRequest(email): Observable<boolean> {
    this.store.dispatch(UiActions.startLoading());
    this.store.select(getCurrentLanguage).subscribe((lang: string) => {
      this.currentLang = lang;
    });
    return this.http.post<any>(`${env.apiUrl}/reset`, { lang: this.currentLang, email })
      .pipe(
        first(),
        tap(() => this.store.dispatch(UiActions.stopLoading())),
        map((emailSent) => emailSent.emailSent)
      );
  }

  refreshToken() {
    return this.http.post<any>(`${env.apiUrl}/token`, {
      'token': this.getRefreshToken()
    }).pipe(first(), tap((tokens: Tokens) => {
      this.storeAccessToken(tokens.accessToken);
      this.storeRefreshToken(tokens.refreshToken);
    }));
  }

  getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  validatePasswordResetLink(token: string): Observable<boolean> {
    return this.http.get<any>(`${env.apiUrl}/reset-confirm/${token}`)
      .pipe(
        first(),
        map((res) => res)
      );
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

  private storeCurrentUser(user: User) {
    this.getKey().subscribe((key) => {
      localStorage.setItem('user', this.storageService.encryptData(JSON.stringify(user), key));
    });
  }


  private storeTokensAndUser(tokens: Tokens, user: User) {
    this.storeAccessToken(tokens.accessToken);
    this.storeRefreshToken(tokens.refreshToken);
    this.storeCurrentUser(user);
  }

  private removeTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem('user');
  }
}
