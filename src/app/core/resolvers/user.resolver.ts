import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, first, map, mergeMap, switchMap } from 'rxjs/operators';
import { AppState } from '../store/app.reducer';
import { AuthActions } from '../auth/store/action-types';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../../shared/model/user.model';
import { StorageService } from '../../shared/services/storage.service';
import { UIService } from '../../shared/services/ui.service';
import { NotificationEntityService } from '../../shared/services/notification-entity.service';
import { UserEntityService } from '../../shared/services/user-entity.service';


@Injectable()
export class UserResolver implements Resolve<boolean> {

    constructor(
        private userEntityService: UserEntityService,
        private notificationEntityService: NotificationEntityService,
        private store: Store<AppState>,
        private uiService: UIService,
        private authService: AuthService,
        private storageService: StorageService
    ) { }

    resolve(): Observable<boolean> {
        const accessToken: string = this.authService.getAccessToken();
        const isUser = localStorage.getItem('user');
        if (!!isUser) {
            return this.authService.getKey()
                .pipe(
                    map((key) => {
                        this.store.dispatch(AuthActions.setSecretKey({ key }));
                        const currentUser: User = JSON.parse(this.storageService.decryptData(localStorage.getItem('user'), key));
                        return currentUser;
                    }),
                    switchMap((currentUser) => this.userEntityService.loaded$.pipe(
                        mergeMap((userLoaded) => this.notificationEntityService.loaded$.pipe(
                            map((notificationsLoaded) => {
                                if (!userLoaded && !notificationsLoaded) {
                                    if (!!accessToken) {
                                        this.store.dispatch(AuthActions.login({ user: currentUser }));
                                    }
                                    this.uiService.initLang(currentUser.lang);
                                }
                                return userLoaded;
                            })
                        ))
                    )),
                    filter((userLoaded) => !!userLoaded),
                    first()
                );

        } else {
            this.uiService.initLang();
            return of(false);
        }
    }

}

