import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './action-types';
import { tap } from 'rxjs/operators';
import { UserEntityService } from '../shared/store/user-entity.service';
import { NotificationEntityService } from '../shared/store/notification-entity.service';


@Injectable()
export class AuthEffects {

    login$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(AuthActions.login),
                tap(() => {
                    this.notificationDataService.getAll();
                    this.userDataService.getAll();
                })
            )
        ,
        { dispatch: false });

    logout$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(AuthActions.logout),
                tap(() => {
                    this.userDataService.clearCache();
                    this.notificationDataService.clearCache();

                })
            )
        , { dispatch: false });


    constructor(
        private actions$: Actions,
        private userDataService: UserEntityService,
        private notificationDataService: NotificationEntityService,
    ) {

    }


}
