import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './action-types';
import { filter, first, map, mergeMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Tokens } from './model/tokens.model';
import { UserEntityService } from '../shared/services/user-entity.service';
import { NotificationEntityService } from '../shared/services/notification-entity.service';
import { UIService } from '../shared/services/ui.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { selectCurrentLanguage } from '../shared/store/ui.reducer';
import { User } from '../shared/model/user.model';


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
                tap(action => {
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
        private uiService: UIService,
        private store: Store<AppState>
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
