import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './action-types';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Tokens } from './model/tokens.model';
import { UserEntityService } from '../shared/services/user-entity.service';
import { NotificationEntityService } from '../shared/services/notification-entity.service';


@Injectable()
export class AuthEffects {

    private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
    private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

    login$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(AuthActions.login),
                tap(action => {
                    this.storeTokensAndUser(action.tokens, action.user);
                    this.notificationDataService.getAll();
                    this.userDataService.getAll()
                })
            )
        ,
        { dispatch: false });

    logout$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(AuthActions.logout),
                tap(() => {
                    this.router.navigateByUrl('/login').then(() => {
                        this.userDataService.clearCache();
                        this.notificationDataService.clearCache();
                        this.removeTokens();
                    });
                })
            )
        , { dispatch: false });


    constructor(
        private actions$: Actions,
        private router: Router,
        private userDataService: UserEntityService,
        private notificationDataService: NotificationEntityService,
    ) {

    }

    private storeTokensAndUser(tokens: Tokens, user: string) {
        localStorage.setItem(this.ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
    }

    private removeTokens() {
        localStorage.removeItem(this.ACCESS_TOKEN);
        localStorage.removeItem(this.REFRESH_TOKEN);
        localStorage.removeItem('user');
    }
}
