import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './action-types';
import { tap } from 'rxjs/operators';
import { UserEntityService } from '../../../shared/services/user-entity.service';
import { NotificationEntityService } from '../../../shared/services/notification-entity.service';
import { ChecklistEntityService } from 'src/app/modules/checklist/store/checklist-entity.service';
import { EventEntityService } from 'src/app/modules/calendar/store/event-entity.service';


@Injectable()
export class AuthEffects {

    login$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(AuthActions.login),
                tap(() => {
                    this.notificationEntityService.getAll();
                    this.userEntityService.getAll();
                })
            )
        ,
        { dispatch: false });

    logout$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(AuthActions.logout),
                tap(() => {
                    this.userEntityService.clearCache();
                    this.notificationEntityService.clearCache();
                    this.checklistEntityService.clearCache();
                    this.eventEntityService.clearCache();
                })
            )
        , { dispatch: false });


    constructor(
        private actions$: Actions,
        private userEntityService: UserEntityService,
        private notificationEntityService: NotificationEntityService,
        private checklistEntityService: ChecklistEntityService,
        private eventEntityService: EventEntityService
    ) {

    }


}
