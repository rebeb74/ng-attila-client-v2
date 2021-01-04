import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { TranslateService } from '@ngx-translate/core';
import * as moment from "moment";
import { take } from "rxjs/operators";
import * as fromRoot from '../app.reducer';
import { DbService } from "./db.service";
import * as UI from './ui.actions';


@Injectable()
export class UIService {
    languages = ['fr', 'en', 'de'];

    constructor(
        public translate: TranslateService,
        private snackbar: MatSnackBar,
        private store: Store<fromRoot.State>,
        private dbService: DbService
    ) {

    }

    showStore() {
        this.store.select(fromRoot.getAuthState).subscribe(result => console.log('getAuthState', {...result}));
        this.store.select(fromRoot.getUiState).subscribe(result => console.log('getUiState', {...result}));
        // this.store.select(fromRoot.getCurrentLanguage).subscribe(result => console.log('getCurrentLanguage', result));
        // this.store.select(fromRoot.getCurrentUser).subscribe(result => console.log('getCurrentUser', {...result}));
        // this.store.select(fromRoot.getCurrentUserNotifications).subscribe(result => console.log('getCurrentUserNotifications', {...result}));
        // this.store.select(fromRoot.getIsAuth).subscribe(result => console.log('getIsAuth', result));
        // this.store.select(fromRoot.getLanguages).subscribe(result => console.log('getLanguages', {...result}));
    }

    initLang() {
        this.store.dispatch(new UI.SetLanguages(this.languages));
        this.store.select(fromRoot.getLanguages).subscribe(languages => this.translate.addLangs(languages));
        this.store.select(fromRoot.getCurrentLanguage).subscribe(currentLanguage => {
            moment.locale(currentLanguage);
            this.translate.setDefaultLang(currentLanguage)}
            );
        this.store.select(fromRoot.getCurrentUser).pipe(take(1)).subscribe(user => {
            if(user) {
                console.log('user', user);
            }
        })
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
        this.store.dispatch(new UI.SetCurrentLanguage(newLang));
        this.translate.use(newLang);
        this.store.select(fromRoot.getCurrentUser).pipe(take(1)).subscribe(user => {
            if(user) {
                this.dbService.getAndStoreUserNotificationsByUserId(user.userId);
                this.dbService.updateUserById(user.userId, {...user, lang: newLang})
                .then(() => {
                    console.log('User database updated with new language: ' + newLang);
                    console.log('user', user);
                })
                .catch(() => {
                    console.log('Failed to update User database with new language: ' + newLang);
                });
            }
        })
    }

    setCurrentPageName(pageName: string) {
        this.store.dispatch(new UI.SetPageName(pageName));
    }

}