import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { TranslateService } from '@ngx-translate/core';
import { map, take } from "rxjs/operators";
import * as fromRoot from '../../app.reducer';
import { DbService } from "./db.service";
import * as UI from '../store/ui.actions';
import { UserEntityService } from "./user-entity.service";
import { UiActions } from "../store/action-types";
import { selectCurrentLanguage, selectLanguages } from "../store/ui.reducer";
import { AppState } from "../../app.reducer";


@Injectable()
export class UIService {

    constructor(
        public translate: TranslateService,
        private snackbar: MatSnackBar,
        private store: Store<AppState>,
        private dbService: DbService,
        private userDataService: UserEntityService
    ) {

    }

    initLang() {
        this.store.select(selectLanguages).subscribe(languages => this.translate.addLangs(languages));
        this.store.select(selectCurrentLanguage).subscribe(currentLanguage => {
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
        this.store.dispatch(UiActions.setCurrentLanguage({currentLanguage: newLang}));
        this.translate.use(newLang);
        this.userDataService.entities$.pipe(take(1),map(users => users[0])).subscribe(user => {
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

}

