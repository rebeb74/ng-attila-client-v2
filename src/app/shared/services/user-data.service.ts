import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator } from '@ngrx/data';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { AuthActions } from 'src/app/core/auth/store/action-types';
import { getCurrentUser, getSecretKey } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { User } from '../model/user.model';

@Injectable()
export class UserDataService extends DefaultDataService<User>{

    constructor(
        http: HttpClient,
        httpUrlGenerator: HttpUrlGenerator,
        config: DefaultDataServiceConfig,
        private store: Store<AppState>,
        private authService: AuthService
    ) {
        super('User', http, httpUrlGenerator, config);
    }

    getAll(): Observable<User[]> {
        return super.getAll()
            .pipe(
                withLatestFrom(this.store.select(getCurrentUser), this.store.select(getSecretKey)),
                map(([users, currentUser, secretKey]) => {
                    const currentUserUpdated = users.find((user) => user._id === currentUser._id);
                    this.store.dispatch(AuthActions.setCurrentUser({ user: currentUserUpdated }));
                    this.authService.storeCurrentUser(currentUserUpdated, secretKey);
                    return users;
                }),
            );
    }
}
