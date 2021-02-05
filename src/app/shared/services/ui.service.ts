import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, first, map, mergeMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { UserEntityService } from './user-entity.service';
import { UiActions } from '../store/action-types';
import { getCurrentLanguage, getLanguages } from '../store/ui.reducer';
import { AppState } from '../../core/store/app.reducer';
import { NotificationEntityService } from './notification-entity.service';
import { NotificationSocketService } from './notification-socket.service';
import { UserSocketService } from './user-socket.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { SubscriptionManagerComponent } from '../subscription-manager/subscription-manager.component';


@Injectable()
export class UIService extends SubscriptionManagerComponent implements OnDestroy {
    currentUserId: string;

    constructor(
        public translate: TranslateService,
        private snackbar: MatSnackBar,
        private store: Store<AppState>,
        private userDataService: UserEntityService,
        private notificationDataService: NotificationEntityService,
        private notificationSocketService: NotificationSocketService,
        private userSocketService: UserSocketService,
        private http: HttpClient,
    ) {
        super();
    }

    getCurrentUserId() {
        return this.currentUserId;
    }

    setCurrentUserId(userId) {
        this.currentUserId = userId;
    }

    initLang(lang?: string) {
        this.store.select(getLanguages).pipe(takeUntil(this.ngDestroyed$)).subscribe((languages) => this.translate.addLangs(languages));
        this.store.select(getCurrentLanguage).pipe(first()).subscribe((currentLanguage) => {
            if (!!lang) {
                this.translate.setDefaultLang(lang);
                this.store.dispatch(UiActions.setCurrentLanguage({ currentLanguage: lang }));
            } else {
                this.translate.setDefaultLang(currentLanguage);
            }
        }
        );
    }

    showSnackbar(message: string, option: string, duration: number, type: string) {
        let panelType: any;
        switch (type) {
            case 'error':
                panelType = ['mat-toolbar', 'mat-warn'];
                break;
            case 'success':
                panelType = ['mat-toolbar', 'mat-accent'];
                break;
        }
        const translatedMessage = this.translate.instant(message);
        this.snackbar.open(translatedMessage, option, { duration: duration, panelClass: panelType });
    }

    switchLang(newLang: string) {
        this.store.dispatch(UiActions.setCurrentLanguage({ currentLanguage: newLang }));
        this.translate.use(newLang);
        this.store.select(getCurrentUser).pipe(first()).subscribe((user) => {
            if (user) {
                this.userDataService.update({ ...user, lang: newLang });
            }
        });
    }

    addNotification(targetUserId: string, senderUserId: string, code: string) {
        this.userDataService.entities$
            .pipe(
                map((users) => {
                    const target = users.find((filteredUser) => filteredUser._id === targetUserId);
                    let sender: any;
                    if (senderUserId !== 'attila') {
                        sender = users.find((filteredUser) => filteredUser._id === senderUserId);
                    } else {
                        sender = { username: 'Attila' };
                    }
                    return { target, sender };
                }),
                mergeMap((data) =>
                    this.notificationDataService.add({
                        notificationUserId: data.target._id,
                        notificationUsername: data.target.username,
                        notificationUserEmail: data.target.email,
                        code: code,
                        read: false,
                        senderUserId: data.sender._id,
                        senderUsername: data.sender.username,
                        senderEmail: data.sender.email,
                        createdOn: (new Date()).toISOString()
                    })
                ),
                withLatestFrom(this.store.select(getCurrentUser)),
                map(([result, currentUser]) => {
                    if (result.notificationUserId === currentUser._id) {
                        this.notificationDataService.removeOneFromCache(result._id);
                    }
                }
                ),
                first(),
            )
            .subscribe();
    }

    deleteNotification(notification) {
        this.notificationDataService.delete(notification);
    }

    webSocketListener() {
        this.notificationSocketService.listen('notification').pipe(takeUntil(this.ngDestroyed$), debounceTime(500)).subscribe(
            () => {
                this.notificationDataService.clearCache();
                this.notificationDataService.getAll();
            },
            (error) => console.log(error)
        );
        this.userSocketService.listen('user').pipe(takeUntil(this.ngDestroyed$), debounceTime(500)).subscribe(
            () => {
                this.userDataService.getAll();
            },
            (error) => console.log(error)
        );
    }

    sendContactEmail(mailData): Observable<any> {
        this.store.dispatch(UiActions.startLoading());
        return this.http.post<any>(`${env.apiUrl}/contact`, mailData)
            .pipe(
                first(),
                map((res) => {
                    this.store.dispatch(UiActions.stopLoading());
                    return res;
                })
            );
    }

    onDestroy() {
        this.onDestroy();
    }
}

