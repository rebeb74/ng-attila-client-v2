import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { TranslateService } from '@ngx-translate/core';
import { take } from "rxjs/operators";
import * as fromRoot from '../../app.reducer';
import { DbService } from "./db.service";
import * as UI from '../store/ui.actions';


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

    initLang() {
        this.store.dispatch(new UI.SetLanguages(this.languages));
        this.store.select(fromRoot.getLanguages).subscribe(languages => this.translate.addLangs(languages));
        this.store.select(fromRoot.getCurrentLanguage).subscribe(currentLanguage => {
            this.translate.setDefaultLang(currentLanguage)}
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
        this.store.dispatch(new UI.SetCurrentLanguage(newLang));
        this.translate.use(newLang);
        this.store.select(fromRoot.getCurrentUser).pipe(take(1)).subscribe(user => {
            if(user) {
                this.dbService.updateUserById(user._id, {...user, lang: newLang})
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