import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable()
export class UserDataService extends DefaultDataService<User>{

    constructor(
        http: HttpClient,
        httpUrlGenerator: HttpUrlGenerator,
        config: DefaultDataServiceConfig,
    ) {
        super('User', http, httpUrlGenerator, config);
    }

    getAll(): Observable<User[]> {
        return super.getAll();
    }
}
