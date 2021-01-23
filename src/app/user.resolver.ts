import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { filter, first, map, withLatestFrom } from "rxjs/operators";
import { AppState } from "./app.reducer";
import { AuthActions } from "./auth/action-types";
import { Tokens } from "./auth/model/tokens.model";
import { NotificationEntityService } from "./shared/services/notification-entity.service";
import { UserEntityService } from "./shared/services/user-entity.service";



@Injectable()
export class UserResolver implements Resolve<boolean> {

    constructor(
        private userDataService: UserEntityService,
        private notificationDataService: NotificationEntityService,
        private store: Store<AppState>
    ) { }

    resolve(): Observable<boolean> {
        const tokens: Tokens = {
            accessToken: localStorage.getItem('ACCESS_TOKEN'),
            refreshToken: localStorage.getItem('REFRESH_TOKEN')
        }
        const userId: string = JSON.parse(localStorage.getItem('user'))
        if (!!userId) {
            return this.userDataService.loaded$
                .pipe(
                    withLatestFrom(this.notificationDataService.loaded$),
                    map(([userLoaded, notificationsLoaded]) => {
                        if (!userLoaded && !notificationsLoaded) {
                            if (tokens.accessToken) {
                                this.store.dispatch(AuthActions.login({ user: userId, tokens }));
                            }
                        }
                        return userLoaded;
                    }),
                    filter(userLoaded => !!userLoaded),
                    first()
                );
        } else {
            return of(false);
        }
    }

}