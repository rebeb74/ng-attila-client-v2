import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { TranslateService } from '@ngx-translate/core';
import { map, take, tap } from "rxjs/operators";
import { UserEntityService } from "./user-entity.service";
import { UiActions } from "../store/action-types";
import { selectCurrentLanguage, selectLanguages } from "../store/ui.reducer";
import { AppState } from "../../app.reducer";
import { NotificationEntityService } from "./notification-entity.service";
import { NotificationSocketService } from "./notification-socket.service";
import { UserSocketService } from "./user-socket.service";
import { pipe } from "rxjs";


@Injectable()
export class UIService {
    userId: string = JSON.parse(localStorage.getItem('user'))
    constructor(
        public translate: TranslateService,
        private snackbar: MatSnackBar,
        private store: Store<AppState>,
        private userDataService: UserEntityService,
        private notificationDataService: NotificationEntityService,
        private notificationSocketService: NotificationSocketService,
        private userSocketService: UserSocketService
    ) {

    }

    initLang() {
        this.store.select(selectLanguages).subscribe(languages => this.translate.addLangs(languages));
        this.store.select(selectCurrentLanguage).subscribe(currentLanguage => {
            this.translate.setDefaultLang(currentLanguage)
        }
        );
    }

    showSnackbar(message: string, option: string, duration: number, type: string) {
        var panelType: any;
        switch (type) {
            case 'error':
                panelType = ['mat-toolbar', 'mat-warn'];
                break;
            case 'success':
                panelType = ['mat-toolbar', 'mat-accent'];
                break;
        }
        var translatedMessage = this.translate.instant(message);
        this.snackbar.open(translatedMessage, option, { duration: duration, panelClass: panelType });
    }

    switchLang(newLang: string) {
        this.store.dispatch(UiActions.setCurrentLanguage({ currentLanguage: newLang }));
        this.translate.use(newLang);
        this.userDataService.entities$.pipe(take(1), map(users => users.find(user => user._id === this.userId))).subscribe(user => {
            if (user) {
                this.userDataService.update({ ...user, lang: newLang })
            }
        })
    }

    addNotification(targetUserId: string, senderUserId: string, code: string) {
        this.userDataService.entities$
            .pipe(
                take(1),
            )
            .subscribe(
                (users) => {
                    const target = users.find(filteredUser => filteredUser._id === targetUserId);
                    var sender: any;
                    if (senderUserId !== 'attila') {
                        sender = users.find(filteredUser => filteredUser._id === senderUserId);
                    } else {
                        sender = { username: 'Attila' }
                    }
                    this.notificationDataService.add({
                        notificationUserId: target._id,
                        notificationUsername: target.username,
                        notificationUserEmail: target.email,
                        code: code,
                        read: false,
                        senderUserId: sender._id,
                        senderUsername: sender.username,
                        senderEmail: sender.email,
                        createdOn: (new Date()).toISOString()
                    }).subscribe(
                        result => {
                            if (result.notificationUserId === this.userId) {
                                this.notificationDataService.removeOneFromCache(result._id)
                            }
                        }
                    )
                }
            );
    }

    webSocketListener() {
        this.notificationSocketService.listen('notification').subscribe(
            (data) => {
                if (data.notificationUserId === this.userId || data.senderUserId === this.userId) {
                        this.notificationDataService.clearCache();
                        this.notificationDataService.getAll();
                        console.log(data)
                }
            },
            (error) => console.log(error)
        );
        this.userSocketService.listen('user').subscribe(
            () => {
                this.userDataService.getAll();
            },
            (error) => console.log(error)
        );
    }

}

