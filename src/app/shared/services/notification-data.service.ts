import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import { Notification } from '../model/notification.model';
import * as _ from 'lodash';

@Injectable()
export class NotificationDataService extends DefaultDataService<Notification>{
    userId: string = JSON.parse(localStorage.getItem('user'));
    constructor(
        http: HttpClient,
        httpUrlGenerator: HttpUrlGenerator,
        config: DefaultDataServiceConfig,
    ) {
        super('Notification', http, httpUrlGenerator, config);
    }

    getAll(): Observable<Notification[]> {
        return super.getAll()
    }

}