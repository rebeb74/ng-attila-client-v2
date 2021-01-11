import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import { User } from '../model/user.model';
import { environment } from '../../../environments/environment'
import { map, tap } from "rxjs/operators";

@Injectable()
export class UserDataService extends DefaultDataService<User>{

    constructor(
        http: HttpClient,
        httpUrlGenerator: HttpUrlGenerator,
        config: DefaultDataServiceConfig
    ) {
        super('User', http, httpUrlGenerator, config);
    }

    getAll(): Observable<User[]> {
        const userId: string = JSON.parse(localStorage.getItem('user'))
        return super.getAll()
            .pipe(
                map(users => users.filter(user => user._id === userId['_id'])),
            );
    }
}