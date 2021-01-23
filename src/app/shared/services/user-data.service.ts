import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import { User } from '../model/user.model';
import { environment } from '../../../environments/environment'
import { map, tap, withLatestFrom } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/app.reducer";
import { selectCurrentLanguage } from "../store/ui.reducer";
import { UIService } from "./ui.service";

@Injectable()
export class UserDataService extends DefaultDataService<User>{
    userId: string = JSON.parse(localStorage.getItem('user'));

    constructor(
        http: HttpClient,
        httpUrlGenerator: HttpUrlGenerator,
        config: DefaultDataServiceConfig,
        private store: Store<AppState>,
        private uiService: UIService
    ) {
        super('User', http, httpUrlGenerator, config);
    }

    getAll(): Observable<User[]> {
        return super.getAll()
            .pipe(
                withLatestFrom(this.store.select(selectCurrentLanguage)),
                map(([users, currentLanguage]: [User[], string]) => {
                    const currentUser = users.find(user => user._id === this.userId)
                    if (currentUser.lang != currentLanguage) {
                        this.uiService.switchLang(currentUser.lang)
                    }
                    return users;
                })
            )
    }
}