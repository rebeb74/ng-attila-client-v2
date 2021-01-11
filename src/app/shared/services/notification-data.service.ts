import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import { Notification } from '../model/notification.model';
import { environment } from '../../../environments/environment'
import { map, tap } from "rxjs/operators";

@Injectable()
export class NotificationDataService extends DefaultDataService<Notification>{

    constructor(
        http: HttpClient,
        httpUrlGenerator: HttpUrlGenerator,
        config: DefaultDataServiceConfig
    ) {
        super('Notification', http, httpUrlGenerator, config);
    }

    getAll(): Observable<Notification[]> {
        const userId: string = JSON.parse(localStorage.getItem('user'))
        return super.getAll()
            .pipe(
                map(notifications => notifications.filter(notification => notification.notificationUserId === userId)),
            );
    }
   
}