import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import { User } from '../model/user.model';
import { environment } from '../../../environments/environment'

@Injectable()
export class UserDataService extends DefaultDataService<User>{
    currentId$: Observable<string>

    constructor(
        http: HttpClient,
        httpUrlGenerator: HttpUrlGenerator
    ) {
        super('User', http, httpUrlGenerator);
    }

    
    // getById(id): Observable<User> {
    //     return this.http.get<User>(environment.apiUrl + '/user/' + id);
    // }
}