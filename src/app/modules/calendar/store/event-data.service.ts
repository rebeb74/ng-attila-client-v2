import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { Event } from '../../../shared/model/event.model';
import * as _ from 'lodash';

@Injectable()
export class EventDataService extends DefaultDataService<Event>{
    constructor(
        http: HttpClient,
        httpUrlGenerator: HttpUrlGenerator,
        config: DefaultDataServiceConfig,
    ) {
        super('Event', http, httpUrlGenerator, config);
    }

    getAll(): Observable<Event[]> {
        return super.getAll();
    }

}
